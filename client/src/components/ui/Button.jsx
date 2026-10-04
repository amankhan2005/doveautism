import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import styles from './Button.module.css';

const MotionLink = m.create(Link);

const hover = { y: -2 };
const tap = { scale: 0.98 };

function classes(variant, size, block, className) {
  return [styles.button, styles[variant], styles[size], block ? styles.block : '', className].filter(Boolean).join(' ');
}

/** Internal route link styled as a button. */
export function ButtonLink({ to, variant = 'primary', size = 'md', block = false, className, icon: Icon, children, ...rest }) {
  return (
    <MotionLink to={to} className={classes(variant, size, block, className)} whileHover={hover} whileTap={tap} {...rest}>
      <span>{children}</span>
      {Icon && <Icon className={styles.icon} aria-hidden="true" strokeWidth={2} />}
    </MotionLink>
  );
}

/** External link styled as a button. */
export function ButtonAnchor({ href, variant = 'primary', size = 'md', block = false, className, icon: Icon, children, ...rest }) {
  return (
    <m.a href={href} className={classes(variant, size, block, className)} whileHover={hover} whileTap={tap} {...rest}>
      <span>{children}</span>
      {Icon && <Icon className={styles.icon} aria-hidden="true" strokeWidth={2} />}
    </m.a>
  );
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', block = false, className, icon: Icon, type = 'button', children, disabled, ...rest },
  ref
) {
  return (
    <m.button
      ref={ref}
      type={type}
      className={classes(variant, size, block, className)}
      whileHover={disabled ? undefined : hover}
      whileTap={disabled ? undefined : tap}
      disabled={disabled}
      {...rest}
    >
      <span>{children}</span>
      {Icon && <Icon className={styles.icon} aria-hidden="true" strokeWidth={2} />}
    </m.button>
  );
});

/** Text link with an animated underline — for tertiary actions. */
export function TextLink({ to, className = '', children, ...rest }) {
  return (
    <Link to={to} className={`${styles.textLink} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
