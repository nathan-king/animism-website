// src/components/Navbar/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ pages }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      // if click is neither on the navList nor the toggle button, close
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a className={styles.brand} href="/">
          The Encosmic Path
        </a>

        {/* ☰ / ✕ Mobile toggle */}
        <button
          ref={toggleRef}
          className={styles.toggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(o => !o)}
        >
          {open ? '✕' : '☰'}
        </button>

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
