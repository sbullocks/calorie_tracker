import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';

export default function AppShell() {
  const [backgroundColor, setBackgroundColor] = React.useState('#f0f4f8');
  const [calories, setCalories] = React.useState([
    { id: 1, label: 'Oatmeal', cal: 320 },
    { id: 2, label: 'Chicken Salad', cal: 480 },
  ]);
  const [input, setInput] = React.useState('');
  const [calInput, setCalInput] = React.useState('');

  const total = calories.reduce((sum, e) => sum + e.cal, 0);

  const addEntry = () => {
    if (!input || !calInput) return;
    setCalories(prev => [...prev, { id: Date.now(), label: input, cal: Number(calInput) }]);
    setInput('');
    setCalInput('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor, display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
        padding: '10px 20px', display: 'flex', alignItems: 'center',
        gap: 12, borderBottom: '1px solid #ddd', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#555' }}>Background</span>
        <input
          type="color"
          value={backgroundColor}
          onChange={e => setBackgroundColor(e.target.value)}
          style={{ width: 36, height: 28, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 0 }}
        />
        <span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>{backgroundColor}</span>
      </header>

      <main style={{ flex: 1, padding: '24px 20px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <h2 style={{ margin: '0 0 16px', color: '#222' }}>Calorie Tracker</h2>

        <div style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              placeholder="Food item"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ flex: 2, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 14 }}
            />
            <input
              placeholder="Cal"
              type="number"
              value={calInput}
              onChange={e => setCalInput(e.target.value)}
              style={{ flex: 1, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 14 }}
            />
          </div>
          <button
            onClick={addEntry}
            style={{ width: '100%', padding: '8px', background: '#4f6ef7', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          >
            Add Entry
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {calories.map(e => (
            <li key={e.id} style={{
              display: 'flex', justifyContent: 'space-between',
              background: '#fff', borderRadius: 6, padding: '10px 14px',
              marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontSize: 14
            }}>
              <span>{e.label}</span>
              <span style={{ fontWeight: 600, color: '#4f6ef7' }}>{e.cal} kcal</span>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 16, padding: '12px 14px', background: '#fff', borderRadius: 6, fontWeight: 700, display: 'flex', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <span>Total</span>
          <span style={{ color: '#e05' }}>{total} kcal</span>
        </div>
      </main>
    </div>
  );
}