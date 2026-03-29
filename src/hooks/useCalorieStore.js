import { useCallback, useEffect, useRef, useState } from 'react';
import { KEYS } from '../constants/storageKeys';
import { load, save } from '../utils/storage';
import { todayKey, uid, timeStr, last7Days, sumCal } from '../utils/helpers';
import {
  loadUserData,
  saveUserProfile,
  saveUserLogs,
  fetchFriendData,
} from '../utils/firestore';

export function useCalorieStore(userId) {
  const [profile, setProfile] = useState(() => load(KEYS.PROFILE, null));
  const [logs, setLogs] = useState(() => load(KEYS.LOGS, {}));
  const [friend, setFriend] = useState(() => load(KEYS.FRIEND, null));
  // friendUid is the permanent Firestore UID of the linked friend
  const [friendUid, setFriendUid] = useState(() => load(KEYS.FRIEND_UID, null));
  // syncReady gates Firestore writes until the initial cloud load completes
  const syncReady = useRef(false);

  // --- Load from Firestore on login ---
  useEffect(() => {
    if (!userId) {
      syncReady.current = false;
      return;
    }
    loadUserData(userId).then((data) => {
      if (data) {
        // Cloud data takes precedence
        setProfile({ name: data.name, goal: data.goal });
        setLogs(data.logs || {});
      } else {
        // New cloud account — migrate any existing localStorage data
        const localProfile = load(KEYS.PROFILE, null);
        const localLogs = load(KEYS.LOGS, {});
        if (localProfile) {
          saveUserProfile(userId, localProfile);
          saveUserLogs(userId, localLogs);
        }
      }
      syncReady.current = true;
    });
  }, [userId]);

  // --- Persist to localStorage + Firestore on changes ---
  useEffect(() => {
    if (!profile) return;
    save(KEYS.PROFILE, profile);
    if (userId && syncReady.current) saveUserProfile(userId, profile);
  }, [profile, userId]);

  useEffect(() => {
    save(KEYS.LOGS, logs);
    if (userId && syncReady.current) saveUserLogs(userId, logs);
  }, [logs, userId]);

  useEffect(() => { save(KEYS.FRIEND, friend); }, [friend]);
  useEffect(() => { save(KEYS.FRIEND_UID, friendUid); }, [friendUid]);

  // --- Profile ---
  const setupProfile = useCallback((p) => setProfile(p), []);

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  // --- Log entries ---
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

  // --- Friend sync ---
  // Converts raw Firestore friend doc into the display shape the UI expects
  const buildFriendData = useCallback((raw, fUid) => {
    const today = todayKey();
    const history = last7Days().map((date) => ({
      date,
      consumed: sumCal((raw.logs || {})[date] || []),
    }));
    return {
      uid: fUid,
      name: raw.name,
      goal: raw.goal,
      today: { date: today, consumed: sumCal((raw.logs || {})[today] || []) },
      history,
      ts: Date.now(),
    };
  }, []);

  // importFriend: takes a Firestore UID, fetches the user doc, links them
  const importFriend = useCallback(async (fUid) => {
    const raw = await fetchFriendData(fUid);
    if (!raw) throw new Error('No user found with that code.');
    const data = buildFriendData(raw, fUid);
    setFriend(data);
    setFriendUid(fUid);
    return data;
  }, [buildFriendData]);

  const clearFriend = useCallback(() => {
    setFriend(null);
    setFriendUid(null);
  }, []);

  // syncFriend: re-fetches the linked friend's latest data
  const syncFriend = useCallback(async () => {
    const storedUid = load(KEYS.FRIEND_UID, null);
    if (!storedUid) return;
    const raw = await fetchFriendData(storedUid);
    if (!raw) return;
    setFriend(buildFriendData(raw, storedUid));
  }, [buildFriendData]);

  return {
    profile,
    logs,
    friend,
    friendUid,
    setupProfile,
    updateProfile,
    addEntry,
    deleteEntry,
    importFriend,
    clearFriend,
    syncFriend,
  };
}
