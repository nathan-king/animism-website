import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ pages }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a className={styles.brand} href="/">The Encosmic Path</a>

        {/* ☰ / ✕ Mobile toggle */}
        <button
          className={styles.toggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(o => !o)}
        >
          {open ? '✕' : '☰'}
        </button>

        <ul className={`${styles.navList} ${open ? styles.open : ''}`}>
          {pages.map(page => (
            <li key={page.slug} className={styles.navItemWrapper}>
              <a
                href={`/${page.slug}`}
                className={`${styles.navItem} ${page.children?.length ? styles.hasChildren : ''}`}>
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
            <a href="/library" className={styles.navItem}>The Library</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
