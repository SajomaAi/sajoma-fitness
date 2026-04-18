interface PageProps {
  onOpenMenu: () => void;
}
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { analyzeMealPhoto } from '../lib/mealAnalysis';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealLogRow {
  id: string;
  meal_type: MealType | null;
  name: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  serving_size: string | null;
  logged_at: string;
}

const MealLoggerPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast');
  const [logs, setLogs] = useState<MealLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('meal_logs')
        .select('id, meal_type, name, calories, protein_g, carbs_g, fat_g, serving_size, logged_at')
        .gte('logged_at', startOfDay.toISOString())
        .order('logged_at', { ascending: false });
      setLogs((data as MealLogRow[]) ?? []);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goalCal = profile?.daily_calorie_goal ?? 2000;
  const totalCal = logs.reduce((s, l) => s + (l.calories ?? 0), 0);
  const totalProtein = logs.reduce((s, l) => s + (l.protein_g ?? 0), 0);
  const totalCarbs = logs.reduce((s, l) => s + (l.carbs_g ?? 0), 0);
  const totalFat = logs.reduce((s, l) => s + (l.fat_g ?? 0), 0);
  const remaining = goalCal - totalCal;
  const pct = Math.min((totalCal / goalCal) * 100, 100);

  const meals: { id: MealType; icon: string; label: string; time: string }[] = [
    { id: 'breakfast', icon: '🥣', label: t('breakfast') || 'Breakfast', time: '7:00 - 10:00 AM' },
    { id: 'lunch', icon: '🥗', label: t('lunch') || 'Lunch', time: '12:00 - 2:00 PM' },
    { id: 'dinner', icon: '🍽️', label: t('dinner') || 'Dinner', time: '6:00 - 8:00 PM' },
    { id: 'snack', icon: '🍎', label: t('snacks') || 'Snacks', time: 'Anytime' },
  ];

  const calsByMeal = (id: MealType) => logs.filter(l => l.meal_type === id).reduce((s, l) => s + (l.calories ?? 0), 0);
  const activeMealData = meals.find(m => m.id === activeMeal)!;
  const activeItems = logs.filter(l => l.meal_type === activeMeal);

  const handleDelete = async (id: string) => {
    const prev = logs;
    setLogs(logs.filter(l => l.id !== id));
    const { error: delErr } = await supabase.from('meal_logs').delete().eq('id', id);
    if (delErr) {
      setLogs(prev);
      setError(delErr.message);
    }
  };

  const handleFilePicked = async (file: File) => {
    setError('');
    setAnalyzing(true);
    const result = await analyzeMealPhoto(file, language === 'es' ? 'es' : 'en');
    setAnalyzing(false);
    if (!result.ok) { setError(result.error); return; }
    navigate('/meal-result', {
      state: {
        analysis: result.analysis,
        photoPath: result.photoPath,
        mealType: activeMeal,
        source: 'ai_photo' as const,
      },
    });
  };

  const openPhotoPicker = () => fileInputRef.current?.click();

  return (
    <div className="page animate-in">
      <PageHeader title={t('food_diary') || 'Food Diary'} onOpenMenu={onOpenMenu} />

      <div className="card card-gold" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.78rem', opacity: 0.85, marginBottom: 4 }}>{t('calories_remaining') || 'Calories Remaining'}</p>
            <p style={{ fontSize: '2rem', fontWeight: 900 }}>{remaining > 0 ? Math.round(remaining) : 0}</p>
            <p style={{ fontSize: '0.72rem', opacity: 0.7 }}>{Math.round(totalCal)} eaten &middot; {goalCal} goal</p>
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
          {[
            { label: 'Protein', val: Math.round(totalProtein), goal: 120 },
            { label: 'Carbs', val: Math.round(totalCarbs), goal: 250 },
            { label: 'Fat', val: Math.round(totalFat), goal: 65 },
          ].map(m => (
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFilePicked(f); e.target.value = ''; }}
      />
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={openPhotoPicker} disabled={analyzing}>
          {analyzing ? '…' : `📸 ${t('snap_meal') || 'Snap Meal (AI)'}`}
        </button>
        <button className="btn btn-pink btn-sm" style={{ flex: 1 }} onClick={() => navigate('/barcode-scanner')}>
          📷 {t('scan_barcode') || 'Scan Barcode'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#FFF3E0', border: '1px solid #FFCC80', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: '0.82rem', color: '#C62828' }}>
          {error}
        </div>
      )}

      {/* Meal Tabs */}
      <div className="scroll-row" style={{ marginBottom: 16 }}>
        {meals.map(m => {
          const c = calsByMeal(m.id);
          return (
            <button key={m.id} onClick={() => setActiveMeal(m.id)} className={`btn ${activeMeal === m.id ? 'btn-gold' : 'btn-pink'} btn-sm`} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{m.icon}</span> {m.label}
              {c > 0 && <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>{Math.round(c)}</span>}
            </button>
          );
        })}
      </div>

      {/* Active Meal */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(212,175,55,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#212529', marginBottom: 2 }}>{activeMealData.icon} {activeMealData.label}</h3>
            <p style={{ fontSize: '0.75rem', color: '#6C757D', margin: 0 }}>{activeMealData.time}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D4AF37' }}>{Math.round(calsByMeal(activeMeal))}</div>
            <div style={{ fontSize: '0.68rem', color: '#6C757D' }}>kcal</div>
          </div>
        </div>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#6C757D', fontSize: '0.85rem' }}>Loading…</div>
        ) : activeItems.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>{activeMealData.icon}</p>
            <p style={{ color: '#6C757D', fontSize: '0.85rem', marginBottom: 16 }}>{t('no_foods_logged') || 'No foods logged yet'}</p>
            <button className="btn btn-gold btn-sm" onClick={openPhotoPicker}>+ {t('add_food') || 'Add Food'}</button>
          </div>
        ) : (
          <>
            {activeItems.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: i < activeItems.length - 1 ? '1px solid rgba(212,175,55,0.06)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#212529' }}>{item.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#ADB5BD' }}>{item.serving_size || ''}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D4AF37', marginRight: 10 }}>{Math.round(item.calories ?? 0)} cal</div>
                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete"
                  style={{ background: 'none', border: 'none', color: '#ADB5BD', cursor: 'pointer', fontSize: '1.1rem', padding: 4 }}
                >✕</button>
              </div>
            ))}
            <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(212,175,55,0.08)' }}>
              <button className="btn btn-pink btn-sm btn-full" onClick={openPhotoPicker}>+ {t('add_more') || 'Add More'}</button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MealLoggerPage;
