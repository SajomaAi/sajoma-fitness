import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your name');
        setIsLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
    }
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid credentials
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #F8B4C8 0%, #D4A017 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(212,160,23,0.4)'
          }}>
            🏃‍♀️
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
            {isSignUp ? 'Join Sajoma Fitness' : 'Welcome to Sajoma Fitness'}
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {isSignUp ? 'Start your wellness journey today' : 'Your wellness journey starts here'}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="name" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: '#333'
                }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  backgroundColor: '#f5f9f5'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                backgroundColor: '#f5f9f5'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  fontWeight: 'bold',
                  color: '#333'
                }}
              >
                Password
              </label>
              {!isSignUp && (
                <Link 
                  to="/forgot-password" 
                  style={{ 
                    color: '#6b8e23', 
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                backgroundColor: '#f5f9f5'
              }}
            />
          </div>

          {isSignUp && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="confirmPassword" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: '#333'
                }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  backgroundColor: '#f5f9f5'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#ccc' : '#6b8e23',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '10px'
                }}></div>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b8e23',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 'inherit'
              }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
