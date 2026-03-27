interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';

const MealLoggerPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeMeal, setActiveMeal] = useState('breakfast');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const meals = [
    { id: 'breakfast', icon: '🥣', label: t('breakfast') || 'Breakfast', time: '7:00 - 10:00 AM', cal: 420, items: [
      { name: 'Scrambled eggs', cal: 180, qty: '2 large' },
      { name: 'Wheat toast', cal: 90, qty: '1 slice' },
      { name: 'Orange juice', cal: 110, qty: '8 oz' },
      { name: 'Banana', cal: 40, qty: '1/2' },
    ]},
    { id: 'lunch', icon: '🥗', label: t('lunch') || 'Lunch', time: '12:00 - 2:00 PM', cal: 550, items: [
      { name: 'Grilled chicken salad', cal: 350, qty: '1 bowl' },
      { name: 'Whole grain bread', cal: 120, qty: '1 slice' },
      { name: 'Water', cal: 0, qty: '16 oz' },
    ]},
    { id: 'dinner', icon: '🍽️', label: t('dinner') || 'Dinner', time: '6:00 - 8:00 PM', cal: 0, items: [] },
    { id: 'snacks', icon: '🍎', label: t('snacks') || 'Snacks', time: 'Anytime', cal: 150, items: [
      { name: 'Almonds', cal: 100, qty: '1 oz' },
      { name: 'Apple', cal: 50, qty: '1 small' },
    ]},
  ];

  const totalCal = meals.reduce((s, m) => s + m.cal, 0);
  const goalCal = 2000;
  const remaining = goalCal - totalCal;
  const pct = Math.min((totalCal / goalCal) * 100, 100);
  const activeMealData = meals.find(m => m.id === activeMeal)!;

  return (
    <div className="page animate-in">
      <PageHeader title={t('food_diary') || 'Food Diary'} onOpenMenu={onOpenMenu} />

      {/* Calorie Summary */}
      <div className="card card-gold" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.78rem', opacity: 0.85, marginBottom: 4 }}>{t('calories_remaining') || 'Calories Remaining'}</p>
            <p style={{ fontSize: '2rem', fontWeight: 900 }}>{remaining > 0 ? remaining : 0}</p>
            <p style={{ fontSize: '0.72rem', opacity: 0.7 }}>{totalCal} eaten &middot; {goalCal} goal</p>
          </div>
          <div style={{ position: 'relative', width: 80, height: 80 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="7" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 213.6} 213.6`} transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 800 }}>{Math.round(pct)}%</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          {[{ label: 'Protein', val: 65, goal: 120 }, { label: 'Carbs', val: 140, goal: 250 }, { label: 'Fat', val: 35, goal: 65 }].map(m => (
            <div key={m.label} style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', opacity: 0.8, marginBottom: 3 }}>
                <span>{m.label}</span><span>{m.val}g/{m.goal}g</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }}>
                <div style={{ width: `${Math.min((m.val / m.goal) * 100, 100)}%`, height: '100%', borderRadius: 2, background: 'white' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => navigate('/barcode-scanner')}>📷 {t('scan_barcode') || 'Scan Barcode'}</button>
        <button className="btn btn-pink btn-sm" style={{ flex: 1 }}>🔍 {t('search_food') || 'Search Food'}</button>
      </div>

      {/* Meal Tabs */}
      <div className="scroll-row" style={{ marginBottom: 16 }}>
        {meals.map(m => (
          <button key={m.id} onClick={() => setActiveMeal(m.id)} className={`btn ${activeMeal === m.id ? 'btn-gold' : 'btn-pink'} btn-sm`} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{m.icon}</span> {m.label}
            {m.cal > 0 && <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>{m.cal}</span>}
          </button>
        ))}
      </div>

      {/* Active Meal */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(212,160,23,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3E2723', marginBottom: 2 }}>{activeMealData.icon} {activeMealData.label}</h3>
            <p style={{ fontSize: '0.75rem', color: '#8D6E63', margin: 0 }}>{activeMealData.time}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D4A017' }}>{activeMealData.cal}</div>
            <div style={{ fontSize: '0.68rem', color: '#8D6E63' }}>kcal</div>
          </div>
        </div>
        {activeMealData.items.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>{activeMealData.icon}</p>
            <p style={{ color: '#8D6E63', fontSize: '0.85rem', marginBottom: 16 }}>No foods logged yet</p>
            <button className="btn btn-gold btn-sm" onClick={() => navigate('/barcode-scanner')}>+ Add Food</button>
          </div>
        ) : (
          <>
            {activeMealData.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: i < activeMealData.items.length - 1 ? '1px solid rgba(212,160,23,0.06)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#3E2723' }}>{item.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#BCAAA4' }}>{item.qty}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D4A017' }}>{item.cal} cal</div>
              </div>
            ))}
            <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(212,160,23,0.08)' }}>
              <button className="btn btn-pink btn-sm btn-full" onClick={() => navigate('/barcode-scanner')}>+ Add More</button>
            </div>
          </>
        )}
      </div>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={() => { localStorage.removeItem('sajoma-loggedIn'); navigate('/login'); }} />
      <BottomNav />
    </div>
  );
};

export default MealLoggerPage;
