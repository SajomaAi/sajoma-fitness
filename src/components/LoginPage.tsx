import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { assetUrl } from '../lib/basePath';

interface LoginPageProps { onLogin: () => void; }

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPassword, signUpWithPassword, signInWithApple, signInWithGoogle, resetPassword } = useAuth();
  const isSignUpRoute = location.pathname === '/signup';
  const [isSignUp, setIsSignUp] = useState(isSignUpRoute);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!email || !password) { setError(t('error_fill_fields') || 'Please fill in all fields'); return; }
    if (isSignUp && !name.trim()) { setError(t('error_enter_name') || 'Please enter your name'); return; }
    if (isSignUp && password.length < 6) { setError(t('error_password_short') || 'Password must be at least 6 characters'); return; }
    if (isSignUp && password !== confirmPassword) { setError(t('error_passwords_mismatch') || 'Passwords do not match'); return; }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error: err } = await signUpWithPassword(email, password, name.trim());
        if (err) { setError(err.message); return; }
        setInfo(t('check_email_confirm') || 'Check your email to confirm your account, then sign in.');
        setIsSignUp(false);
      } else {
        const { error: err } = await signInWithPassword(email, password);
        if (err) { setError(err.message); return; }
        onLogin();
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setInfo('');
    if (!email) { setError(t('enter_email_reset') || 'Enter your email first, then tap Forgot password'); return; }
    const { error: err } = await resetPassword(email);
    if (err) setError(err.message);
    else setInfo(t('reset_email_sent') || 'Password reset email sent.');
  };

  const handleApple = async () => {
    setError('');
    const { error: err } = await signInWithApple();
    if (err) setError(err.message);
  };

  const handleGoogle = async () => {
    setError('');
    const { error: err } = await signInWithGoogle();
    if (err) setError(err.message);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32, animation: 'fadeIn 0.5s ease' }}>
        <img
          src={assetUrl('/sajoma-logo.png')}
          alt="Sajoma Fitness"
          style={{
            width: 360, height: 360, marginBottom: 8,
            filter: 'drop-shadow(0 10px 35px rgba(212,175,55,0.4))',
            maxWidth: '85vw',
          }}
        />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#212529' }}>Sajoma Fitness</h1>
        <p style={{ fontSize: '0.88rem', color: '#6C757D', marginTop: 4 }}>
          {isSignUp ? (t('create_account') || 'Create your account') : (t('welcome_back') || 'Welcome back')}
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 24, padding: '32px 24px', width: '100%', maxWidth: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
        <div className="tabs" style={{ marginBottom: 24 }}>
          <button className={`tab ${!isSignUp ? 'active' : ''}`} onClick={() => { setIsSignUp(false); setError(''); setInfo(''); }}>{t('sign_in') || 'Sign In'}</button>
          <button className={`tab ${isSignUp ? 'active' : ''}`} onClick={() => { setIsSignUp(true); setError(''); setInfo(''); }}>{t('sign_up') || 'Sign Up'}</button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: 16 }}>
              <label className="label">{t('full_name') || 'Full Name'}</label>
              <input className="input" type="text" placeholder="Sarah Johnson" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label className="label">{t('email') || 'Email'}</label>
            <input className="input" type="email" placeholder="sarah@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div style={{ marginBottom: isSignUp ? 16 : 8 }}>
            <label className="label">{t('password') || 'Password'}</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete={isSignUp ? 'new-password' : 'current-password'} />
          </div>
          {isSignUp && (
            <div style={{ marginBottom: 16 }}>
              <label className="label">{t('confirm_password') || 'Confirm Password'}</label>
              <input className="input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" />
            </div>
          )}

          {!isSignUp && (
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {t('forgot_password') || 'Forgot password?'}
              </button>
            </div>
          )}

          {error && <div style={{ background: '#F0F1F3', color: '#C62828', padding: '10px 14px', borderRadius: 10, fontSize: '0.82rem', marginBottom: 14, border: '1px solid #FFCDD2' }}>{error}</div>}
          {info && <div style={{ background: '#F0F7F0', color: '#2E7D32', padding: '10px 14px', borderRadius: 10, fontSize: '0.82rem', marginBottom: 14, border: '1px solid #C8E6C9' }}>{info}</div>}

          <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={isLoading} style={{ marginBottom: 16 }}>
            {isLoading ? '...' : isSignUp ? (t('create_account') || 'Create Account') : (t('sign_in') || 'Sign In')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
          <span style={{ fontSize: '0.75rem', color: '#ADB5BD' }}>{t('or') || 'or'}</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button type="button" className="btn btn-full" onClick={handleApple} style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.1)', color: '#212529', fontSize: '0.85rem' }}>
            🍎 {t('continue_with_apple') || 'Continue with Apple'}
          </button>
          <button type="button" className="btn btn-full" onClick={handleGoogle} style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.1)', color: '#212529', fontSize: '0.85rem' }}>
            📧 {t('continue_with_google') || 'Continue with Google'}
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.72rem', color: '#ADB5BD', marginTop: 24, textAlign: 'center', lineHeight: 1.5 }}>
        {t('terms_notice') || 'By continuing, you agree to our Terms and Privacy Policy'}
      </p>
    </div>
  );
};

export default LoginPage;
