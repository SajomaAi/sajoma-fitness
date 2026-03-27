import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    { icon: '📷', title: t('meal_analysis') || 'Meal Analysis', desc: t('meal_analysis_desc') || 'Photo-based nutrition tracking with AI analysis' },
    { icon: '💧', title: t('water_tracking') || 'Water Tracking', desc: t('water_tracking_desc') || 'Stay hydrated with smart reminders' },
    { icon: '💪', title: t('exercise_tracking') || 'Exercise Tracking', desc: t('exercise_tracking_desc') || 'Log workouts and track progress' },
    { icon: '📓', title: t('journal') || 'Wellness Journal', desc: t('journal_desc') || 'Daily mood, energy and gratitude tracking' },
    { icon: '📱', title: t('barcode_scanner') || 'Barcode Scanner', desc: t('barcode_scanner_desc') || 'Scan food for instant nutrition info' },
    { icon: '📸', title: t('progress_photos') || 'Progress Photos', desc: t('progress_photos_desc') || 'Visual progress tracking over time' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFF5F8 0%, #FFFAF0 100%)' }}>
      {/* Hero */}
      <div style={{ padding: '60px 20px 40px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #F8B4C8, #D4A017)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(212,160,23,0.25)',
          fontSize: '2rem', color: 'white', fontWeight: 800,
        }}>S</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3E2723', letterSpacing: '-0.03em', marginBottom: 12 }}>
          Sajoma Fitness
        </h1>
        <p style={{ fontSize: '1rem', color: '#8D6E63', lineHeight: 1.6, maxWidth: 340, margin: '0 auto 28px' }}>
          {t('app_description') || 'Track meals, monitor health metrics, and receive expert wellness suggestions.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="sf-btn sf-btn-gold sf-btn-lg" style={{ minWidth: 160 }}>
            {t('get_started') || 'Get Started'}
          </Link>
          <Link to="/login" className="sf-btn sf-btn-outline sf-btn-lg" style={{ minWidth: 160 }}>
            {t('login') || 'Log In'}
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '20px 20px 40px', maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3E2723', textAlign: 'center', marginBottom: 20 }}>
          {t('key_features') || 'Key Features'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} className="sf-card" style={{ padding: 16 }}>
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
              <p style={{ fontWeight: 700, fontSize: '0.88rem', margin: '10px 0 4px', color: '#3E2723' }}>{f.title}</p>
              <p style={{ fontSize: '0.75rem', color: '#8D6E63', margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '20px 20px 40px', maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3E2723', textAlign: 'center', marginBottom: 20 }}>
          {t('what_users_say') || 'What Our Users Say'}
        </h2>
        {[
          { text: 'Sajoma Fitness helped me identify foods causing my joint pain. Game changer!', name: 'Maria G.', rating: 5 },
          { text: 'The water tracking is so simple. My energy levels improved dramatically.', name: 'Carmen R.', rating: 5 },
          { text: 'Love how it supports both English and Spanish. Finally an app for us!', name: 'Ana L.', rating: 5 },
        ].map((t, i) => (
          <div key={i} className="sf-card" style={{ padding: 18, marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
              {Array(t.rating).fill(0).map((_, j) => <span key={j} style={{ color: '#C5961B', fontSize: '0.9rem' }}>★</span>)}
            </div>
            <p style={{ fontSize: '0.88rem', color: '#5D4037', lineHeight: 1.6, margin: '0 0 8px' }}>"{t.text}"</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#C5961B', margin: 0 }}>— {t.name}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        padding: '32px 20px 48px', textAlign: 'center', maxWidth: 480, margin: '0 auto',
      }}>
        <div className="sf-card sf-card-gold" style={{ padding: 28, textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8 }}>
            {t('start_journey') || 'Start Your Wellness Journey'}
          </h3>
          <p style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: 20 }}>
            {t('join_thousands') || 'Join thousands taking control of their health'}
          </p>
          <Link to="/signup" className="sf-btn sf-btn-lg" style={{
            background: 'white', color: '#C5961B', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            {t('get_started_free') || 'Get Started Free'}
          </Link>
        </div>
        <p style={{ marginTop: 20, fontSize: '0.75rem', color: '#BCAAA4' }}>
          © {new Date().getFullYear()} Sajoma Fitness. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
