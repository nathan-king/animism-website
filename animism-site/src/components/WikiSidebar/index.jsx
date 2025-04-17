import { useState } from 'react';
import styles from './WikiSidebar.module.css';

export default function WikiSidebar({ entries }) {
  const [query, setQuery] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = entries.filter(entry =>
    entry.data.title.toLowerCase().includes(query.toLowerCase())
  );

  const postsByCategory = entries.reduce((acc, entry) => {
    const category = entry.data.category || 'Uncategorised';
    acc[category] = acc[category] || [];
    acc[category].push(entry);
    return acc;
  }, {});

  const handleKeyDown = e => {
    if (e.key === 'Enter' && filtered.length) {
      window.location.href = `/library/${filtered[0].slug}`;
    }
  };

  const toggleCategory = category => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <>
      {/* Mobile toggle button (magnifier icon) */}
      <button
        className={styles.sidebarToggle}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setSidebarOpen(o => !o)}
      >
        {sidebarOpen ? '✕' : '🔍'}
      </button>

      <aside className={`${styles.wikiSidebar} ${sidebarOpen ? styles.open : ''}`}>
        <form onSubmit={e => e.preventDefault()} style={{ position: 'relative' }}>
          <input
            type="search"
            placeholder="Search chapters..."
            value={query}
            className={`${styles.searchInput} ${filtered.length > 0 ? styles.hasDropdown : ''}`}
            onChange={e => {
              setQuery(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => setShowDropdown(Boolean(query))}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onKeyDown={handleKeyDown}
          />

          {showDropdown && (
            <ul className={styles.dropdown}>
              {filtered.length > 0 ? (
                <>
                  <li><hr className={styles.dropdownDivider} /></li>
                  {filtered.map(entry => (
                    <li key={entry.slug}>
                      <a href={`/library/${entry.slug}`}>{entry.data.title}</a>
                    </li>
                  ))}
                </>
              ) : (
                <li className={styles.noMatch}>No results found</li>
              )}
            </ul>
          )}
        </form>

        <h2>Topics</h2>
        {Object.entries(postsByCategory).map(([category, items]) => (
          <div key={category} className={styles.categoryGroup}>
            <button
              type="button"
              className={styles.categoryToggle}
              onClick={() => toggleCategory(category)}
            >
              {openCategories[category] ? '▼' : '▶'} {category}
            </button>

            {openCategories[category] && (
              <ul className={styles.postList}>
                {items.map(entry => (
                  <li key={entry.slug}>
                    <a href={`/library/${entry.slug}`}>{entry.data.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </aside>
    </>
  );
}
