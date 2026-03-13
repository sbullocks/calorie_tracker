import ProgressBar from './ProgressBar';
import { todayKey, fmtDate, calColor, sumCal } from '../utils/helpers';

export default function Dashboard({ profile, logs, friend }) {
  const today = todayKey();
  const consumed = sumCal(logs[today] || []);
  const { goal } = profile;
  const remaining = goal - consumed;
  const pct = consumed / goal;
  const color = calColor(pct);
  const friendConsumed = friend?.today?.consumed ?? 0;
  const friendGoal = friend?.goal ?? 2000;

  return (
    <div>
      {/* Hero card */}
      <div className="card">
        <div className="row" style={{ marginBottom: 16 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 3 }}>Today's Progress</div>
            <div className="muted" style={{ fontSize: 13 }}>{fmtDate(today)}</div>
          </div>
          <span className={`badge ${remaining >= 0 ? 'badge-green' : 'badge-red'}`}>
            {remaining >= 0
              ? `${remaining.toLocaleString()} left`
              : `${Math.abs(remaining).toLocaleString()} over`}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 52, fontWeight: 800, color, lineHeight: 1 }}>
            {consumed.toLocaleString()}
          </div>
          <div className="muted" style={{ marginTop: 4 }}>of {goal.toLocaleString()} cal goal</div>
        </div>

        <ProgressBar value={consumed} max={goal} color={color} />

        <div className="stats-grid" style={{ marginTop: 14 }}>
          <div className="stat-cell">
            <div className="stat-num" style={{ color: 'var(--green)' }}>{consumed.toLocaleString()}</div>
            <div className="stat-lbl">Consumed</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num" style={{ color: remaining >= 0 ? 'var(--blue)' : 'var(--red)' }}>
              {Math.abs(remaining).toLocaleString()}
            </div>
            <div className="stat-lbl">{remaining >= 0 ? 'Remaining' : 'Over Goal'}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num" style={{ color: 'var(--muted)' }}>{goal.toLocaleString()}</div>
            <div className="stat-lbl">Daily Goal</div>
          </div>
        </div>
      </div>

      {/* Recent log preview */}
      {(logs[today] || []).length > 0 ? (
        <div className="card">
          <div className="card-title">Recent Entries</div>
          {[...(logs[today] || [])].reverse().slice(0, 4).map((e) => (
            <div className="food-item" key={e.id}>
              <div>
                <div className="food-name">{e.name}</div>
                <div className="food-time">{e.time}</div>
              </div>
              <div className="food-cals">{e.cal} cal</div>
            </div>
          ))}
          {(logs[today] || []).length > 4 && (
            <div className="muted mt8" style={{ textAlign: 'center' }}>
              +{(logs[today] || []).length - 4} more — see Log tab
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🍽️</div>
          <div style={{ fontWeight: 600, marginBottom: 5 }}>Nothing logged yet</div>
          <div className="muted">Tap Log below to add your first meal</div>
        </div>
      )}

      {/* Friend comparison */}
      {friend ? (
        <div className="card">
          <div className="row" style={{ marginBottom: 12 }}>
            <div className="card-title" style={{ margin: 0 }}>Friend Comparison</div>
            <span className="muted" style={{ fontSize: 11 }}>
              {friend.today?.date === today ? 'Live today' : `Snapshot ${friend.today?.date ?? ''}`}
            </span>
          </div>
          <div className="compare-grid">
            <div className="compare-side compare-you">
              <div className="compare-name" style={{ color: 'var(--green-dark)' }}>{profile.name}</div>
              <div className="compare-num" style={{ color: 'var(--green-dark)' }}>{consumed.toLocaleString()}</div>
              <div className="compare-goal">of {goal.toLocaleString()}</div>
              <div className="compare-bar">
                <div className="compare-fill" style={{ width: `${Math.min(100, pct * 100)}%`, background: 'var(--green)' }} />
              </div>
            </div>
            <div className="compare-side compare-friend">
              <div className="compare-name" style={{ color: 'var(--blue)' }}>{friend.name}</div>
              <div className="compare-num" style={{ color: 'var(--blue)' }}>{friendConsumed.toLocaleString()}</div>
              <div className="compare-goal">of {friendGoal.toLocaleString()}</div>
              <div className="compare-bar">
                <div className="compare-fill" style={{ width: `${Math.min(100, (friendConsumed / friendGoal) * 100)}%`, background: 'var(--blue)' }} />
              </div>
            </div>
          </div>
          <div className="muted mt8" style={{ textAlign: 'center', fontSize: 11 }}>
            Updated {new Date(friend.ts).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '20px', background: 'var(--blue-bg)', border: '1.5px dashed #93c5fd' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
          <div style={{ fontWeight: 600, color: 'var(--blue)', marginBottom: 4 }}>No friend linked</div>
          <div className="muted">Go to Friend tab · share your code · paste theirs</div>
        </div>
      )}
    </div>
  );
}
