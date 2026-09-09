import { useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import './ScrollStack.css';

interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ScrollStackItem = ({ children, itemClassName = '', onMouseMove }: ScrollStackItemProps) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} onMouseMove={onMouseMove}>
    {children}
  </div>
);

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  rotationAmount?: number;
  onStackComplete?: () => void;
}

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  onStackComplete,
}: ScrollStackProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const scrollFrameRef = useRef<number | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const cardOffsetsRef = useRef<number[]>([]);
  const endOffsetRef = useRef<number>(0);
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  // Measure and cache all layout offsets once, preventing layout thrashing during scroll
  const measureOffsets = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card')) as HTMLDivElement[];
    cardsRef.current = cards;

    const scrollY = window.scrollY;
    cardOffsetsRef.current = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return rect.top + scrollY;
    });

    const endElement = scroller.querySelector('.scroll-stack-end');
    if (endElement) {
      const endRect = endElement.getBoundingClientRect();
      endOffsetRef.current = endRect.top + scrollY;
    }
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const scrollTop = window.scrollY;
    const containerHeight = window.innerHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElementTop = endOffsetRef.current || 999999;
    const cardTops = cardOffsetsRef.current;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardTop = cardTops[i] || 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      card.style.transform = `translate3d(0, ${Math.round(translateY)}px, 0) scale(${Math.round(scale * 1000) / 1000}) rotate(${Math.round(rotation * 10) / 10}deg)`;

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
  ]);

  const handleScroll = useCallback(() => {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      updateCardTransforms();
    });
  }, [updateCardTransforms]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card')) as HTMLDivElement[];
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.transform = 'translate3d(0, 0, 0)';
    });

    measureOffsets();
    updateCardTransforms();

    const handleResize = () => {
      measureOffsets();
      updateCardTransforms();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      stackCompletedRef.current = false;
      cardsRef.current = [];
      isUpdatingRef.current = false;
    };
  }, [itemDistance, measureOffsets, updateCardTransforms, handleScroll]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
