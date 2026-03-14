import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';

export default function App() {
  const existingAppStyle = {
    fontFamily: "sans-serif",
    padding: "24px",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const headerStyle = {
    borderBottom: "1px solid #ddd",
    paddingBottom: "12px",
    marginBottom: "16px",
  };

  const cardStyle = {
    background: "#f5f5f5",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  };

  return (
    <div style={existingAppStyle}>
      {/* Existing App UI — completely untouched */}
      <h2 style={headerStyle}>My App</h2>
      <div style={cardStyle}>
        <p style={{ margin: 0 }}>This is existing app content. It must remain unchanged.</p>
      </div>
      <button style={{ padding: "8px 16px", marginBottom: "16px" }}>
        Existing App Button
      </button>

      {/* Single addition — self-contained, removable */}
      <BackgroundCustomizer />
    </div>
  );
}

function BackgroundCustomizer() {
  const [isActive, React.useState ? undefined : undefined] = [false, () => {}];
  const [active, setActive] = React.useState(false);

  const wrapperStyle = {
    display: "inline-block",
    marginTop: "8px",
  };

  const buttonStyle = {
    padding: "8px 16px",
    background: active ? "#6200ea" : "#ede7f6",
    color: active ? "#fff" : "#6200ea",
    border: "2px solid #6200ea",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s",
  };

  const swatchStyle = {
    display: "inline-block",
    marginLeft: "12px",
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    background: active ? "#6200ea" : "transparent",
    border: "1px solid #ccc",
    verticalAlign: "middle",
    transition: "background 0.2s",
  };

  return (
    <div style={wrapperStyle}>
      <button
        style={buttonStyle}
        onClick={() => setActive(prev => !prev)}
        aria-pressed={active}
      >
        {active ? "Reset Background" : "Customize Background"}
      </button>
      <span style={swatchStyle} title={active ? "Active" : "Inactive"} />
    </div>
  );
}