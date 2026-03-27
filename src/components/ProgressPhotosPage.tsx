import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface PhotoEntry { id: number; date: string; type: 'front' | 'side' | 'back'; url: string; weight?: string; }

const ProgressPhotosPage: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'gallery' | 'compare'>('gallery');
  const [photos, setPhotos] = useState<PhotoEntry[]>(() => {
    const s = localStorage.getItem('sajoma-photos');
    return s ? JSON.parse(s) : [];
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newPhoto: PhotoEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'front',
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop',
        weight: '145 lbs'
      };
      const updated = [newPhoto, ...photos];
      setPhotos(updated);
      localStorage.setItem('sajoma-photos', JSON.stringify(updated));
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>📸 {t('progress_photos') || 'Progress'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 16 }}>{t('progress_subtitle') || 'Visualize your transformation'}</p>

      <div className="sf-tabs">
        <button className={`sf-tab ${tab === 'gallery' ? 'active' : ''}`} onClick={() => setTab('gallery')}>{t('gallery') || 'Gallery'}</button>
        <button className={`sf-tab ${tab === 'compare' ? 'active' : ''}`} onClick={() => setTab('compare')}>{t('compare') || 'Compare'}</button>
      </div>

      {tab === 'gallery' && (
        <div className="animate-in">
          <div className="sf-card sf-card-pink" style={{ padding: 24, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📷</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3E2723', marginBottom: 8 }}>{t('add_new_photo') || 'Add New Photo'}</h3>
            <p style={{ fontSize: '0.82rem', color: '#8D6E63', marginBottom: 16 }}>{t('photo_tip') || 'Take photos in the same lighting for best results'}</p>
            <button className="sf-btn sf-btn-gold sf-btn-lg" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? '...' : (t('take_photo') || 'Take Photo')}
            </button>
          </div>

          {photos.length === 0 ? (
            <div className="sf-card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#BCAAA4', fontSize: '0.9rem' }}>{t('no_photos_yet') || 'No progress photos yet'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {photos.map(p => (
                <div key={p.id} className="sf-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={p.url} alt="Progress" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  <div style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#C5961B' }}>{new Date(p.date).toLocaleDateString()}</span>
                    <span style={{ fontSize: '0.7rem', color: '#8D6E63' }}>{p.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'compare' && (
        <div className="animate-in">
          {photos.length < 2 ? (
            <div className="sf-card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#8D6E63' }}>{t('need_two_photos') || 'Add at least two photos to compare'}</p>
            </div>
          ) : (
            <div className="sf-card" style={{ padding: 12 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8D6E63', marginBottom: 6 }}>{t('before') || 'Before'}</p>
                  <div style={{ borderRadius: 12, overflow: 'hidden', height: 300 }}>
                    <img src={photos[photos.length - 1].url} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', marginTop: 6, fontWeight: 600 }}>{new Date(photos[photos.length - 1].date).toLocaleDateString()}</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C5961B', marginBottom: 6 }}>{t('after') || 'After'}</p>
                  <div style={{ borderRadius: 12, overflow: 'hidden', height: 300 }}>
                    <img src={photos[0].url} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', marginTop: 6, fontWeight: 600 }}>{new Date(photos[0].date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="sf-card sf-card-gold" style={{ padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t('keep_it_up') || 'You are making great progress!'}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ProgressPhotosPage;
