import { useEffect, useRef, memo } from 'react';
import './DotField.css';

const TWO_PI = Math.PI * 2;

interface Dot {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

interface DotFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
}

const DotField = memo(({
  dotRadius = 1.8,
  dotSpacing = 16,
  cursorRadius = 400,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 60,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = 'rgba(11, 11, 12, 0.35)',
  gradientTo = 'rgba(11, 11, 12, 0.20)',
  glowColor = 'rgba(0, 0, 0, 0.04)',
  ...rest
}: DotFieldProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 });
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, left: 0, top: 0 });
  const glowOpacity = useRef(0);
  const engagement = useRef(0);
  const isVisibleRef = useRef(false);
  const isDirtyRef = useRef(true);
  const idleFramesRef = useRef(0);
  const glowIdRef = useRef(`dot-field-glow-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const glowEl = glowRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap DPR at 1.5 for performance
    let resizeTimer: number;

    function updateBounds() {
      if (!container || !canvas || !ctx) return;
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w === 0 || h === 0) return;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = {
        w,
        h,
        left: rect.left,
        top: rect.top,
      };

      buildDots(w, h);
      isDirtyRef.current = true;
      idleFramesRef.current = 0;
      startLoop();
    }

    function buildDots(w: number, h: number) {
      const step = dotRadius + dotSpacing;
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      const padX = (w % step) / 2;
      const padY = (h % step) / 2;
      const dots = new Array<Dot>(rows * cols);
      let idx = 0;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2;
          const ay = padY + row * step + step / 2;
          dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
        }
      }
      dotsRef.current = dots;
    }

    function onMouseMove(e: MouseEvent) {
      if (!isVisibleRef.current) return;
      const rect = container?.getBoundingClientRect();
      if (!rect) return;

      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // Check if mouse is near or inside this container
      if (
        relX >= -100 &&
        relX <= rect.width + 100 &&
        relY >= -100 &&
        relY <= rect.height + 100
      ) {
        const dx = mouseRef.current.x - relX;
        const dy = mouseRef.current.y - relY;
        mouseRef.current.speed = Math.min(Math.sqrt(dx * dx + dy * dy), 30);
        mouseRef.current.x = relX;
        mouseRef.current.y = relY;
        isDirtyRef.current = true;
        idleFramesRef.current = 0;
        startLoop();
      } else if (mouseRef.current.x !== -9999) {
        mouseRef.current.x = -9999;
        mouseRef.current.y = -9999;
        mouseRef.current.speed = 0;
        isDirtyRef.current = true;
      }
    }

    function onMouseLeave() {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      mouseRef.current.speed = 0;
      isDirtyRef.current = true;
    }

    let frameCount = 0;

    function renderFrame() {
      if (!ctx || !isVisibleRef.current) return;

      frameCount++;
      const dots = dotsRef.current;
      const m = mouseRef.current;
      const { w, h } = sizeRef.current;
      if (w === 0 || h === 0) return;

      const len = dots.length;
      const t = frameCount * 0.02;

      const targetEngagement = m.x !== -9999 ? 0.75 + Math.min(m.speed / 5, 0.25) : 0;
      engagement.current += (targetEngagement - engagement.current) * 0.1;
      if (engagement.current < 0.001) engagement.current = 0;
      const eng = engagement.current;

      glowOpacity.current += (eng - glowOpacity.current) * 0.1;

      if (glowEl) {
        if (eng > 0.01) {
          glowEl.setAttribute('cx', String(m.x));
          glowEl.setAttribute('cy', String(m.y));
          glowEl.style.opacity = String(glowOpacity.current);
        } else if (parseFloat(glowEl.style.opacity || '0') > 0) {
          glowEl.style.opacity = '0';
        }
      }

      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, gradientFrom);
      grad.addColorStop(1, gradientTo);
      ctx.fillStyle = grad;

      const cr = cursorRadius;
      const crSq = cr * cr;
      const rad = dotRadius / 2;
      let hasMovement = false;

      ctx.beginPath();

      for (let i = 0; i < len; i++) {
        const d = dots[i];
        if (!d) continue;

        if (eng > 0.01) {
          const dx = m.x - d.ax;
          const dy = m.y - d.ay;
          const distSq = dx * dx + dy * dy;

          if (distSq < crSq) {
            const dist = Math.sqrt(distSq);
            if (bulgeOnly) {
              const t = 1 - dist / cr;
              const push = t * t * bulgeStrength * eng;
              const angle = Math.atan2(dy, dx);
              d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
              d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
            } else {
              const angle = Math.atan2(dy, dx);
              const move = (400 / (dist || 1)) * (m.speed * cursorForce);
              d.vx += Math.cos(angle) * -move;
              d.vy += Math.sin(angle) * -move;
            }
            hasMovement = true;
          } else if (bulgeOnly) {
            const diffX = d.ax - d.sx;
            const diffY = d.ay - d.sy;
            if (Math.abs(diffX) > 0.1 || Math.abs(diffY) > 0.1) {
              d.sx += diffX * 0.1;
              d.sy += diffY * 0.1;
              hasMovement = true;
            } else {
              d.sx = d.ax;
              d.sy = d.ay;
            }
          }
        } else {
          const diffX = d.ax - d.sx;
          const diffY = d.ay - d.sy;
          if (Math.abs(diffX) > 0.1 || Math.abs(diffY) > 0.1) {
            d.sx += diffX * 0.1;
            d.sy += diffY * 0.1;
            hasMovement = true;
          } else {
            d.sx = d.ax;
            d.sy = d.ay;
          }
        }

        if (!bulgeOnly) {
          d.vx *= 0.9;
          d.vy *= 0.9;
          d.x = d.ax + d.vx;
          d.y = d.ay + d.vy;
          d.sx += (d.x - d.sx) * 0.1;
          d.sy += (d.y - d.sy) * 0.1;
          if (Math.abs(d.vx) > 0.05 || Math.abs(d.vy) > 0.05) hasMovement = true;
        }

        let drawX = d.sx;
        let drawY = d.sy;

        if (waveAmplitude > 0) {
          drawY += Math.sin(d.ax * 0.03 + t) * waveAmplitude;
          drawX += Math.cos(d.ay * 0.03 + t * 0.7) * waveAmplitude * 0.5;
          hasMovement = true;
        }

        ctx.moveTo(drawX + rad, drawY);
        ctx.arc(drawX, drawY, rad, 0, TWO_PI);
      }

      ctx.fill();

      // Idle detection: If nothing is moving and mouse is absent, sleep the RAF loop to save 100% CPU!
      if (!hasMovement && eng === 0 && waveAmplitude === 0) {
        idleFramesRef.current++;
        if (idleFramesRef.current > 15) {
          rafRef.current = null;
          return; // Sleep until mouse or visibility change
        }
      } else {
        idleFramesRef.current = 0;
      }

      rafRef.current = requestAnimationFrame(renderFrame);
    }

    function startLoop() {
      if (!rafRef.current && isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(renderFrame);
      }
    }

    function stopLoop() {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    // IntersectionObserver so off-screen sections consume ZERO resources
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisibleRef.current = true;
            idleFramesRef.current = 0;
            startLoop();
          } else {
            isVisibleRef.current = false;
            stopLoop();
          }
        });
      },
      { rootMargin: '100px 0px' }
    );

    observer.observe(container);

    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateBounds, 100);
    });
    resizeObserver.observe(container);

    updateBounds();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      stopLoop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    waveAmplitude,
    gradientFrom,
    gradientTo,
  ]);

  return (
    <div ref={containerRef} className="dot-field-container" {...rest}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <radialGradient id={glowIdRef.current}>
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle
          ref={glowRef}
          cx="-9999"
          cy="-9999"
          r={glowRadius}
          fill={`url(#${glowIdRef.current})`}
          style={{ opacity: 0, willChange: 'opacity' }}
        />
      </svg>
    </div>
  );
});

DotField.displayName = 'DotField';

export default DotField;
