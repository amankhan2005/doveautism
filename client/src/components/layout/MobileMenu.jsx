import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Logo } from '../ui/Logo.jsx';
import { ButtonLink } from '../ui/Button.jsx';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { PRIMARY_NAV, PRIMARY_CTA } from '../../content/navigation.js';
import { VERIFIED } from '../../content/site.js';
import styles from './MobileMenu.module.css';

const EASE = [0.22, 1, 0.36, 1];
const list = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } } };

export function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);
  useFocusTrap(panelRef, open, onClose);
  useLockBodyScroll(open);

  // Portalled to <body>: the header's backdrop-filter would otherwise confine the fixed backdrop to the header box.
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.05 } }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <m.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className={styles.panel}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.36, ease: EASE } }}
            exit={{ y: -16, opacity: 0, transition: { duration: 0.2, ease: EASE } }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.top}>
              <Logo onClick={onClose} />
              <button type="button" className={styles.close} onClick={onClose}>
                <X aria-hidden="true" strokeWidth={2} />
                <span className="visually-hidden">Close menu</span>
              </button>
            </div>
            <nav aria-label="Mobile">
              <m.ul className={styles.links} variants={list} initial="hidden" animate="visible">
                {PRIMARY_NAV.map((n) => (
                  <m.li key={n.to} variants={item}>
                    <NavLink to={n.to} end={n.end} onClick={onClose} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                      <span>{n.label}</span>
                      <ChevronRight className={styles.chevron} aria-hidden="true" strokeWidth={2} />
                    </NavLink>
                  </m.li>
                ))}
              </m.ul>
            </nav>
            <div className={styles.bottom}>
              <ButtonLink to={PRIMARY_CTA.to} block size="lg" onClick={onClose}>
                {PRIMARY_CTA.label}
              </ButtonLink>
              <p className={styles.tagline}>{VERIFIED.tagline}</p>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
