import { useEffect, useRef, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function UserMenu({ email }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const initial = email ? email[0].toUpperCase() : '?';

  return (
    <div className="user-menu" ref={ref}>
      <button className="avatar" onClick={() => setOpen(p => !p)} aria-label="Account menu">
        {initial}
      </button>
      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-email">{email}</div>
          <button
            className="user-dropdown-item"
            onClick={() => signOut(auth)}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
