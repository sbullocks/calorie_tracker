export default function BackgroundCustomizer() {
  const COLOR_OPTIONS = [
    { id: "light", label: "Light", color: "#ffffff" },
    { id: "sepia", label: "Sepia", color: "#f5e6c8" },
    { id: "dark", label: "Dark", color: "#1a1a2e" },
    { id: "high-contrast", label: "High Contrast", color: "#000000" },
  ];

  const getInitial = () => {
    try { return localStorage.getItem("bg-color") || "light"; } catch { return "light"; }
  };

  const [selected, setSelected] = React.useState(getInitial);

  React.useEffect(() => {
    try { localStorage.setItem("bg-color", selected); } catch {}
  }, [selected]);

  const current = COLOR_OPTIONS.find(o => o.id === selected);
  const isDark = selected === "dark" || selected === "high-contrast";

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: current.color,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", transition: "background-color 0.3s ease",
      fontFamily: "sans-serif",
    }}>
      <div style={{
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        borderRadius: 16, padding: "2rem 2.5rem", textAlign: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      }}>
        <h2 style={{ margin: "0 0 0.5rem", color: isDark ? "#fff" : "#111" }}>
          Background Customizer
        </h2>
        <p style={{ margin: "0 0 1.5rem", color: isDark ? "#ccc" : "#555", fontSize: 14 }}>
          Selected: <strong>{current.label}</strong>
        </p>

        <div role="group" aria-label="Background color options"
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {COLOR_OPTIONS.map(option => {
            const isActive = option.id === selected;
            return (
              <button key={option.id} onClick={() => setSelected(option.id)}
                aria-pressed={isActive}
                aria-label={`${option.label} background${isActive ? ", currently selected" : ""}`}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 6, padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                  border: isActive ? "3px solid #4a90d9" : "3px solid transparent",
                  background: isActive
                    ? (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)")
                    : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                  outline: "none", transition: "all 0.15s ease",
                }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  backgroundColor: option.color,
                  border: "1px solid rgba(0,0,0,0.2)",
                  boxShadow: isActive ? "0 0 0 2px #4a90d9" : "none",
                }} />
                <span style={{ fontSize: 12, color: isDark ? "#ddd" : "#333", fontWeight: isActive ? 700 : 400 }}>
                  {option.label}
                </span>
                {isActive && <span style={{ fontSize: 10, color: "#4a90d9", fontWeight: 700 }}>✓ Active</span>}
              </button>
            );
          })}
        </div>

        <p style={{ marginTop: "1.5rem", fontSize: 12, color: isDark ? "#888" : "#999" }}>
          Preference saved to localStorage
        </p>
      </div>

      <div aria-live="polite" aria-atomic="true"
        style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        Background changed to {current.label}
      </div>
    </div>
  );
}