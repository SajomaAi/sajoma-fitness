import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const MealResultScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const ingredients = [
    { name: 'Grilled Chicken Breast', amount: '150g', cal: 248, icon: '🍗' },
    { name: 'Mixed Greens', amount: '2 cups', cal: 15, icon: '🥬' },
    { name: 'Avocado', amount: '1/2 medium', cal: 160, icon: '🥑' },
    { name: 'Olive Oil Dressing', amount: '1 tbsp', cal: 120, icon: '🥣' },
  ];

  const macros = [
    { label: 'Protein', value: '38g', pct: 75, color: '#C5961B' },
    { label: 'Carbs', value: '12g', pct: 15, color: '#F8B4C8' },
    { label: 'Fats', value: '24g', pct: 45, color: '#FFD6E0' },
  ];

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>‹</button>
        <h1 className="page-title" style={{ marginBottom: 0 }}>{t('analysis_result') || 'Analysis Result'}</h1>
      </div>

      <div className="sf-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop" alt="Meal" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
        <div style={{ padding: 20, textAlign: 'center', background: 'linear-gradient(180deg, white 0%, #FFF5F8 100%)' }}>
          <p style={{ fontSize: '0.85rem', color: '#8D6E63', marginBottom: 4 }}>{t('total_calories') || 'Total Calories'}</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#C5961B', margin: 0 }}>543 <span style={{ fontSize: '1rem', fontWeight: 600, color: '#BCAAA4' }}>kcal</span></h2>
        </div>
      </div>

      {/* Macros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {macros.map((m, i) => (
          <div key={i} className="sf-card" style={{ flex: 1, padding: '12px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8D6E63', marginBottom: 4, textTransform: 'uppercase' }}>{m.label}</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#3E2723', margin: '0 0 8px' }}>{m.value}</p>
            <div style={{ height: 4, background: '#FFF0F5', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Ingredients */}
      <h3 className="section-title">{t('detected_ingredients') || 'Detected Ingredients'}</h3>
      <div className="sf-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        {ingredients.map((ing, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
            borderBottom: i === ingredients.length - 1 ? 'none' : '1px solid rgba(197,150,27,0.08)',
          }}>
            <span style={{ fontSize: '1.3rem' }}>{ing.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{ing.name}</p>
              <p style={{ color: '#8D6E63', fontSize: '0.75rem', margin: 0 }}>{ing.amount}</p>
            </div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#C5961B', margin: 0 }}>{ing.cal} kcal</p>
          </div>
        ))}
      </div>

      {/* Expert Suggestion */}
      <div className="sf-card sf-card-pink" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: '1.3rem' }}>💡</span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3E2723', margin: 0 }}>{t('expert_suggestion') || 'Expert Suggestion'}</h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#5D4037', lineHeight: 1.6, margin: 0 }}>
          {t('expert_msg') || 'This is a well-balanced meal! The high protein and healthy fats from avocado will keep you satiated. Consider adding a few more leafy greens for extra fiber.'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg" onClick={() => navigate('/dashboard')}>
          {t('save_to_log') || 'Save to Log'}
        </button>
        <button className="sf-btn sf-btn-outline sf-btn-lg" onClick={() => navigate('/meal-logger')}>
          {t('retake') || 'Retake'}
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MealResultScreen;
