import React from 'react';

export default function ThemeToggle({ isDark, onToggle }) {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    borderRadius: '12px',
    backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
    border: `1px solid ${isDark ? '#444' : '#ddd'}`,
    width: 'fit-content',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: isDark ? '#e0e0e0' : '#333',
    transition: 'color 0.3s ease',
  };

  const trackStyle = {
    position: 'relative',
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: isDark ? '#4f8ef7' : '#ccc',
    transition: 'background-color 0.3s ease',
    flexShrink: 0,
  };

  const thumbStyle = {
    position: 'absolute',
    top: '3px',
    left: isDark ? '23px' : '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
    transition: 'left 0.25s ease',
  };

  const iconStyle = {
    fontSize: '16px',
    lineHeight: 1,
  };

  return (
    <div
      style={containerStyle}
      onClick={onToggle}
      role="button"
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <span style={iconStyle}>{isDark ? '🌙' : '☀️'}</span>
      <div style={trackStyle}>
        <div style={thumbStyle} />
      </div>
      <span style={labelStyle}>{isDark ? 'Dark' : 'Light'}</span>
    </div>
  );
}
