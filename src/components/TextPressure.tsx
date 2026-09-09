import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

interface MousePos {
  x: number;
  y: number;
}

const dist = (a: MousePos, b: MousePos): number => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number): number => {
  const val = maxVal - Math.abs((maxVal * distance) / (maxDist || 1));
  return Math.max(minVal, val + minVal);
};

const debounce = (func: Function, delay: number) => {
  let timeoutId: any;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
}

export default function TextPressure({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',
  minFontSize = 24,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const charCentersRef = useRef<{ x: number; y: number }[]>([]);
  const titleRectRef = useRef<{ width: number; maxDist: number }>({ width: 0, maxDist: 0 });

  const mouseRef = useRef<MousePos>({ x: 0, y: 0 });
  const cursorRef = useRef<MousePos>({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const [fontSize, setFontSize] = useState<number>(minFontSize);
  const [scaleY, setScaleY] = useState<number>(1);
  const [lineHeight, setLineHeight] = useState<number>(1);

  const chars = useMemo(() => text.split(''), [text]);

  const updateCharPositions = useCallback(() => {
    if (!titleRef.current) return;
    const titleRect = titleRef.current.getBoundingClientRect();
    titleRectRef.current = {
      width: titleRect.width,
      maxDist: titleRect.width / 2,
    };

    charCentersRef.current = spansRef.current.map((span) => {
      if (!span) return { x: 0, y: 0 };
      const rect = span.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();
    let newFontSize = containerW / (chars.length * 0.65);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
      updateCharPositions();
    });
  }, [chars.length, minFontSize, scale, updateCharPositions]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            updateCharPositions();
            startLoop();
          } else {
            stopLoop();
          }
        });
      },
      { rootMargin: '100px 0px' }
    );

    observer.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      if (isVisibleRef.current) startLoop();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
      if (isVisibleRef.current) startLoop();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    function renderLoop() {
      if (!isVisibleRef.current) return;

      const dx = cursorRef.current.x - mouseRef.current.x;
      const dy = cursorRef.current.y - mouseRef.current.y;

      mouseRef.current.x += dx * 0.12;
      mouseRef.current.y += dy * 0.12;

      const maxDist = titleRectRef.current.maxDist || 300;
      const centers = charCentersRef.current;

      spansRef.current.forEach((span, i) => {
        if (!span) return;
        const charCenter = centers[i];
        if (!charCenter) return;

        const d = dist(mouseRef.current, charCenter);

        const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
        const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
        const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : '0';
        const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : '1';

        const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

        if (span.style.fontVariationSettings !== newFontVariationSettings) {
          span.style.fontVariationSettings = newFontVariationSettings;
        }
        if (alpha && span.style.opacity !== alphaVal) {
          span.style.opacity = alphaVal;
        }
      });

      // If mouse is settled, idle the RAF loop
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        rafIdRef.current = null;
        return;
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    }

    function startLoop() {
      if (rafIdRef.current === null && isVisibleRef.current) {
        rafIdRef.current = requestAnimationFrame(renderLoop);
      }
    }

    function stopLoop() {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }

    return () => {
      observer.disconnect();
      stopLoop();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [width, weight, italic, alpha, updateCharPositions]);

  const styleElement = useMemo(() => {
    return (
      <style>{`
        @import url('${fontUrl}');

        .tp-flex {
          display: flex;
          justify-content: space-between;
        }

        .tp-stroke span {
          position: relative;
          color: ${textColor};
        }
        .tp-stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>
    );
  }, [fontUrl, textColor, strokeColor]);

  const dynamicClassName = [className, flex ? 'tp-flex' : '', stroke ? 'tp-stroke' : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : textColor,
              willChange: 'font-variation-settings',
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
