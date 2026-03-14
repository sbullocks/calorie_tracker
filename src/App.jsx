export default function BackgroundCustomizerDemo() {
  const BRAND_COLORS = ['#FFFFFF', '#F0F4FF', '#1A1A2E', '#E8F5E9', '#FFF3E0'];

  function safeStorage() {
    try { return window.localStorage; } catch { return null; }
  }

  function useBackgroundColor(colors, defaultColor) {
    const storage = safeStorage();
    const [currentColor, setCurrentColor] = React.useState(() => {
      if (!colors.length) return defaultColor;
      const stored = storage?.getItem('bg-customizer-color');
      return colors.includes(stored) ? stored : colors[0];
    });

    const cycleColor = React.useCallback(() => {
      setCurrentColor(prev => {
        const idx = colors.indexOf(prev);
        const next = colors[(idx + 1) % colors.length];
        storage?.setItem('bg-customizer-color', next);
        return next;
      });
    }, [colors]);

    return { currentColor, cycleColor };
  }

  function BackgroundCustomizer({ colors, currentColor, onColorChange, scope = 'local' }) {
    if (!colors.length) return null;
    const idx = colors.indexOf(currentColor);
    const preview = colors[(idx + 1) % colors.length];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onColorChange} style={{
          padding: '8px 18px', borderRadius: 6, border: '1px solid #ccc',
          cursor: 'pointer', fontWeight: 600, background: '#fff', fontSize: 14
        }}>
          Change {scope === 'local' ? 'Panel' : 'App'} Background
        </button>
        <span style={{ fontSize: 13, color: '#555' }}>Next →</span>
        <div style={{ width: 24, height: 24, borderRadius: 4, background: preview, border: '1px solid #ccc' }} />
        <span style={{ fontSize: 12, color: '#888' }}>{preview}</span>
      </div>
    );
  }

  const { currentColor, cycleColor } = useBackgroundColor(BRAND_COLORS, '#FFFFFF');
  const isDark = currentColor === '#1A1A2E';

  return (
    <div style={{
      backgroundColor: currentColor, minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', transition: 'background-color 0.3s ease',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        padding: 32, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
        background: isDark ? '#2a2a4a' : '#ffffffcc', maxWidth: 420, width: '90%'
      }}>
        <h3 style={{ margin: '0 0 8px', color: isDark ? '#eee' : '#222' }}>Panel Title</h3>
        <p style={{ margin: '0 0 20px', color: isDark ? '#aaa' : '#555', fontSize: 14 }}>
          Scope: <strong>local</strong> — only this panel is affected.
        </p>
        <BackgroundCustomizer
          colors={BRAND_COLORS}
          currentColor={currentColor}
          onColorChange={cycleColor}
          scope="local"
        />
        <p style={{ marginTop: 16, fontSize: 12, color: isDark ? '#888' : '#aaa' }}>
          Current: {currentColor} · Persisted via localStorage
        </p>
      </div>
    </div>
  );
}