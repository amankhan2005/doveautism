import styles from './Section.module.css';

/** Vertical rhythm + background band. `tone`: white | mist | dawn | lagoon */
export function Section({ as: Component = 'section', tone = 'white', spacing = 'default', className = '', children, ...rest }) {
  return (
    <Component className={`${styles.section} ${styles[tone]} ${styles[`space-${spacing}`]} ${className}`} {...rest}>
      {children}
    </Component>
  );
}
