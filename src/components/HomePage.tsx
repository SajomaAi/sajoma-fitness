import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../lib/basePath';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{
          width: 110, height: 110, borderRadius: 28, marginBottom: 24, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(212,175,55,0.25)',
        }}>
          <img src={assetUrl('/sajoma-icon.png')} alt="Sajoma Fitness" style={{ width: 110, height: 110 }} onError={(e) => {
            const el = e.target as HTMLImageElement; el.style.display = 'none';
            el.parentElement!.innerHTML = '<span style="font-size:2.5rem;color:#D4AF37;font-weight:900">S</span>';
          }} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#212529', marginBottom: 8 }}>Sajoma Fitness</h1>
        <p style={{ fontSize: '1rem', color: '#6C757D', lineHeight: 1.6, marginBottom: 32, maxWidth: 300 }}>
          Your premium wellness companion. Track meals, workouts, and achieve your health goals.
        </p>

        {/* Feature Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32, width: '100%', maxWidth: 340 }}>
          {[
            { icon: '🍎', label: 'Nutrition' },
            { icon: '💪', label: 'Workouts' },
            { icon: '📊', label: 'Analytics' },
          ].map(f => (
            <div key={f.label} style={{
              padding: '16px 8px', borderRadius: 20, background: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{f.icon}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#495057' }}>{f.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ width: '100%', maxWidth: 340 }}>
          {[
            { text: 'Sajoma Fitness helped me reach my goals!', name: 'Maria G.', stars: 5 },
            { text: 'Love the bilingual support. Finally an app for us!', name: 'Ana L.', stars: 5 },
          ].map((t, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 20, padding: 16, marginBottom: 10,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                {Array(t.stars).fill(0).map((_, j) => <span key={j} style={{ color: '#D4AF37', fontSize: '0.8rem' }}>&#9733;</span>)}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#495057', lineHeight: 1.5, margin: '0 0 6px' }}>"{t.text}"</p>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#D4AF37', margin: 0 }}>&mdash; {t.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ padding: '0 24px 40px' }}>
        <button onClick={() => navigate('/login?mode=signup')} style={{
          width: '100%', padding: '16px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: '#C19A29', color: 'white',
          fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit', marginBottom: 12,
          boxShadow: '0 4px 20px rgba(212,175,55,0.3)', transition: 'background 0.3s',
        }}>
          Get Started
        </button>
        <button onClick={() => navigate('/login')} style={{
          width: '100%', padding: '14px 0', borderRadius: 12, cursor: 'pointer',
          background: 'transparent', color: '#D4AF37', border: '2px solid #D4AF37',
          fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit',
        }}>
          I Already Have an Account
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#ADB5BD', marginTop: 16 }}>
          &copy; {new Date().getFullYear()} Sajoma Fitness. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
