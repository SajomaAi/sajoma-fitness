interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';

interface PhotoEntry { id: number; date: string; type: 'front' | 'side' | 'back'; url: string; weight?: string; }

const ProgressPhotosPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tab, setTab] = useState<'gallery' | 'compare' | 'add'>('gallery');
  const [photos, setPhotos] = useState<PhotoEntry[]>(() => {
    const saved = localStorage.getItem('sajoma-photos');
    return saved ? JSON.parse(saved) : [];
  });
  const [photoType, setPhotoType] = useState<'front' | 'side' | 'back'>('front');
  const [weight, setWeight] = useState('');

  const handleAddPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const entry: PhotoEntry = { id: Date.now(), date: new Date().toISOString(), type: photoType, url: ev.target?.result as string, weight };
        const updated = [entry, ...photos];
        setPhotos(updated);
        localStorage.setItem('sajoma-photos', JSON.stringify(updated));
        setTab('gallery');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="page animate-in">
      <PageHeader title={t('progress_photos') || 'Progress Photos'} onOpenMenu={onOpenMenu} />

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${tab === 'gallery' ? 'active' : ''}`} onClick={() => setTab('gallery')}>📷 {t('gallery') || 'Gallery'}</button>
        <button className={`tab ${tab === 'compare' ? 'active' : ''}`} onClick={() => setTab('compare')}>↔️ {t('compare') || 'Compare'}</button>
        <button className={`tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>+ {t('add') || 'Add'}</button>
      </div>

      {tab === 'gallery' && (
        <>
          {photos.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>📸</p>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#212529', marginBottom: 6 }}>{t('no_photos_yet') || 'No Photos Yet'}</h3>
              <p style={{ fontSize: '0.82rem', color: '#6C757D', marginBottom: 20 }}>{t('take_first_photo') || 'Take your first progress photo to start tracking your journey'}</p>
              <button className="btn btn-gold" onClick={() => setTab('add')}>+ {t('take_photo') || 'Take Photo'}</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {photos.map(p => (
                <div key={p.id} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', aspectRatio: '3/4' }}>
                  <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 8px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                    <div style={{ fontSize: '0.62rem', color: 'white', fontWeight: 600 }}>{new Date(p.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{p.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'compare' && (
        <div>
          {photos.length < 2 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>↔️</p>
              <p style={{ color: '#6C757D' }}>{t('need_two_photos') || 'Need at least 2 photos to compare'}</p>
            </div>
          ) : (
            <div>
              <div className="card" style={{ padding: 16, marginBottom: 16 }}>
                <h3 className="section-title">{t('before_after') || 'Before & After'}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', aspectRatio: '3/4', position: 'relative' }}>
                    <img src={photos[photos.length - 1].url} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '3px 10px', borderRadius: 8, fontSize: '0.68rem', fontWeight: 600 }}>{t('before') || 'Before'}</div>
                  </div>
                  <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', aspectRatio: '3/4', position: 'relative' }}>
                    <img src={photos[0].url} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'var(--gold-gradient)', color: 'white', padding: '3px 10px', borderRadius: 8, fontSize: '0.68rem', fontWeight: 600 }}>{t('after') || 'After'}</div>
                  </div>
                </div>
              </div>
              <div className="card card-pink" style={{ padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: '#495057' }}>
                  {photos.length} {t('photos_over') || 'photos over'} {Math.ceil((new Date(photos[0].date).getTime() - new Date(photos[photos.length - 1].date).getTime()) / 86400000)} {t('days') || 'days'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'add' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="section-title">{t('new_progress_photo') || 'New Progress Photo'}</h3>
          <div style={{ marginBottom: 16 }}>
            <label className="label">{t('photo_type') || 'Photo Type'}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['front', 'side', 'back'] as const).map(type => (
                <button key={type} onClick={() => setPhotoType(type)} className={`btn ${photoType === type ? 'btn-gold' : 'btn-pink'} btn-sm`} style={{ flex: 1, textTransform: 'capitalize' }}>{t(type) || type}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label">{t('current_weight_optional') || 'Current Weight (optional)'}</label>
            <input className="input" type="number" placeholder="e.g. 150 lbs" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <button className="btn btn-gold btn-full btn-lg" onClick={handleAddPhoto}>📷 {t('take_upload_photo') || 'Take / Upload Photo'}</button>
        </div>
      )}

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={() => { localStorage.removeItem('sajoma-loggedIn'); navigate('/login'); }} />
      <BottomNav />
    </div>
  );
};

export default ProgressPhotosPage;
