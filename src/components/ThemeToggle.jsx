import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';

export default function ThemeToggleDemo() {
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem('theme') ?? 'light'; } catch { return 'light'; }
  });

  React.useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const isDark = theme === 'dark';

  const styles = {
    app: {
      minHeight: '100vh',
      background: isDark ? '#1a1a1a' : '#f5f5f5',
      color: isDark ? '#f5f5f5' : '#1a1a1a',
      transition: 'background 0.3s, color 0.3s',
      fontFamily: 'sans-serif',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      background: isDark ? '#111' : '#fff',
      borderBottom: `1px solid ${isDark ? '#333' : '#ddd'}`,
      transition: 'background 0.3s',
    },
    logo: { fontWeight: 700, fontSize: 18, margin: 0 },
    toggleBtn: {
      background: isDark ? '#333' : '#e0e0e0',
      border: 'none',
      borderRadius: 20,
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: isDark ? '#f5f5f5' : '#1a1a1a',
      transition: 'background 0.3s',
    },
    label: { fontSize: 13, fontWeight: 600 },
    content: { padding: 32 },
    card: {
      background: isDark ? '#2a2a2a' : '#fff',
      border: `1px solid ${isDark ? '#444' : '#ddd'}`,
      borderRadius: 8,
      padding: 24,
      maxWidth: 400,
      transition: 'background 0.3s',
    },
  };

  return (
    <div style={styles.app}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>MyApp</h1>
        <button onClick={toggleTheme} style={styles.toggleBtn} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
          <span>{isDark ? '☀️' : '🌙'}</span>
          <span style={styles.label}>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </nav>
      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>ThemeToggle is mounted ✅</h3>
          <p style={{ margin: 0 }}>Current theme: <strong>{theme}</strong>. Preference persists across refreshes via localStorage.</p>
        </div>
      </div>
    </div>
  );
}