import { useCallback, useEffect, useState } from 'react';
import { KEYS } from '../constants/storageKeys';
import { load, save } from '../utils/storage';
import { todayKey, uid, timeStr } from '../utils/helpers';

export function useCalorieStore() {
  const [profile, setProfile] = useState(() => load(KEYS.PROFILE, null));
  const [logs, setLogs] = useState(() => load(KEYS.LOGS, {}));
  const [friend, setFriend] = useState(() => load(KEYS.FRIEND, null));

  useEffect(() => { if (profile) save(KEYS.PROFILE, profile); }, [profile]);
  useEffect(() => { save(KEYS.LOGS, logs); }, [logs]);
  useEffect(() => { save(KEYS.FRIEND, friend); }, [friend]);

  const setupProfile = useCallback((p) => setProfile(p), []);

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const addEntry = useCallback((name, cal) => {
    const date = todayKey();
    const entry = { id: uid(), name, cal: parseInt(cal), time: timeStr(), date };
    setLogs((prev) => ({ ...prev, [date]: [...(prev[date] || []), entry] }));
  }, []);

  const deleteEntry = useCallback((id, date) => {
    setLogs((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((e) => e.id !== id),
    }));
  }, []);

  const importFriend = useCallback((data) => setFriend(data), []);
  const clearFriend = useCallback(() => setFriend(null), []);

  return {
    profile,
    logs,
    friend,
    setupProfile,
    updateProfile,
    addEntry,
    deleteEntry,
    importFriend,
    clearFriend,
  };
}
