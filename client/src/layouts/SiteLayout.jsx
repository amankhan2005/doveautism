import { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { Header } from '../components/layout/Header.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { SkipLink } from '../components/ui/SkipLink.jsx';
import styles from './SiteLayout.module.css';

/** Keeps the outgoing page rendered while it animates out. */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

function PageLoader() {
  return (
    <div className={styles.loader} role="status">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className="visually-hidden">Loading page</span>
    </div>
  );
}

function findHashTarget(location) {
  return location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
}

/**
 * Scroll to the hash target once it exists (lazy pages mount a moment after
 * navigation), otherwise to the top. Returns a cancel function.
 */
function scrollWhenReady(location, onDone) {
  if (!location.hash) {
    window.scrollTo(0, 0);
    onDone?.(false);
    return () => {};
  }
  let tries = 0;
  const id = setInterval(() => {
    const el = findHashTarget(location);
    tries += 1;
    if (el || tries > 30) {
      clearInterval(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        const heading = el.querySelector('h2[tabindex="-1"], h1, h2');
        heading?.focus?.({ preventScroll: true });
      } else {
        window.scrollTo(0, 0);
      }
      onDone?.(Boolean(el));
    }
  }, 60);
  return () => clearInterval(id);
}

export function SiteLayout() {
  const location = useLocation();
  const mainRef = useRef(null);
  const locationRef = useRef(location);
  const prevPath = useRef(location.pathname);
  locationRef.current = location;

  const cancelScroll = useRef(() => {});

  // First load with a hash (e.g. /services#in-home-aba).
  useEffect(() => {
    if (location.hash) cancelScroll.current = scrollWhenReady(location);
    return () => cancelScroll.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Same-page hash changes (no page transition happens).
  useEffect(() => {
    if (prevPath.current === location.pathname && location.hash) {
      cancelScroll.current();
      cancelScroll.current = scrollWhenReady(location);
    }
    prevPath.current = location.pathname;
  }, [location]);

  function handleExitComplete() {
    cancelScroll.current();
    cancelScroll.current = scrollWhenReady(locationRef.current, (hadTarget) => {
      // Move focus to the new page so screen readers start from its content.
      if (!hadTarget) mainRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <div className={styles.shell}>
      <SkipLink />
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
        <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
          <m.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<PageLoader />}>
              <FrozenOutlet />
            </Suspense>
          </m.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
