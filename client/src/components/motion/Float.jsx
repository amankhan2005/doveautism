import { m, useReducedMotion } from 'framer-motion';

/**
 * Gentle floating loop for a few decorative shapes only.
 * Disabled entirely for visitors who prefer reduced motion.
 */
export function Float({ children, distance = 10, duration = 7, delay = 0, rotate = 0, ...rest }) {
  const reduce = useReducedMotion();
  if (reduce) return <g {...rest}>{children}</g>;
  return (
    <m.g
      animate={{ y: [0, -distance, 0], rotate: rotate ? [0, rotate, 0] : 0 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      {...rest}
    >
      {children}
    </m.g>
  );
}
