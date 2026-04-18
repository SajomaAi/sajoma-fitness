interface PageProps {
  onOpenMenu: () => void;
}
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import { saveMealLog, MealAnalysis } from '../lib/mealAnalysis';
import BottomNav from './BottomNav';

interface LocationState {
  analysis: MealAnalysis;
  photoPath: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  source: 'manual' | 'barcode' | 'ai_photo' | 'cultural_db';
  barcode?: string;
}

const MealResultScreen: React.FC<PageProps> = ({ onOpenMenu: _onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state) return;
    if (!state.photoPath) return;
    let cancelled = false;
    supabase.storage.from('meal-photos').createSignedUrl(state.photoPath, 60 * 10).then(({ data }) => {
      if (!cancelled && data?.signedUrl) setPhotoUrl(data.signedUrl);
    });
    return () => { cancelled = true; };
  }, [state]);

  if (!state || !state.analysis) {
    return (
      <div className="page animate-in">
        <div className="page-header">
          <button className="page-back" onClick={() => navigate(-1)}>&#8249;</button>
          <h1 className="page-header-title">{t('analysis_result') || 'Meal Analysis'}</h1>
          <div style={{ width: 32 }} />
        </div>
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>🤔</p>
          <p style={{ color: '#6C757D', fontSize: '0.9rem', marginBottom: 20 }}>
            {t('no_meal_to_show') || 'No meal data to show yet.'}
          </p>
          <button className="btn btn-gold btn-sm" onClick={() => navigate('/meal-logger')}>
            {t('back_to_diary') || 'Back to Food Diary'}
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const { analysis } = state;

  const handleSave = async () => {
    setError('');
    setSaving(true);
    const { error: saveErr } = await saveMealLog({
      analysis,
      photoPath: state.photoPath,
      mealType: state.mealType,
      source: state.source,
      barcode: state.barcode,
    });
    setSaving(false);
    if (saveErr) { setError(saveErr); return; }
    navigate('/meal-logger');
  };

  const confidenceColor = analysis.confidence === 'high' ? '#2E7D32' : analysis.confidence === 'medium' ? '#F57C00' : '#C62828';

  return (
    <div className="page animate-in">
      <div className="page-header">
        <button className="page-back" onClick={() => navigate(-1)}>&#8249;</button>
        <h1 className="page-header-title">{t('analysis_result') || 'Meal Analysis'}</h1>
        <div style={{ width: 32 }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        {photoUrl && (
          <img src={photoUrl} alt={analysis.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        )}
        <div className="card-gold" style={{ padding: 20, textAlign: 'center', borderRadius: 0 }}>
          <p style={{ fontSize: '0.78rem', opacity: 0.85, marginBottom: 4 }}>{t('total_calories') || 'Total Calories'}</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>
            {Math.round(analysis.calories)} <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>kcal</span>
          </p>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: 4 }}>{analysis.name}</p>
          <p style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: 2 }}>{analysis.serving_size}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
        {[
          { label: t('protein') || 'Protein', val: `${Math.round(analysis.protein_g)}g`, color: '#FF9800' },
          { label: t('carbs') || 'Carbs', val: `${Math.round(analysis.carbs_g)}g`, color: '#42A5F5' },
          { label: t('fat') || 'Fat', val: `${Math.round(analysis.fat_g)}g`, color: '#AB47BC' },
          { label: t('fiber') || 'Fiber', val: `${Math.round(analysis.fiber_g)}g`, color: '#66BB6A' },
        ].map(m => (
          <div key={m.label} className="card" style={{ padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: m.color }}>{m.val}</div>
            <div style={{ fontSize: '0.62rem', color: '#6C757D', fontWeight: 600 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          display: 'inline-block', padding: '4px 10px', borderRadius: 999,
          background: `${confidenceColor}20`, color: confidenceColor,
          fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
        }}>
          {analysis.confidence} {t('confidence') || 'confidence'}
        </span>
        <span style={{ fontSize: '0.78rem', color: '#6C757D' }}>
          {state.source === 'ai_photo' ? 'Claude vision' : state.source}
        </span>
      </div>

      {analysis.notes && (
        <div className="card card-pink" style={{ padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>💡</span>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>{t('expert_suggestion') || 'Expert Note'}</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#495057', lineHeight: 1.5, margin: 0 }}>{analysis.notes}</p>
        </div>
      )}

      {error && (
        <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: '0.82rem', color: '#C62828' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn btn-gold btn-lg" style={{ flex: 2 }} onClick={handleSave} disabled={saving}>
          {saving ? '…' : (t('save_to_log') || 'Save to Log')}
        </button>
        <button className="btn btn-pink btn-lg" style={{ flex: 1 }} onClick={() => navigate('/meal-logger')} disabled={saving}>
          {t('retake') || 'Retake'}
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MealResultScreen;
