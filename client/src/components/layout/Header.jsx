import { useEffect, useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Logo } from '../ui/Logo.jsx';
import { ButtonLink } from '../ui/Button.jsx';
import { Container } from '../ui/Container.jsx';
import { MobileMenu } from './MobileMenu.jsx';
import { PRIMARY_NAV, PRIMARY_CTA } from '../../content/navigation.js';
import styles from './Header.module.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <Container size="wide" className={styles.inner}>
        <Logo />
        <nav aria-label="Main" className={styles.nav}>
          <ul className={styles.links}>
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                  <span className={styles.linkText}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <ButtonLink to={PRIMARY_CTA.to} size="sm" className={styles.cta}>
            {PRIMARY_CTA.label}
          </ButtonLink>
        </nav>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu aria-hidden="true" strokeWidth={2} />
          <span>Menu</span>
        </button>
      </Container>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
