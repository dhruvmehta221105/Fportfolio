import { useEffect, useRef, type CSSProperties } from 'react';
import './ParticleText.css';

export interface ParticleTextProps {
  text?: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  scatter?: number;
  gatherDuration?: number;
  pointerRepel?: number;
  repelRadius?: number;
  clickBurst?: boolean;
  burstStrength?: number;
  idleDrift?: number;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  className?: string;
  style?: CSSProperties;
}

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  seed: number;
  vx: number;
  vy: number;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const ParticleText = ({
  text = 'Technical Skills',
  particleSize = 2,
  density = 4,
  color = '#0b0b0c',
  highlightColor = '#1f6b46',
  scatter = 190,
  gatherDuration = 1600,
  pointerRepel = 42,
  repelRadius = 120,
  clickBurst = true,
  burstStrength = 1,
  idleDrift = 0.8,
  fontSize = 'clamp(3.5rem, 13vw, 9rem)',
  fontWeight = 800,
  fontFamily = 'inherit',
  className = '',
  style
}: ParticleTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!container || !canvas || !context) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particles: Particle[] = [];
    const pointer = { active: false, x: 0, y: 0 };
    let startedAt = 0;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;
    let burst = 0;
    let alive = true;

    const getFont = (size: number): string =>
      `${fontWeight} ${size}px ${
        fontFamily === 'inherit'
          ? window.getComputedStyle(container).fontFamily
          : fontFamily
      }`;

    const sampleText = () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));

      const probe = document.createElement('span');
      probe.textContent = text;
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${getFont(
        96
      )};font-size:${typeof fontSize === 'number' ? `${fontSize}px` : fontSize}`;
      container.appendChild(probe);
      const resolvedSize = parseFloat(window.getComputedStyle(probe).fontSize) || 96;
      probe.remove();

      const layer = document.createElement('canvas');
      const layerContext = layer.getContext('2d', { willReadFrequently: true });
      if (!layerContext) return;

      layerContext.font = getFont(resolvedSize);
      const metrics = layerContext.measureText(text);
      const maxWidth = width * 0.92;
      const scale = metrics.width > maxWidth ? maxWidth / metrics.width : 1;
      const actualSize = resolvedSize * scale;
      layerContext.font = getFont(actualSize);
      const textWidth = Math.max(1, layerContext.measureText(text).width);
      const textHeight = actualSize * 1.15;
      layer.width = Math.ceil(textWidth + actualSize * 0.2);
      layer.height = Math.ceil(textHeight + actualSize * 0.2);
      layerContext.clearRect(0, 0, layer.width, layer.height);
      layerContext.font = getFont(actualSize);
      layerContext.textBaseline = 'middle';
      layerContext.fillStyle = '#fff';
      layerContext.fillText(text, actualSize * 0.1, layer.height / 2);

      const pixels = layerContext.getImageData(0, 0, layer.width, layer.height).data;
      const step = Math.max(2, Math.floor(density));
      const targets: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < layer.height; y += step) {
        for (let x = 0; x < layer.width; x += step) {
          if (pixels[(y * layer.width + x) * 4 + 3] > 45) {
            targets.push({
              x: (width - layer.width) / 2 + x,
              y: (height - layer.height) / 2 + y
            });
          }
        }
      }

      particles.length = 0;
      for (const target of targets) {
        const seed = Math.random();
        const angle = seed * Math.PI * 2;
        const distance = motionQuery.matches ? 0 : scatter * (0.35 + seed * 0.65);
        particles.push({
          targetX: target.x,
          targetY: target.y,
          startX: target.x + Math.cos(angle) * distance,
          startY: target.y + Math.sin(angle) * distance,
          x: target.x + Math.cos(angle) * distance,
          y: target.y + Math.sin(angle) * distance,
          seed,
          vx: 0,
          vy: 0
        });
      }
    };

    const locate = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const handlePointerMove = (event: PointerEvent) => {
      locate(event);
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!clickBurst || motionQuery.matches) return;
      locate(event);
      burst = 1;
    };

    const draw = (now: number) => {
      if (!alive) return;
      const elapsed = startedAt ? now - startedAt : 0;
      const intro = motionQuery.matches
        ? startedAt
          ? 1
          : 0
        : clamp(elapsed / gatherDuration, 0, 1);
      const eased = 1 - Math.pow(1 - intro, 3);
      const seconds = now / 1000;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;

      for (const particle of particles) {
        const targetX = particle.startX + (particle.targetX - particle.startX) * eased;
        const targetY = particle.startY + (particle.targetY - particle.startY) * eased;
        particle.x += (targetX - particle.x) * 0.16;
        particle.y += (targetY - particle.y) * 0.16;

        if (!motionQuery.matches) {
          particle.x += Math.sin(seconds * 0.9 + particle.seed * 10) * idleDrift * 0.08;
          particle.y += Math.cos(seconds * 0.75 + particle.seed * 10) * idleDrift * 0.08;
        }

        if (pointer.active && !motionQuery.matches) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < repelRadius) {
            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;
            particle.x += (dx / distance) * force * 0.08;
            particle.y += (dy / distance) * force * 0.08;
          }
        }

        if (burst > 0) {
          particle.vx += (particle.x - width / 2) * burstStrength * 0.0015;
          particle.vy += (particle.y - height / 2) * burstStrength * 0.0015;
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.92;
          particle.vy *= 0.92;
        }

        const distanceFromTarget = Math.hypot(particle.x - particle.targetX, particle.y - particle.targetY);
        const highlight = clamp(distanceFromTarget / 80, 0, 1);
        context.fillStyle = highlight > 0.25 ? highlightColor : color;
        const size = particleSize * (0.75 + particle.seed * 0.45);
        context.beginPath();
        context.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2);
        context.fill();
      }

      burst *= 0.94;
      animationFrame = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(sampleText);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedAt) return;
        startedAt = performance.now();
      },
      { threshold: 0.35 }
    );
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('pointerdown', handlePointerDown);
    sampleText();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [
    text,
    particleSize,
    density,
    color,
    highlightColor,
    scatter,
    gatherDuration,
    pointerRepel,
    repelRadius,
    clickBurst,
    burstStrength,
    idleDrift,
    fontSize,
    fontWeight,
    fontFamily
  ]);

  return (
    <div ref={containerRef} className={`particle-text ${className}`.trim()} style={style}>
      <canvas ref={canvasRef} className="particle-text__canvas" aria-hidden="true" />
      <span className="particle-text__sr">{text}</span>
    </div>
  );
};

export default ParticleText;
