import { useState, useEffect, useRef, useCallback } from 'react';
import useTheme from '../../hooks/useTheme';
import styles from './Navbar.module.css';
import lightLogo       from '../../assets/brand-light.svg?url';
import lightLogoStacked from '../../assets/brand-light-stacked.svg?url';
import { Sun, Moon } from 'phosphor-react';

export default function Navbar({ pages }) {
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  // Close mobile menu on outside click
  const handleClickOutside = useCallback((e) => {
    if (
      navRef.current &&
      !navRef.current.contains(e.target) &&
      toggleRef.current &&
      !toggleRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, handleClickOutside]);

  const icon = theme === 'dark'
    ? <Sun size={24} weight="bold" className={styles.sun} />
    : <Moon size={24} weight="bold" className={styles.moon} />;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Brand/logo */}
        <a href="/" className={styles.brand}>
          <picture>
            {/* Stacked logo on small screens */}
            <source
              srcSet={lightLogoStacked}
              media="(max-width: 768px)"
            />
            {/* Default logo */}
            <img
              src={lightLogo}
              alt="The Encosmic Path"
              className={styles.brandImage}
              loading="eager"
            />
          </picture>
        </a>

        {/* Theme toggle */}
        <button
          className={styles.toggleButton}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {icon}
        </button>

        {/* Mobile menu toggle */}
        <button
          ref={toggleRef}
          className={styles.toggle}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? '✕' : '☰'}
        </button>

        {/* Navigation links */}
        <ul
          ref={navRef}
          className={`${styles.navList} ${open ? styles.open : ''}`}
        >
          {pages.map(page => (
            <li key={page.slug} className={styles.navItemWrapper}>
              <a
                href={`/${page.slug}`}
                className={`${styles.navItem} ${page.children?.length ? styles.hasChildren : ''}`}
              >
                {page.title}
              </a>
              {page.children?.length > 0 && (
                <ul className={styles.dropdown}>
                  {page.children.map(child => (
                    <li key={child.slug}>
                      <a href={`/${child.slug}`} className={styles.navItem}>
                        {child.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className={styles.navItemWrapper}>
            <a href="/library" className={styles.navItem}>
              The Library
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
