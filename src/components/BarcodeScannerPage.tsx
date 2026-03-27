interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import { culturalFoods } from '../lib/culturalFoods';

const BarcodeScannerPage: React.FC<PageProps> = ({ onOpenMenu: _onOpenMenu }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'scan' | 'search' | 'cultural'>('scan');
  const [barcode, setBarcode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const lookupBarcode = async (code: string) => {
    setError('');
    setResult(null);
    setIsScanning(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      if (data.status === 1) {
        setResult({
          name: data.product.product_name || 'Unknown',
          brand: data.product.brands || '',
          calories: data.product.nutriments?.['energy-kcal_100g'] || 0,
          protein: data.product.nutriments?.proteins_100g || 0,
          carbs: data.product.nutriments?.carbohydrates_100g || 0,
          fat: data.product.nutriments?.fat_100g || 0,
          image: data.product.image_url,
        });
      } else { setError('Product not found. Try manual search.'); }
    } catch { setError('Network error. Please try again.'); }
    setIsScanning(false);
  };

  const filteredFoods = culturalFoods.filter(f => {
    const name = language === 'es' ? f.name_es : f.name_en;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="page animate-in">
      <div className="page-header">
        <button className="page-back" onClick={() => navigate('/meal-logger')}>&#8249;</button>
        <h1 className="page-header-title">{t('food_scanner') || 'Food Scanner'}</h1>
        <div style={{ width: 32 }} />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'scan' ? 'active' : ''}`} onClick={() => setTab('scan')}>📷 Scan</button>
        <button className={`tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>🔍 Search</button>
        <button className={`tab ${tab === 'cultural' ? 'active' : ''}`} onClick={() => setTab('cultural')}>🌮 Cultural</button>
      </div>

      {tab === 'scan' && (
        <>
          {/* Scanner Area */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #3E2723, #5D4037)', height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: 180, height: 120, border: '3px solid rgba(212,160,23,0.6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem', opacity: 0.5 }}>📷</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginTop: 12 }}>Point camera at barcode</p>
            </div>
            <div style={{ padding: 18 }}>
              <label className="label">Or enter barcode manually</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="input" placeholder="Enter barcode number..." value={barcode} onChange={e => setBarcode(e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-gold btn-sm" onClick={() => lookupBarcode(barcode)} disabled={!barcode || isScanning}>
                  {isScanning ? '...' : 'Look Up'}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="card card-pink" style={{ padding: 14, textAlign: 'center', marginBottom: 16 }}><p style={{ color: '#C62828', fontSize: '0.85rem', margin: 0 }}>{error}</p></div>}

          {result && (
            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                {result.image && <img src={result.image} alt="" style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', background: '#f5f5f5' }} />}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3E2723', marginBottom: 2 }}>{result.name}</h3>
                  {result.brand && <p style={{ fontSize: '0.78rem', color: '#8D6E63', margin: 0 }}>{result.brand}</p>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Calories', val: `${result.calories}`, unit: 'kcal' },
                  { label: 'Protein', val: `${result.protein}g`, unit: '' },
                  { label: 'Carbs', val: `${result.carbs}g`, unit: '' },
                  { label: 'Fat', val: `${result.fat}g`, unit: '' },
                ].map(n => (
                  <div key={n.label} style={{ textAlign: 'center', padding: 10, background: 'rgba(212,160,23,0.05)', borderRadius: 12 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#D4A017' }}>{n.val}</div>
                    <div style={{ fontSize: '0.62rem', color: '#8D6E63', fontWeight: 600 }}>{n.label}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-gold btn-full">+ Add to Meal Log</button>
            </div>
          )}

          {/* Sample Barcodes */}
          <div className="card" style={{ padding: 16 }}>
            <h3 className="section-title">Try These Barcodes</h3>
            {['3017620422003', '5449000000996', '8410076472960'].map(code => (
              <button key={code} onClick={() => { setBarcode(code); lookupBarcode(code); }} className="btn btn-pink btn-sm btn-full" style={{ marginBottom: 6 }}>
                {code}
              </button>
            ))}
          </div>
        </>
      )}

      {tab === 'search' && (
        <div>
          <input className="input" placeholder="🔍 Search foods..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: 16 }} />
          {searchQuery && filteredFoods.slice(0, 15).map((food, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#3E2723' }}>{language === 'es' ? food.name_es : food.name_en}</div>
                <div style={{ fontSize: '0.72rem', color: '#8D6E63' }}>{food.serving_size}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D4A017' }}>{food.calories} cal</span>
                <button className="btn btn-gold btn-sm" style={{ padding: '6px 12px' }}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'cultural' && (
        <div>
          <div className="card card-gold" style={{ padding: 16, marginBottom: 16, textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>🌮 Latino & Hispanic Foods</h3>
            <p style={{ fontSize: '0.78rem', opacity: 0.85 }}>Traditional dishes with nutrition data</p>
          </div>
          {culturalFoods.map((food, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#3E2723' }}>{language === 'es' ? food.name_es : food.name_en}</div>
                <div style={{ fontSize: '0.72rem', color: '#8D6E63' }}>{food.serving_size} &middot; P:{food.protein}g C:{food.carbs}g F:{food.fat}g</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D4A017' }}>{food.calories}</span>
                <button className="btn btn-gold btn-sm" style={{ padding: '6px 12px' }}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default BarcodeScannerPage;
