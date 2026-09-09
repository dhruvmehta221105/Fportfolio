import React, { forwardRef, useMemo, useRef, useEffect, useCallback } from 'react';
import './VariableProximity.css';

interface VariableProximityProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings = "'wght' 400, 'opsz' 9",
    toFontVariationSettings = "'wght' 800, 'opsz' 40",
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letterPositionsRef = useRef<{ x: number; y: number }[]>([]);
  const containerRectRef = useRef<{ left: number; top: number } | null>(null);
  const isVisibleRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map<string, number>(
        settingsStr
          .split(',')
          .map((s) => s.trim())
          .map((s) => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateFalloff = useCallback(
    (distance: number) => {
      const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case 'exponential':
          return norm ** 2;
        case 'gaussian':
          return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        case 'linear':
        default:
          return norm;
      }
    },
    [falloff, radius]
  );

  // Cache letter positions to completely prevent layout thrashing during mouse move
  const updateLetterPositions = useCallback(() => {
    if (!containerRef?.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    containerRectRef.current = { left: containerRect.left, top: containerRect.top };

    letterPositionsRef.current = letterRefs.current.map((letterRef) => {
      if (!letterRef) return { x: 0, y: 0 };
      const rect = letterRef.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      };
    });
  }, [containerRef]);

  useEffect(() => {
    updateLetterPositions();
    const handleResize = () => updateLetterPositions();
    window.addEventListener('resize', handleResize);

    const container = containerRef?.current;
    if (!container) return () => window.removeEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            updateLetterPositions();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(container);

    let lastX = -9999;
    let lastY = -9999;

    const processProximity = (clientX: number, clientY: number) => {
      if (!isVisibleRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseX = clientX - containerRect.left;
      const mouseY = clientY - containerRect.top;

      const positions = letterPositionsRef.current;
      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;
        const pos = positions[index];
        if (!pos) return;

        const dx = mouseX - pos.x;
        const dy = mouseY - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= radius) {
          if (letterRef.style.fontVariationSettings !== fromFontVariationSettings) {
            letterRef.style.fontVariationSettings = fromFontVariationSettings;
          }
          return;
        }

        const falloffValue = calculateFalloff(distance);
        const newSettings = parsedSettings
          .map(({ axis, fromValue, toValue }) => {
            const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
            return `'${axis}' ${Math.round(interpolatedValue * 10) / 10}`;
          })
          .join(', ');

        letterRef.style.fontVariationSettings = newSettings;
      });
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastX = clientX;
      lastY = clientY;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          processProximity(lastX, lastY);
        });
      }
    };

    const handlePointerLeave = () => {
      letterRefs.current.forEach((letterRef) => {
        if (letterRef && letterRef.style.fontVariationSettings !== fromFontVariationSettings) {
          letterRef.style.fontVariationSettings = fromFontVariationSettings;
        }
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [containerRef, calculateFalloff, fromFontVariationSettings, parsedSettings, radius, updateLetterPositions]);

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <span
                key={currentLetterIndex}
                ref={(el: HTMLSpanElement | null) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: fromFontVariationSettings,
                  transition: 'font-variation-settings 0.1s ease-out',
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
