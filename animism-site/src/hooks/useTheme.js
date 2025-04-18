// src/hooks/useTheme.js
import { useState, useEffect, useCallback } from 'react';

/**
 * useTheme hook
 * - Reads & persists user preference
 * - Applies data-theme attribute on <html>
 * - Returns [theme, toggleTheme]
 * - Temporarily adds 'theme-transition' class to scope animations
 */
export default function useTheme() {
  // Determine initial theme synchronously
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Initialize state with getInitialTheme
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply the theme attribute and persist changes on update
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  /**
   * Toggle theme between 'light' and 'dark'
   * Wrap in 'theme-transition' class to scope CSS transitions
   */
  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    // 1) add transition class
    html.classList.add('theme-transition');
    // 2) flip theme
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    // 3) remove transition class after CSS transition ends
    const handleTransitionEnd = (e) => {
      if (e.target === html && e.propertyName === 'background-color') {
        html.classList.remove('theme-transition');
        html.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
    html.addEventListener('transitionend', handleTransitionEnd);
  }, []);

  return [theme, toggleTheme];
}
