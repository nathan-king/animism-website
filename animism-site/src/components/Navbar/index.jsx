// src/components/Navbar/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import lightLogo from '../../assets/brand-light.svg?url';
import darkLogo  from '../../assets/brand-dark.svg?url';

export default function Navbar({ pages }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  // Read saved theme (or OS preference) on client only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
    } else {
      const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(osDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to <html> and persist on client only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const logoSrc = theme === 'dark' ? darkLogo : lightLogo;
  const iconEmoji = theme === 'dark' ? '☀️' : '🌒';

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Brand */}
        <a className={styles.brand} href="/">
          <img
            src={logoSrc}
            alt="The Encosmic Path"
            className={styles.brandImage}
          />
        </a>

        {/* Theme toggle */}
        <button
          className={styles.toggleButton}
          onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle theme"
        >
          {iconEmoji}
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
                className={`${styles.navItem} ${
                  page.children?.length ? styles.hasChildren : ''
                }`}
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
