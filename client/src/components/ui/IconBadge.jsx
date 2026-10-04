import styles from './IconBadge.module.css';

/** Lucide icon inside a soft colored shape. Decorative unless `label` is given. */
export function IconBadge({ icon: Icon, color = 'var(--navy-tint)', size = 'md', shape = 'round', label }) {
  return (
    <span
      className={`${styles.badge} ${styles[size]} ${styles[shape]}`}
      style={{ '--badge-bg': color }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      <Icon strokeWidth={1.75} className={styles.icon} />
    </span>
  );
}
