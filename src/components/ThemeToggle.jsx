import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';

export default function ThemeToggle() {
  const getInitialTheme = () => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (_) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = React.useState(getInitialTheme);
  const isDark = theme === 'dark';

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (_) {}
      return next;
    });
  }, []);

  const bg = isDark ? '#1a1a2e' : '#f0f2f5';
  const surface = isDark ? '#16213e' : '#ffffff';
  const text = isDark ? '#e2e8f0' : '#1a202c';
  const subtle = isDark ? '#a0aec0' : '#718096';
  const accent = isDark ? '#90cdf4' : '#3182ce';
  const border = isDark ? '#2d3748' : '#e2e8f0';

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', transition: 'background 0.3s' }}>
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: '48px 40px', maxWidth: 420, width: '90%', boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)', transition: 'background 0.3s, border-color 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: text }}>ThemeToggle</h1>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ background: isDark ? '#2d3748' : '#edf2f7', border: `1px solid ${border}`, borderRadius: 50, width: 52, height: 28, cursor: 'pointer', position: 'relative', transition: 'background 0.3s', outline: 'none' }}
          >
            <span style={{ position: 'absolute', top: 3, left: isDark ? 26 : 4, width: 20, height: 20, borderRadius: '50%', background: isDark ? '#90cdf4' : '#f6ad55', transition: 'left 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
              {isDark ? '☽' : '☀'}
            </span>
          </button>
        </div>
        <p style={{ color: subtle, fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
          Current theme: <span style={{ color: accent, fontWeight: 600 }}>{theme}</span>. Preference is saved to localStorage and restored on next visit.
        </p>
        <div style={{ background: isDark ? '#0d1b2a' : '#ebf8ff', border: `1px solid ${isDark ? '#2c4a6e' : '#bee3f8'}`, borderRadius: 8, padding: '12px 16px' }}>
          <p style={{ margin: 0, fontSize: 13, color: isDark ? '#90cdf4' : '#2b6cb0' }}>
            ✓ Reads OS preference on first visit<br />
            ✓ Persists across sessions via localStorage<br />
            ✓ aria-label reflects next action
          </p>
        </div>
      </div>
    </div>
  );
}