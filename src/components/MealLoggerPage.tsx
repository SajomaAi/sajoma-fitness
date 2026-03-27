import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const MealLoggerPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePhoto = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      navigate('/meal-result');
    }, 2500);
  };

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>🍽️ {t('meal_logger') || 'Meal Logger'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>{t('meal_subtitle') || 'Track your nutrition with AI'}</p>

      <div className="sf-card sf-card-pink" style={{ padding: 40, textAlign: 'center', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        {isAnalyzing ? (
          <div className="animate-in">
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid #F8B4C8', borderTopColor: '#D4A017', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3E2723', marginBottom: 8 }}>{t('analyzing_meal') || 'Analyzing Meal...'}</h3>
            <p style={{ fontSize: '0.85rem', color: '#8D6E63' }}>{t('ai_identifying') || 'Our AI is identifying ingredients and calculating nutrition.'}</p>
          </div>
        ) : (
          <div className="animate-in">
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>📸</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3E2723', marginBottom: 10 }}>{t('take_meal_photo') || 'Take a Photo'}</h3>
            <p style={{ fontSize: '0.9rem', color: '#8D6E63', marginBottom: 24, maxWidth: 280, margin: '0 auto 24px' }}>
              {t('photo_instruction') || 'Simply snap a photo of your plate and let our AI do the rest.'}
            </p>
            <button className="sf-btn sf-btn-gold sf-btn-lg sf-btn-full" onClick={handlePhoto}>
              {t('open_camera') || 'Open Camera'}
            </button>
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(197,150,27,0.1)' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#BCAAA4', textTransform: 'uppercase' }}>{t('or') || 'or'}</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(197,150,27,0.1)' }} />
      </div>

      <div className="sf-card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3E2723', marginBottom: 16 }}>{t('manual_log') || 'Manual Entry'}</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input className="sf-input" placeholder={t('search_food_placeholder') || 'Search for a food...'} />
          <button className="sf-btn sf-btn-gold" style={{ padding: '0 20px' }}>{t('search') || 'Search'}</button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="sf-btn sf-btn-outline sf-btn-full" onClick={() => navigate('/barcode-scanner')}>
            📱 {t('scan_barcode') || 'Scan Barcode'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 className="section-title">{t('recent_logs') || 'Recent Logs'}</h3>
        {[
          { name: 'Avocado Toast', cal: 320, time: 'Today, 8:45 AM', emoji: '🥑' },
          { name: 'Grilled Chicken Salad', cal: 450, time: 'Yesterday, 1:20 PM', emoji: '🥗' },
        ].map((item, i) => (
          <div key={i} className="sf-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF5F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{item.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.92rem', margin: 0 }}>{item.name}</p>
              <p style={{ color: '#8D6E63', fontSize: '0.75rem', margin: 0 }}>{item.time}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0, color: '#C5961B' }}>{item.cal}</p>
              <p style={{ color: '#BCAAA4', fontSize: '0.7rem', margin: 0 }}>kcal</p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default MealLoggerPage;
