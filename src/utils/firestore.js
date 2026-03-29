import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function loadUserData(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid, profile) {
  await setDoc(doc(db, 'users', uid), { name: profile.name, goal: profile.goal }, { merge: true });
}

export async function saveUserLogs(uid, logs) {
  await setDoc(doc(db, 'users', uid), { logs }, { merge: true });
}

export async function fetchFriendData(friendUid) {
  const snap = await getDoc(doc(db, 'users', friendUid));
  return snap.exists() ? snap.data() : null;
}
