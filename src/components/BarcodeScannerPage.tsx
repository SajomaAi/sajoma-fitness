import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import { culturalFoods } from '../lib/culturalFoods';

const BarcodeScannerPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [tab, setTab] = useState<'scan'|'cultural'>('scan');
  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [search, setSearch] = useState('');

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setBarcode('7501055300076'); // Example barcode
    }, 2000);
  };

  const filteredCultural = culturalFoods.filter(f => 
    ((language === "es" ? f.name_es : f.name_en) || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>📱 {t('barcode_scanner') || 'Scanner'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 16 }}>{t('barcode_subtitle') || 'Scan food for instant nutrition'}</p>

      <div className="sf-tabs">
        <button className={`sf-tab ${tab === 'scan' ? 'active' : ''}`} onClick={() => setTab('scan')}>{t('scan_barcode') || 'Scan'}</button>
        <button className={`sf-tab ${tab === 'cultural' ? 'active' : ''}`} onClick={() => setTab('cultural')}>{t('cultural_foods') || 'Cultural Foods'}</button>
      </div>

      {tab === 'scan' && (
        <div className="animate-in">
          <div className="sf-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20, position: 'relative', height: 300, background: '#000' }}>
            {isScanning ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: '80%', height: 2, background: '#F8B4C8', position: 'absolute', top: '50%', left: '10%', boxShadow: '0 0 15px #F8B4C8', animation: 'scanMove 2s infinite ease-in-out' }} />
                <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>{t('scanning') || 'Scanning...'}</p>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
                <span style={{ fontSize: '3rem', marginBottom: 16 }}>📷</span>
                <p style={{ color: 'white', fontSize: '0.9rem', opacity: 0.8 }}>{t('camera_preview_msg') || 'Align barcode within the frame'}</p>
              </div>
            )}
            <style>{`@keyframes scanMove { 0%, 100% { top: 20%; } 50% { top: 80%; } }`}</style>
          </div>

          <div className="sf-card" style={{ padding: 20, marginBottom: 20 }}>
            <label className="sf-label">{t('manual_barcode') || 'Manual Entry'}</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input className="sf-input" placeholder="e.g. 7501055300076" value={barcode} onChange={e => setBarcode(e.target.value)} />
              <button className="sf-btn sf-btn-gold" style={{ padding: '0 20px' }}>{t('find') || 'Find'}</button>
            </div>
          </div>

          <button className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg" onClick={handleScan} disabled={isScanning}>
            {isScanning ? '...' : (t('start_scanning') || 'Start Scanning')}
          </button>
        </div>
      )}

      {tab === 'cultural' && (
        <div className="animate-in">
          <input className="sf-input" placeholder={t('search_cultural_foods') || 'Search Latino/Hispanic foods...'} value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />
          
          <div style={{ display: 'grid', gap: 10 }}>
            {filteredCultural.map((food, i) => (
              <div key={i} className="sf-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF5F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🥘</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.92rem', margin: 0 }}>{language === "es" ? food.name_es : food.name_en}</p>
                  <p style={{ color: '#8D6E63', fontSize: '0.75rem', margin: 0 }}>{food.serving_size} · {food.carbs}g carbs</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0, color: '#C5961B' }}>{food.calories}</p>
                  <p style={{ color: '#BCAAA4', fontSize: '0.7rem', margin: 0 }}>kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default BarcodeScannerPage;
