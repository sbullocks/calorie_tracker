import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr('');
    if (!email.trim() || password.length < 6) {
      setErr('Email and password (6+ chars) required.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (e) {
      setErr(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 40 }}>🥗</div>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>Calorie Buddy</div>
        <div className="muted" style={{ marginTop: 4 }}>
          {mode === 'signin' ? 'Sign in to sync your data' : 'Create an account to get started'}
        </div>
      </div>

      <div className="card">
        {err && <div className="alert alert-err">{err}</div>}

        <div className="input-group">
          <label className="lbl">Email</label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErr(''); }}
            onKeyDown={onKey}
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <label className="lbl">Password</label>
          <input
            className="input"
            type="password"
            placeholder="6+ characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErr(''); }}
            onKeyDown={onKey}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={submit}
          disabled={loading}
        >
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        {mode === 'signin' ? (
          <span className="muted">
            No account?{' '}
            <button className="btn-link" onClick={() => { setMode('signup'); setErr(''); }}>
              Sign up
            </button>
          </span>
        ) : (
          <span className="muted">
            Already have an account?{' '}
            <button className="btn-link" onClick={() => { setMode('signin'); setErr(''); }}>
              Sign in
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

function friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
