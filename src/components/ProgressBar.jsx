import { calColor } from '../utils/helpers';

export default function ProgressBar({ value, max, color }) {
  const pct = Math.min(1, value / (max || 1));
  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${pct * 100}%`, background: color ?? calColor(pct) }}
      />
    </div>
  );
}
