import { useMemo } from 'react';
import ProgressBar from './ProgressBar';
import { last7Days, dayLabel, calColor, sumCal } from '../utils/helpers';

export default function History({ profile, logs, friend }) {
  const days = useMemo(() =>
    last7Days().map((key) => ({
      key,
      label: dayLabel(key),
      consumed: sumCal(logs[key] || []),
    })), [logs]
  );

  const friendMap = useMemo(() => {
    if (!friend?.history) return {};
    return Object.fromEntries(friend.history.map((h) => [h.date, h.consumed]));
  }, [friend]);

  const maxVal = useMemo(() => {
    const vals = days.map((d) => d.consumed);
    if (friend) Object.values(friendMap).forEach((v) => vals.push(v));
    return Math.max(profile.goal, ...vals, 500);
  }, [days, friend, friendMap, profile.goal]);

  const activeDays = days.filter((d) => d.consumed > 0);
  const weekTotal = activeDays.reduce((s, d) => s + d.consumed, 0);
  const avgDay = activeDays.length ? Math.round(weekTotal / activeDays.length) : 0;
  const daysOnTrack = activeDays.filter((d) => d.consumed <= profile.goal).length;
  const totalDeficit = activeDays.reduce((s, d) => s + Math.max(0, profile.goal - d.consumed), 0);

  return (
    <div>
      {/* Weekly summary */}
      <div className="card">
        <div className="card-title">7-Day Summary</div>
        <div className="stats-grid">
          <div className="stat-cell">
            <div className="stat-num">{avgDay > 0 ? avgDay.toLocaleString() : '—'}</div>
            <div className="stat-lbl">Avg / Day</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num" style={{ color: 'var(--green)' }}>
              {activeDays.length ? daysOnTrack : '—'}
            </div>
            <div className="stat-lbl">On Track</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">{activeDays.length ? totalDeficit.toLocaleString() : '—'}</div>
            <div className="stat-lbl">Total Deficit</div>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="card-title" style={{ margin: 0 }}>Daily Calories</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--green)' }} />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{profile.name}</span>
            </div>
            {friend && (
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--blue)' }} />
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{friend.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="chart-wrap">
          {days.map((day) => {
            const myPct = day.consumed / maxVal;
            const fCal = friendMap[day.key] ?? 0;
            const fPct = fCal / maxVal;
            return (
              <div className="chart-col" key={day.key}>
                <div className="chart-val">
                  {day.consumed > 0
                    ? day.consumed >= 1000
                      ? `${(day.consumed / 1000).toFixed(1)}k`
                      : day.consumed
                    : ''}
                </div>
                <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 110 }}>
                  <div
                    className="chart-bar"
                    style={{
                      flex: 1,
                      height: `${Math.max(3, myPct * 100)}%`,
                      background: day.consumed > profile.goal ? 'var(--red)' : day.consumed === 0 ? 'var(--border)' : 'var(--green)',
                    }}
                  />
                  {friend && (
                    <div
                      className="chart-bar"
                      style={{
                        flex: 1,
                        height: `${Math.max(3, fPct * 100)}%`,
                        background: fCal > friend.goal ? 'var(--red)' : fCal === 0 ? 'var(--border)' : 'var(--blue)',
                      }}
                    />
                  )}
                </div>
                <div className="chart-lbl">{day.label}</div>
              </div>
            );
          })}
        </div>
        <div className="muted mt8" style={{ fontSize: 11, textAlign: 'center' }}>
          Red = over goal · Green/Blue = within goal
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="card">
        <div className="card-title">Daily Breakdown</div>
        {days.map((day) => {
          const pct = day.consumed / profile.goal;
          return (
            <div key={day.key} style={{ marginBottom: 14 }}>
              <div className="row" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{day.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: day.consumed === 0 ? 'var(--muted)' : calColor(pct) }}>
                  {day.consumed === 0 ? 'No data' : `${day.consumed.toLocaleString()} cal`}
                </span>
              </div>
              <ProgressBar value={day.consumed} max={profile.goal} color={calColor(pct)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
