import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface ProgressPhoto {
  id: string;
  dataUrl: string;
  date: string;
  timestamp: number;
  type: 'front' | 'side';
  note?: string;
}

const ProgressPhotosPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'gallery' | 'compare'>('gallery');
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [compareA, setCompareA] = useState<ProgressPhoto | null>(null);
  const [compareB, setCompareB] = useState<ProgressPhoto | null>(null);
  const [selectingFor, setSelectingFor] = useState<'a' | 'b' | null>(null);
  const [photoType, setPhotoType] = useState<'front' | 'side'>('front');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sajoma-progress-photos');
    if (saved) {
      try { setPhotos(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      savePhoto(dataUrl);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const savePhoto = (dataUrl: string) => {
    const photo: ProgressPhoto = {
      id: Date.now().toString(),
      dataUrl,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      type: photoType,
    };
    const updated = [photo, ...photos];
    setPhotos(updated);
    localStorage.setItem('sajoma-progress-photos', JSON.stringify(updated));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const deletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    localStorage.setItem('sajoma-progress-photos', JSON.stringify(updated));
    if (compareA?.id === id) setCompareA(null);
    if (compareB?.id === id) setCompareB(null);
  };

  const selectForComparison = (photo: ProgressPhoto) => {
    if (selectingFor === 'a') {
      setCompareA(photo);
      setSelectingFor(null);
    } else if (selectingFor === 'b') {
      setCompareB(photo);
      setSelectingFor(null);
    }
  };

  const groupByWeek = () => {
    const groups: Record<string, ProgressPhoto[]> = {};
    photos.forEach(photo => {
      const date = new Date(photo.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toLocaleDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(photo);
    });
    return groups;
  };

  return (
    <div className="container" style={{ padding: '20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', textAlign: 'center' }}>{t('progress_photos')}</h1>

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: 'none' }} />

      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#D4A017', color: 'white', padding: '12px 24px',
          borderRadius: '12px', zIndex: 1000, fontWeight: '600', fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          ✓ {t('photo_saved')}
        </div>
      )}

      {/* Photo Type Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
        {(['front', 'side'] as const).map(type => (
          <button
            key={type}
            onClick={() => setPhotoType(type)}
            style={{
              padding: '8px 20px', borderRadius: '20px',
              border: '2px solid', borderColor: photoType === type ? 'var(--primary-color)' : '#e9ecef',
              backgroundColor: photoType === type ? 'var(--primary-color)' + '15' : 'white',
              color: photoType === type ? 'var(--primary-color)' : '#666',
              fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
            }}
          >
            {t(type)}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '12px', padding: '14px' }}
        >
          📷 {t('take_photo')}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '12px', padding: '14px', backgroundColor: '#f1f3f5', color: '#333' }}
        >
          🖼️ {t('upload_photo')}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', backgroundColor: '#f1f3f5', borderRadius: '12px', padding: '4px' }}>
        {(['gallery', 'compare'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-gray)',
              fontWeight: activeTab === tab ? '700' : '500', fontSize: '0.85rem',
              cursor: 'pointer', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab === 'gallery' ? t('weekly_progress') : t('comparison_view')}
          </button>
        ))}
      </div>

      {/* GALLERY TAB */}
      {activeTab === 'gallery' && (
        <div>
          {photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-gray)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>📸</span>
              <p>{t('no_photos_yet')}</p>
            </div>
          ) : (
            Object.entries(groupByWeek()).map(([weekKey, weekPhotos]) => (
              <div key={weekKey} style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '10px' }}>
                  {t('weekly_progress')} — {weekKey}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {weekPhotos.map(photo => (
                    <div key={photo.id} style={{ position: 'relative', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden' }}>
                      <img
                        src={photo.dataUrl}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onClick={() => {
                          if (selectingFor) selectForComparison(photo);
                        }}
                      />
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        padding: '8px', color: 'white',
                      }}>
                        <p style={{ margin: 0, fontSize: '0.65rem' }}>{photo.date}</p>
                        <p style={{ margin: 0, fontSize: '0.6rem', opacity: 0.8 }}>{t(photo.type)}</p>
                      </div>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        style={{
                          position: 'absolute', top: '4px', right: '4px',
                          background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                          width: '24px', height: '24px', borderRadius: '50%',
                          cursor: 'pointer', fontSize: '0.8rem', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* COMPARE TAB */}
      {activeTab === 'compare' && (
        <div>
          <p style={{ textAlign: 'center', color: 'var(--text-gray)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {t('select_photos_to_compare')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {/* Before */}
            <div>
              <p style={{ textAlign: 'center', fontWeight: '700', marginBottom: '8px', color: 'var(--primary-color)' }}>{t('before')}</p>
              <div
                onClick={() => setSelectingFor('a')}
                style={{
                  aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden',
                  border: selectingFor === 'a' ? '3px solid var(--primary-color)' : '2px dashed #dee2e6',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: '#f8f9fa',
                }}
              >
                {compareA ? (
                  <img src={compareA.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-gray)' }}>
                    <span style={{ fontSize: '2rem', display: 'block' }}>+</span>
                    <span style={{ fontSize: '0.75rem' }}>Select photo</span>
                  </div>
                )}
              </div>
              {compareA && <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '4px' }}>{compareA.date}</p>}
            </div>

            {/* After */}
            <div>
              <p style={{ textAlign: 'center', fontWeight: '700', marginBottom: '8px', color: 'var(--primary-color)' }}>{t('after')}</p>
              <div
                onClick={() => setSelectingFor('b')}
                style={{
                  aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden',
                  border: selectingFor === 'b' ? '3px solid var(--primary-color)' : '2px dashed #dee2e6',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: '#f8f9fa',
                }}
              >
                {compareB ? (
                  <img src={compareB.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-gray)' }}>
                    <span style={{ fontSize: '2rem', display: 'block' }}>+</span>
                    <span style={{ fontSize: '0.75rem' }}>Select photo</span>
                  </div>
                )}
              </div>
              {compareB && <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '4px' }}>{compareB.date}</p>}
            </div>
          </div>

          {/* Photo selector when selecting */}
          {selectingFor && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>
                Select a photo for "{selectingFor === 'a' ? t('before') : t('after')}":
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {photos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => selectForComparison(photo)}
                    style={{
                      aspectRatio: '3/4', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                      border: (compareA?.id === photo.id || compareB?.id === photo.id) ? '2px solid var(--primary-color)' : '1px solid #dee2e6',
                    }}
                  >
                    <img src={photo.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectingFor(null)}
                style={{
                  marginTop: '8px', padding: '8px 16px', border: '1px solid #dee2e6',
                  borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.85rem',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ProgressPhotosPage;
