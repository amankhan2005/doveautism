import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

/**
 * Official Dove Autism logo (supplied by the client).
 * Files live in /public/brand. The artwork is used unaltered — only the
 * screenshot frame and grey canvas were removed so it works on light surfaces.
 * Never place it directly on navy or other dark backgrounds: use `panel`.
 */
export const LOGO = Object.freeze({
  width: 2086, // intrinsic size of the source artwork (keeps the aspect ratio)
  height: 892,
  src: '/brand/dove-autism-logo-480.webp',
  srcSet: '/brand/dove-autism-logo-240.webp 240w, /brand/dove-autism-logo-480.webp 480w, /brand/dove-autism-logo-960.webp 960w',
});

export function LogoImage({ className = '', alt = 'Dove Autism', sizes = '(min-width: 960px) 141px, 122px', loading = 'eager' }) {
  return (
    <img
      className={`${styles.img} ${className}`}
      src={LOGO.src}
      srcSet={LOGO.srcSet}
      sizes={sizes}
      width={LOGO.width}
      height={LOGO.height}
      alt={alt}
      loading={loading}
      decoding="async"
    />
  );
}

/** Logo linking home. `panel` puts it on a white card for dark surfaces. */
export function Logo({ panel = false, onClick, loading }) {
  return (
    <Link to="/" className={`${styles.logo} ${panel ? styles.panel : ''}`} onClick={onClick}>
      <LogoImage alt="Dove Autism — home" loading={loading} />
    </Link>
  );
}
