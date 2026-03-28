import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';

/*
 * STATE OWNERSHIP:    App (root component) owns `theme` state
 * CONTROL RENDERER:   MainContent renders the ThemeToggle control
 * EFFECT TARGET:      The root App div (simulating <html>/document root)
 *                     — background/color CSS applied there via prop drilling,
 *                     NOT on the toggle control itself
 * PROP FLOW:          App → (theme, onToggle) → MainContent → ThemeToggle
 */

const themes = {
  light: { bg: "#f5f5f0", text: "#1a1a1a", card: "#ffffff", border: "#ddd" },
  dark:  { bg: "#1a1a2e", text: "#e0e0e0", card: "#16213e", border: "#444" },
};

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button onClick={onToggle} style={{
      padding: "10px 22px", borderRadius: 24, cursor: "pointer", fontWeight: 600,
      border: "2px solid currentColor", background: "transparent",
      color: "inherit", fontSize: 14, transition: "opacity 0.15s",
    }}>
      {isDark ? "☀️ Light mode" : "🌙 Dark mode"}
    </button>
  );
}

function MainContent({ theme, onToggle }) {
  const t = themes[theme];
  return (
    <div style={{
      maxWidth: 560, margin: "0 auto", padding: 40,
      background: t.card, borderRadius: 12, border: `1px solid ${t.border}`,
      boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
    }}>
      <h2 style={{ margin: "0 0 8px", color: t.text }}>Main Content Area</h2>
      <p style={{ color: t.text, opacity: 0.75, margin: "0 0 28px", lineHeight: 1.6 }}>
        The toggle below lives here in the content area. The background it
        controls is the <strong>root app background</strong> — not this card.
      </p>
      <ThemeToggle theme={theme} onToggle={onToggle} />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem("app-theme") || "light"; }
    catch { return "light"; }
  });

  const toggle = React.useCallback(() => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      try { localStorage.setItem("app-theme", next); } catch {}
      return next;
    });
  }, []);

  const t = themes[theme];

  // Effect applied to ROOT element — the actual target, not the toggle
  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text,
      transition: "background 0.25s, color 0.25s",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <h1 style={{ marginBottom: 32, fontSize: 22, opacity: 0.5, letterSpacing: 1 }}>
        APP ROOT — bg: {t.bg}
      </h1>
      <MainContent theme={theme} onToggle={toggle} />
    </div>
  );
}