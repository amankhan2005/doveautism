import { m } from 'framer-motion';
import { fadeUp, staggerContainer, VIEWPORT } from '../../utils/motion.js';

/** Fade-up once when scrolled into view. */
export function Reveal({ as = 'div', delay = 0, children, ...rest }) {
  const Component = m[as];
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: fadeUp.hidden,
        visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay } },
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/** Parent that staggers its <StaggerItem> children into view. */
export function Stagger({ as = 'div', stagger = 0.07, delay = 0, children, ...rest }) {
  const Component = m[as];
  return (
    <Component initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={staggerContainer(stagger, delay)} {...rest}>
      {children}
    </Component>
  );
}

export function StaggerItem({ as = 'div', variants = fadeUp, children, ...rest }) {
  const Component = m[as];
  return (
    <Component variants={variants} {...rest}>
      {children}
    </Component>
  );
}
