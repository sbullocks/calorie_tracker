import { useState } from 'react';

export default function Onboarding({ onDone }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('1800');
  const valid = name.trim().length > 0 && parseInt(goal) >= 500;
  const submit = () => { if (valid) onDone({ name: name.trim(), goal: parseInt(goal) }); };

  return (
    <div className="onboarding">
      <div className="onboarding-icon">🥗</div>
      <h1 className="onboarding-title">Calorie Buddy</h1>
      <p className="onboarding-sub">
        Track calories with a friend.<br />Stay accountable, reach your goals.
      </p>
      <div style={{ width: '100%', textAlign: 'left' }}>
        <div className="input-group">
          <label className="lbl">Your name</label>
          <input
            className="input"
            placeholder="e.g. Alex"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>
        <div className="input-group">
          <label className="lbl">Daily calorie goal</label>
          <input
            className="input"
            type="number"
            placeholder="e.g. 1800"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <div className="muted mt8">For a 500 cal/day deficit, set this ~500 below your TDEE.</div>
        </div>
        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 4 }}
          onClick={submit}
          disabled={!valid}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
