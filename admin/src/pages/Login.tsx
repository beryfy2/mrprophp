import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, API_BASE } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && (data.error || data.message)) || 'Failed to send OTP');
      setMode('reset');
    } catch (e) {
      const msg = typeof e === 'object' && e && 'message' in e
        ? String((e as Record<string, unknown>).message)
        : 'Failed to send OTP';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && (data.error || data.message)) || 'Failed to reset password');
      alert('Password updated. Please login.');
      setMode('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
    } catch (e) {
      const msg = typeof e === 'object' && e && 'message' in e
        ? String((e as Record<string, unknown>).message)
        : 'Invalid OTP or request failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-icon">🔒</div>

        <h1 className="login-title">Admin Dashboard</h1>
        <p className="login-subtitle">Sign in to manage your business</p>

        <div className="login-card">

          {mode === 'login' && (
            <>
              <h2>Welcome Back</h2>
              <p className="login-text">
                Enter your credentials to access the dashboard
              </p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h2>Forgot Password</h2>
              <p className="login-text">
                Enter your registered email to receive OTP
              </p>
            </>
          )}

          {mode === 'reset' && (
            <>
              <h2>Reset Password</h2>
              <p className="login-text">
                Enter the OTP received and your new password
              </p>
            </>
          )}

          {mode === 'login' && (
            <form onSubmit={submit}>
              <label>Email Address</label>
              <div className="login-input">
                <input
                  type="email"
                  placeholder="beryfy2@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-row">
                <label>Password</label>
                <a onClick={() => setMode('forgot')}>Forgot?</a>
              </div>

              <div className="login-input">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: 'red', marginBottom: 10 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn success login-btn"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={sendOtp}>
              <label>Registered Email</label>
              <div className="login-input">
                <input
                  type="email"
                  placeholder="beryfy2@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: 'red', marginBottom: 10 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn success login-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                <button
                  type="button"
                  className="btn login-btn"
                  onClick={() => setMode('login')}
                  disabled={loading}
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={resetPassword}>
              <label>OTP</label>
              <div className="login-input">
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <label>New Password</label>
              <div className="login-input">
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: 'red', marginBottom: 10 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn success login-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  className="btn login-btn"
                  onClick={() => setMode('login')}
                  disabled={loading}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

