import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Returns:
//   undefined  — still resolving (show loading)
//   null       — no user logged in (show LoginScreen)
//   User       — authenticated Firebase user
export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u ?? null));
  }, []);

  return user;
}
