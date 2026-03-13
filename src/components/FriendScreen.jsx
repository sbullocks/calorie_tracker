import { useMemo, useState } from 'react';
import { makeShareCode, parseCode } from '../utils/shareCode';

export default function FriendScreen({ profile, logs, friend, onImport, onClear, onUpdateProfile }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [copied, setCopied] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editGoal, setEditGoal] = useState(profile.goal.toString());

  const myCode = useMemo(() => makeShareCode(profile, logs), [profile, logs]);

  const copy = () => {
    navigator.clipboard.writeText(myCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const importCode = () => {
    setErr('');
    const parsed = parseCode(code);
    if (!parsed) { setErr('Invalid code — ask your friend to regenerate.'); return; }
    onImport(parsed);
    setCode('');
    setOk(`Linked to ${parsed.name}!`);
    setTimeout(() => setOk(''), 3000);
  };

  const saveProfile = () => {
    if (!editName.trim() || parseInt(editGoal) < 500) return;
    onUpdateProfile({ name: editName.trim(), goal: parseInt(editGoal) });
    setOk('Profile updated!');
    setTimeout(() => setOk(''), 2500);
  };

  return (
    <div>
      {ok && <div className="alert alert-ok">✓ {ok}</div>}

      <div className="card">
        <div className="card-title">Your Share Code</div>
        <p className="muted" style={{ marginBottom: 12 }}>
          Copy this and send to your friend. They paste it to see your stats.
        </p>
        <div className="code-box">{myCode}</div>
        <button className="btn btn-primary btn-full mt12" onClick={copy}>
          {copied ? '✓ Copied!' : '📋 Copy My Code'}
        </button>
        <div className="muted mt8" style={{ textAlign: 'center', fontSize: 12 }}>
          Refresh daily — the code updates with your latest data
        </div>
      </div>

      <div className="card">
        <div className="card-title">Paste Friend's Code</div>
        {err && <div className="alert alert-err">{err}</div>}
        <div className="input-group">
          <textarea
            className="input"
            rows={3}
            placeholder="Paste your friend's share code here…"
            value={code}
            onChange={(e) => { setCode(e.target.value); setErr(''); }}
          />
        </div>
        <button className="btn btn-primary btn-full" disabled={!code.trim()} onClick={importCode}>
          Link Friend
        </button>
      </div>

      {friend && (
        <div className="card">
          <div className="row">
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{friend.name}</div>
              <div className="muted">Goal: {friend.goal.toLocaleString()} cal/day</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                Snapshot: {new Date(friend.ts).toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--blue)' }}>
                {friend.today?.consumed?.toLocaleString() ?? '—'}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>cal today</div>
            </div>
          </div>
          <button className="btn btn-danger btn-sm mt12" onClick={onClear}>
            Unlink Friend
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-title">Your Profile</div>
        <div className="input-group">
          <label className="lbl">Name</label>
          <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="lbl">Daily Calorie Goal</label>
          <input
            className="input"
            type="number"
            value={editGoal}
            onChange={(e) => setEditGoal(e.target.value)}
          />
        </div>
        <button
          className="btn btn-outline btn-full"
          disabled={!editName.trim() || parseInt(editGoal) < 500}
          onClick={saveProfile}
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
