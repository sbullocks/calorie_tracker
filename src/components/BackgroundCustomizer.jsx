export default function BackgroundCustomizer() {
  const COLOR_PALETTE = [
    { id: 'default',      hex: '#FFFFFF', label: 'Default White' },
    { id: 'warm-cream',   hex: '#FAF7F0', label: 'Warm Cream' },
    { id: 'soft-gray',    hex: '#F0F2F5', label: 'Soft Gray' },
    { id: 'deep-navy',    hex: '#1A1F2E', label: 'Deep Navy' },
    { id: 'forest',       hex: '#1E2D2F', label: 'Forest' },
    { id: 'dusk',         hex: '#2D1F1F', label: 'Dusk' },
  ];

  const DARK_IDS = new Set(['deep-navy', 'forest', 'dusk']);

  const [activeId, setActiveId] = React.useState(
    () => localStorage.getItem('bgColorId') || 'default'
  );
  const [panelOpen, setPanelOpen] = React.useState(false);

  const active = COLOR_PALETTE.find(c => c.id === activeId) || COLOR_PALETTE[0];
  const isDark = DARK_IDS.has(activeId);
  const textColor = isDark ? '#F0F2F5' : '#1A1F2E';

  const selectColor = (id) => {
    setActiveId(id);
    localStorage.setItem('bgColorId', id);
    setPanelOpen(false);
  };

  const reset = () => {
    setActiveId('default');
    localStorage.removeItem('bgColorId');
    setPanelOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: active.hex, color: textColor, fontFamily: 'sans-serif', transition: 'background 0.3s', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>My Page</h2>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setPanelOpen(o => !o)}
            title="Customize background color"
            style={{ background: active.hex, color: textColor, border: `2px solid ${textColor}`, borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600 }}
          >
            🎨 Background
          </button>
          {panelOpen && (
            <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', color: '#1A1F2E', border: '1px solid #ccc', borderRadius: '10px', padding: '1rem', zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: '220px' }}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.85rem' }}>Choose a color</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c.id}
                    title={c.label}
                    onClick={() => selectColor(c.id)}
                    style={{ background: c.hex, border: c.id === activeId ? '3px solid #4A90E2' : '2px solid #ccc', borderRadius: '6px', height: '48px', cursor: 'pointer', position: 'relative' }}
                  >
                    {c.id === activeId && <span style={{ fontSize: '1rem' }}>✓</span>}
                  </button>
                ))}
              </div>
              <button
                onClick={reset}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', background: '#f5f5f5', color: '#333', fontSize: '0.85rem' }}
              >
                ↺ Reset to Default
              </button>
            </div>
          )}
        </div>
      </div>
      <p style={{ maxWidth: '480px', lineHeight: 1.6 }}>
        This page adapts to your chosen background. Your preference is saved locally and restored on your next visit.
        Current theme: <strong>{active.label}</strong>.
      </p>
    </div>
  );
}