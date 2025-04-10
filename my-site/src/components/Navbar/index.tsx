'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import type { NavigationItem } from '@/lib/getMarkdownLinks';

type NavbarProps = {
  links: NavigationItem[];
};

export default function Navbar({ links }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (slug: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(slug);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250); // Stay open for 250ms after mouse leaves
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <Link href="/" className={styles.navItem}>
            MySite
          </Link>
        </div>

        <button
          className={styles.toggle}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <ul className={`${styles.navList} ${open ? styles.show : ''}`}>
          {links.map((item) => (
            <li
              key={item.slug}
              className={styles.navItemWrapper}
              onMouseEnter={() => handleMouseEnter(item.slug)}
              onMouseLeave={handleMouseLeave}
            >
              {item.children && item.children.length > 0 ? (
                <>
                  <Link
                    href={`/${item.slug}`}
                    className={`${styles.navItem} ${styles.hasChildren}`}
                    // Ensure that clicking the link doesn’t get blocked by parent events.
                    onClick={(e) => {
                      // Stop the event from bubbling up if necessary.
                      e.stopPropagation();
                      setActiveDropdown(null);
                      setOpen(false);
                    }}
                    onFocus={() => setActiveDropdown(item.slug)}
                  >
                    {item.title}
                  </Link>
                  <ul
                    className={styles.dropdown}
                    style={{
                      opacity: activeDropdown === item.slug ? 1 : 0,
                      visibility: activeDropdown === item.slug ? 'visible' : 'hidden',
                      transform:
                        activeDropdown === item.slug ? 'translateY(0)' : 'translateY(10px)',
                      pointerEvents: activeDropdown === item.slug ? 'auto' : 'none',
                    }}
                  >
                    {item.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={`/${item.slug}/${child.slug}`}
                          className={styles.navItem}
                          onClick={() => setOpen(false)}
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={`/${item.slug}`}
                  className={styles.navItem}
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
