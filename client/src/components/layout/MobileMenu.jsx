import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { Logo } from '../ui/Logo.jsx';
import { ButtonLink } from '../ui/Button.jsx';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { PRIMARY_NAV, PRIMARY_CTA } from '../../content/navigation.js';
import { VERIFIED } from '../../content/site.js';
import styles from './MobileMenu.module.css';

const list = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);
  useFocusTrap(panelRef, open, onClose);
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <m.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <m.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className={styles.panel}
            initial={{ y: '-6%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-4%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
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
                    <NavLink to={n.to} end={n.end} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                      {n.label}
                    </NavLink>
                  </m.li>
                ))}
              </m.ul>
            </nav>
            <div className={styles.bottom}>
              <ButtonLink to={PRIMARY_CTA.to} block size="lg">
                {PRIMARY_CTA.label}
              </ButtonLink>
              <p className={styles.tagline}>{VERIFIED.tagline}</p>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
