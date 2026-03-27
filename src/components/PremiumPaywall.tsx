import React from 'react';
import { useNavigate } from 'react-router-dom';

const PremiumPaywall: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: '#FFF0F5',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 32, maxWidth: 360, width: '100%',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(62,39,35,0.08)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>👑</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3E2723', marginBottom: 8 }}>Unlock Premium</h2>
        <p style={{ fontSize: '0.88rem', color: '#8D6E63', lineHeight: 1.5, marginBottom: 24 }}>
          This feature is only available to Premium members. Start your 30-day free trial today!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, textAlign: 'left' }}>
          {['AI Meal Analysis', 'Personalized Plans', 'Advanced Analytics', 'Priority Support', 'Ad-free Experience'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#5D4037' }}>
              <span style={{ color: '#D4A017', fontWeight: 700 }}>&#10003;</span> {f}
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/subscription')} style={{
          width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #D4A017, #C5961B)', color: 'white',
          fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit', marginBottom: 10,
          boxShadow: '0 4px 16px rgba(212,160,23,0.3)',
        }}>
          Start Free Trial
        </button>

        <button onClick={() => navigate(-1)} style={{
          width: '100%', padding: '12px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'transparent', color: '#8D6E63', fontSize: '0.85rem', fontFamily: 'inherit',
        }}>
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default PremiumPaywall;
