import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';

export default function ThemeToggle() {
  const getInitialTheme = () => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = React.useState(getInitialTheme);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  const toggle = React.useCallback(() => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  }, []);

  const isDark = theme === "dark";

  const tokens = {
    bg: isDark ? "#111827" : "#f9fafb",
    surface: isDark ? "#1f2937" : "#ffffff",
    text: isDark ? "#f3f4f6" : "#111827",
    subtext: isDark ? "#9ca3af" : "#6b7280",
    border: isDark ? "#374151" : "#e5e7eb",
    btnBg: isDark ? "#3b82f6" : "#1d4ed8",
  };

  return (
    <div style={{ minHeight: "100vh", background: tokens.bg, color: tokens.text, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, transition: "background 0.3s, color 0.3s" }}>
      <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 40, maxWidth: 420, width: "90%", boxShadow: isDark ? "0 4px 24px #0008" : "0 4px 24px #0001", transition: "background 0.3s, border-color 0.3s" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>Theme Toggle Demo</h1>
        <p style={{ margin: "0 0 24px", color: tokens.subtext, fontSize: 14, lineHeight: 1.6 }}>
          Preference is read from <code>localStorage</code> and OS setting on first load, then persisted across sessions.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: tokens.bg, borderRadius: 10, padding: "12px 16px", border: `1px solid ${tokens.border}`, marginBottom: 24 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {isDark ? "🌙 Dark mode" : "☀️ Light mode"}
          </span>
          <button
            onClick={toggle}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            style={{ background: tokens.btnBg, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", minWidth: 44, minHeight: 44, transition: "background 0.2s" }}
          >
            Switch to {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Stored preference", "Current theme", "OS preference"].map((label, i) => {
            const values = [
              (() => { try { return localStorage.getItem("theme") || "none"; } catch { return "unavailable"; } })(),
              theme,
              window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
            ];
            return (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: tokens.subtext, borderBottom: i < 2 ? `1px solid ${tokens.border}` : "none", paddingBottom: i < 2 ? 8 : 0 }}>
                <span>{label}</span>
                <span style={{ fontWeight: 600, color: tokens.text }}>{values[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}