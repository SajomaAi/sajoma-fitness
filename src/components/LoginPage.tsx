import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface LoginPageProps { onLogin: () => void; }

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUpRoute = location.pathname === '/signup';

  const [isSignUp, setIsSignUp] = useState(isSignUpRoute);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    if (isSignUp) {
      if (!name.trim()) { setError('Please enter your name'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    }

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      if (isSignUp && name) {
        localStorage.setItem('userName', name);
      }
      onLogin();
      navigate('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFF5F8 0%, #FFFAF0 50%, #FFF0F5 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #F8B4C8 0%, #D4A017 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(212,160,23,0.25)',
          fontSize: '2rem', color: 'white', fontWeight: 800,
        }}>S</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3E2723', letterSpacing: '-0.02em' }}>
          Sajoma Fitness
        </h1>
        <p style={{ color: '#8D6E63', fontSize: '0.9rem', marginTop: 4 }}>
          {isSignUp ? t('create_account') || 'Create your account' : t('welcome_back') || 'Welcome back'}
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'white',
        borderRadius: 20,
        padding: '28px 24px',
        boxShadow: '0 4px 20px rgba(62,39,35,0.08)',
        border: '1px solid rgba(197,150,27,0.1)',
      }}>
        {/* Tab Toggle */}
        <div className="sf-tabs" style={{ marginBottom: 20 }}>
          <button
            className={`sf-tab ${!isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(false); setError(''); }}
          >
            {t('login') || 'Log In'}
          </button>
          <button
            className={`sf-tab ${isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(true); setError(''); }}
          >
            {t('sign_up') || 'Sign Up'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: 14 }}>
              <label className="sf-label">{t('full_name') || 'Full Name'}</label>
              <input
                className="sf-input"
                type="text"
                placeholder="Maria Garcia"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label className="sf-label">{t('email') || 'Email'}</label>
            <input
              className="sf-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="sf-label">{t('password') || 'Password'}</label>
            <input
              className="sf-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {isSignUp && (
            <div style={{ marginBottom: 14 }}>
              <label className="sf-label">{t('confirm_password') || 'Confirm Password'}</label>
              <input
                className="sf-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {error && (
            <div style={{
              background: '#FFF0F0', color: '#C62828', padding: '10px 14px',
              borderRadius: 10, fontSize: '0.85rem', marginBottom: 14,
              border: '1px solid #FFCDD2',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg"
            disabled={isLoading}
            style={{ marginTop: 4, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? '...' : isSignUp ? (t('sign_up') || 'Sign Up') : (t('login') || 'Log In')}
          </button>
        </form>

        {!isSignUp && (
          <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.85rem', color: '#8D6E63' }}>
            <a href="#" style={{ color: '#C5961B', textDecoration: 'none', fontWeight: 600 }}>
              {t('forgot_password') || 'Forgot password?'}
            </a>
          </p>
        )}
      </div>

      {/* Social Login */}
      <div style={{ width: '100%', maxWidth: 400, marginTop: 20, textAlign: 'center' }}>
        <p style={{ color: '#BCAAA4', fontSize: '0.8rem', marginBottom: 12 }}>
          {t('or_continue_with') || 'or continue with'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {['Google', 'Apple'].map(provider => (
            <button
              key={provider}
              className="sf-btn sf-btn-outline sf-btn-sm"
              style={{ flex: 1, maxWidth: 160 }}
              onClick={() => { onLogin(); navigate('/dashboard'); }}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
