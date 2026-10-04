import styles from './Container.module.css';

export function Container({ as: Component = 'div', size = 'default', className = '', children, ...rest }) {
  return (
    <Component className={`${styles.container} ${styles[size]} ${className}`} {...rest}>
      {children}
    </Component>
  );
}
