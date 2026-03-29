import { useState } from 'react';

export default function FriendScreen({
  profile,
  userId,
  friend,
  onImport,
  onClear,
  onUpdateProfile,
}) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [linking, setLinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editGoal, setEditGoal] = useState(profile.goal.toString());

  const copy = () => {
    navigator.clipboard.writeText(userId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const linkFriend = async () => {
    setErr('');
    const trimmed = code.trim();
    if (!trimmed) return;
    if (trimmed === userId) {
      setErr("That's your own code — share it with a friend.");
      return;
    }
    setLinking(true);
    try {
      const data = await onImport(trimmed);
      setCode('');
      setOk(`Linked to ${data.name}! Their stats will auto-sync each time you open the app.`);
      setTimeout(() => setOk(''), 4000);
    } catch (e) {
      setErr(e.message || 'Invalid code — check with your friend.');
    } finally {
      setLinking(false);
    }
  };

  const saveProfile = () => {
    if (!editName.trim() || parseInt(editGoal) < 500) return;
    onUpdateProfile({ name: editName.trim(), goal: parseInt(editGoal) });
    setOk('Profile updated!');
    setTimeout(() => setOk(''), 2500);
  };

  const syncedAt = friend?.ts
    ? new Date(friend.ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <div>
      {ok && <div className="alert alert-ok">✓ {ok}</div>}

      <div className="card">
        <div className="card-title">Your Friend Code</div>
        <p className="muted" style={{ marginBottom: 12 }}>
          Share this code once — your friend's app will auto-sync your latest stats every time they open it.
        </p>
        <div className="code-box" style={{ fontSize: 13, letterSpacing: '0.03em' }}>{userId}</div>
        <button className="btn btn-primary btn-full mt12" onClick={copy}>
          {copied ? '✓ Copied!' : '📋 Copy My Code'}
        </button>
        <div className="alert alert-info mt12" style={{ fontSize: 12, marginBottom: 0 }}>
          Anyone with your code can view your calorie data. Only share it with people you trust.
        </div>
      </div>

      <div className="card">
        <div className="card-title">Link a Friend</div>
        {err && <div className="alert alert-err">{err}</div>}
        {!friend ? (
          <>
            <div className="input-group">
              <input
                className="input"
                placeholder="Paste your friend's code here…"
                value={code}
                onChange={(e) => { setCode(e.target.value); setErr(''); }}
              />
            </div>
            <button
              className="btn btn-primary btn-full"
              disabled={!code.trim() || linking}
              onClick={linkFriend}
            >
              {linking ? 'Linking…' : 'Link Friend'}
            </button>
          </>
        ) : (
          <div>
            <div className="row">
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{friend.name}</div>
                <div className="muted">Goal: {friend.goal.toLocaleString()} cal/day</div>
                {syncedAt && (
                  <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                    Last synced today at {syncedAt}
                  </div>
                )}
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
      </div>

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
