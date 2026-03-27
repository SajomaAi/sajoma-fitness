interface PageProps {
  onOpenMenu: () => void;
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const MealResultScreen: React.FC<PageProps> = ({ onOpenMenu: _onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const result = {
    name: 'Grilled Chicken Salad',
    calories: 543,
    protein: 38,
    carbs: 12,
    fat: 24,
    fiber: 6,
    items: [
      { name: 'Grilled Chicken Breast', amount: '150g', cal: 248, icon: '🍗' },
      { name: 'Mixed Greens', amount: '2 cups', cal: 15, icon: '🥬' },
      { name: 'Avocado', amount: '1/2 medium', cal: 160, icon: '🥑' },
      { name: 'Olive Oil Dressing', amount: '1 tbsp', cal: 120, icon: '🥣' },
    ],
  };

  return (
    <div className="page animate-in">
      <div className="page-header">
        <button className="page-back" onClick={() => navigate(-1)}>&#8249;</button>
        <h1 className="page-header-title">{t('analysis_result') || 'Meal Analysis'}</h1>
        <div style={{ width: 32 }} />
      </div>

      {/* Photo + Calories */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=250&fit=crop" alt="Meal" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div className="card-gold" style={{ padding: 20, textAlign: 'center', borderRadius: 0 }}>
          <p style={{ fontSize: '0.78rem', opacity: 0.85, marginBottom: 4 }}>Total Calories</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>{result.calories} <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>kcal</span></p>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: 4 }}>{result.name}</p>
        </div>
      </div>

      {/* Macros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Protein', val: `${result.protein}g`, color: '#FF9800' },
          { label: 'Carbs', val: `${result.carbs}g`, color: '#42A5F5' },
          { label: 'Fat', val: `${result.fat}g`, color: '#AB47BC' },
          { label: 'Fiber', val: `${result.fiber}g`, color: '#66BB6A' },
        ].map(m => (
          <div key={m.label} className="card" style={{ padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: m.color }}>{m.val}</div>
            <div style={{ fontSize: '0.62rem', color: '#6C757D', fontWeight: 600 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Detected Items */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#212529', margin: 0 }}>Detected Ingredients</h3>
        </div>
        {result.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < result.items.length - 1 ? '1px solid rgba(212,175,55,0.06)' : 'none' }}>
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#212529' }}>{item.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#ADB5BD' }}>{item.amount}</div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D4AF37' }}>{item.cal} cal</span>
          </div>
        ))}
      </div>

      {/* Expert Tip */}
      <div className="card card-pink" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>Expert Suggestion</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#495057', lineHeight: 1.5, margin: 0 }}>
          This is a well-balanced meal! The high protein and healthy fats from avocado will keep you satiated. Consider adding more leafy greens for extra fiber.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn btn-gold btn-lg" style={{ flex: 2 }} onClick={() => navigate('/dashboard')}>Save to Log</button>
        <button className="btn btn-pink btn-lg" style={{ flex: 1 }} onClick={() => navigate('/meal-logger')}>Retake</button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MealResultScreen;
