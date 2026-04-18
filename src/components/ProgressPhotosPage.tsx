interface PageProps {
  onOpenMenu: () => void;
}
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

interface PhotoRow {
  id: string;
  storage_path: string;
  weight_kg: number | null;
  notes: string | null;
  taken_at: string;
  // Populated client-side after signed URL fetch
  signed_url?: string;
  // Photo type parsed from notes prefix ("front:" / "side:" / "back:")
  photo_type?: 'front' | 'side' | 'back';
}

type PhotoType = 'front' | 'side' | 'back';

const ProgressPhotosPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'gallery' | 'compare' | 'add'>('gallery');
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [photoType, setPhotoType] = useState<PhotoType>('front');
  const [weight, setWeight] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const loadPhotos = async () => {
    const { data } = await supabase
      .from('progress_photos')
      .select('id, storage_path, weight_kg, notes, taken_at')
      .order('taken_at', { ascending: false });
    const rows = (data as PhotoRow[]) ?? [];
    // Sign URLs in parallel
    const signed = await Promise.all(
      rows.map(async (p) => {
        const { data: urlData } = await supabase.storage.from('progress-photos').createSignedUrl(p.storage_path, 60 * 60);
        const type = (p.notes?.split(':')[0] ?? 'front') as PhotoType;
        return { ...p, signed_url: urlData?.signedUrl, photo_type: type };
      })
    );
    setPhotos(signed);
    setLoading(false);
  };

  useEffect(() => { loadPhotos(); }, []);

  const handleAddPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      await uploadFile(file);
    };
    input.click();
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setUploading(false); showToast('Not signed in'); return; }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const storagePath = `${userData.user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('progress-photos').upload(storagePath, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });
    if (upErr) { setUploading(false); showToast(upErr.message); return; }

    const weightKg = weight ? parseFloat(weight) : null;
    const { error: insertErr } = await supabase.from('progress_photos').insert({
      user_id: userData.user.id,
      storage_path: storagePath,
      weight_kg: weightKg,
      notes: `${photoType}:`,
      taken_at: new Date().toISOString(),
    });
    setUploading(false);
    if (insertErr) { showToast(insertErr.message); return; }
    setWeight('');
    await loadPhotos();
    setTab('gallery');
    showToast(t('photo_added') || 'Photo added');
  };

  const handleDelete = async (row: PhotoRow) => {
    await supabase.storage.from('progress-photos').remove([row.storage_path]);
    await supabase.from('progress_photos').delete().eq('id', row.id);
    setPhotos(photos.filter(p => p.id !== row.id));
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
          {loading ? (
            <div className="card" style={{ padding: 32, textAlign: 'center', color: '#6C757D', fontSize: '0.85rem' }}>Loading…</div>
          ) : photos.length === 0 ? (
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
                  {p.signed_url && <img src={p.signed_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <button
                    onClick={() => handleDelete(p)}
                    aria-label="Delete"
                    style={{
                      position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', cursor: 'pointer',
                      fontSize: '0.85rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >✕</button>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 8px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                    <div style={{ fontSize: '0.62rem', color: 'white', fontWeight: 600 }}>{new Date(p.taken_at).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{p.photo_type}</div>
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
                    {photos[photos.length - 1].signed_url && (
                      <img src={photos[photos.length - 1].signed_url} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '3px 10px', borderRadius: 8, fontSize: '0.68rem', fontWeight: 600 }}>{t('before') || 'Before'}</div>
                  </div>
                  <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', aspectRatio: '3/4', position: 'relative' }}>
                    {photos[0].signed_url && (
                      <img src={photos[0].signed_url} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'var(--gold-gradient)', color: 'white', padding: '3px 10px', borderRadius: 8, fontSize: '0.68rem', fontWeight: 600 }}>{t('after') || 'After'}</div>
                  </div>
                </div>
              </div>
              <div className="card card-pink" style={{ padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: '#495057' }}>
                  {photos.length} {t('photos_over') || 'photos over'} {Math.ceil((new Date(photos[0].taken_at).getTime() - new Date(photos[photos.length - 1].taken_at).getTime()) / 86400000)} {t('days') || 'days'}
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
            <label className="label">{t('current_weight_kg') || 'Current Weight (kg, optional)'}</label>
            <input className="input" type="number" placeholder="e.g. 68" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <button className="btn btn-gold btn-full btn-lg" onClick={handleAddPhoto} disabled={uploading}>
            {uploading ? '…' : `📷 ${t('take_upload_photo') || 'Take / Upload Photo'}`}
          </button>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
          background: '#212529', color: 'white', padding: '10px 18px', borderRadius: 999,
          fontSize: '0.85rem', fontWeight: 600, zIndex: 1000, boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
        }}>{toast}</div>
      )}

      <BottomNav />
    </div>
  );
};

export default ProgressPhotosPage;
