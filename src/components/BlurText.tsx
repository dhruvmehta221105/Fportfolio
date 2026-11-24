import { motion, useReducedMotion } from 'framer-motion';

type BlurTextProps = {
  text: string;
  className?: string;
  active: boolean;
  delay?: number;
  stepDuration?: number;
  blur?: number;
  distance?: number;
};

export default function BlurText({
  text,
  className,
  active,
  delay = 200,
  stepDuration = 0.35,
  blur = 10,
  distance = 50
}: BlurTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <p className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          initial={false}
          animate={
            active
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: -distance, filter: `blur(${Math.max(0, blur)}px)` }
          }
          transition={{
            duration: reduceMotion || !active ? 0 : stepDuration,
            delay: active && !reduceMotion ? (delay / 1000) * index : 0,
            ease: [0.33, 1, 0.68, 1]
          }}
        >
          {word}{index < words.length - 1 ? '\u00a0' : ''}
        </motion.span>
      ))}
    </p>
  );
}
