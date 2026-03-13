import { last7Days, sumCal, todayKey } from './helpers';

export function makeShareCode(profile, logs) {
  const today = todayKey();
  const history = last7Days().map((date) => ({
    date,
    consumed: sumCal(logs[date] || []),
  }));

  const payload = {
    v: 1,
    name: profile.name,
    goal: profile.goal,
    today: {
      date: today,
      consumed: sumCal(logs[today] || []),
    },
    history,
    ts: Date.now(),
  };

  return btoa(JSON.stringify(payload));
}

export function parseCode(raw) {
  try {
    const data = JSON.parse(atob(raw.trim()));
    return data?.v === 1 ? data : null;
  } catch {
    return null;
  }
}
