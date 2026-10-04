import { PHOTO_DIR } from '../../content/photos.js';
import styles from './Photo.module.css';

/**
 * Layout-stable photo frame. The frame shape comes from the slot (`photo.ratio`)
 * and the image covers it, so swapping a placeholder for a real photo never moves
 * the layout. Real photos with pipeline variants get AVIF → WebP srcsets.
 * `priority` is only for above-the-fold images (eager + high fetch priority).
 */
export function Photo({ photo, sizes, priority = false, className = '' }) {
  const loading = priority ? 'eager' : 'lazy';
  const imgProps = {
    className: styles.img,
    width: photo.width,
    height: photo.height,
    alt: photo.alt,
    loading,
    decoding: priority ? 'sync' : 'async',
    fetchpriority: priority ? 'high' : 'auto',
    'data-photo-slot': photo.slot,
    'data-placeholder': photo.placeholder ? 'true' : undefined,
  };

  if (photo.widths?.length) {
    const set = (ext) => photo.widths.map((w) => `${PHOTO_DIR}/${photo.slot}-${w}.${ext} ${w}w`).join(', ');
    const fallback = photo.widths[Math.min(1, photo.widths.length - 1)];
    return (
      <picture className={`${styles.frame} ${className}`} style={{ aspectRatio: photo.ratio }}>
        <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
        <img {...imgProps} src={`${PHOTO_DIR}/${photo.slot}-${fallback}.webp`} />
      </picture>
    );
  }

  return (
    <span className={`${styles.frame} ${className}`} style={{ aspectRatio: photo.ratio }}>
      <img {...imgProps} src={photo.src} />
    </span>
  );
}
