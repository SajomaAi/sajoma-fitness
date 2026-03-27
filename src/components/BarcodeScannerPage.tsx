import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { culturalFoods, searchCulturalFoods, CulturalFood } from '../lib/culturalFoods';
import BottomNav from './BottomNav';

interface NutritionData {
  name: string;
  brand?: string;
  image?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  serving_size: string;
}

const BarcodeScannerPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'scan' | 'search' | 'cultural'>('search');
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [culturalQuery, setCulturalQuery] = useState('');
  const [product, setProduct] = useState<NutritionData | null>(null);
  const [searchResults, setSearchResults] = useState<NutritionData[]>([]);
  const [culturalResults, setCulturalResults] = useState<CulturalFood[]>(culturalFoods);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdded, setShowAdded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsScanning(true);
      setError('');
    } catch {
      setError('Camera access denied. Please use manual barcode entry.');
    }
  };

  const lookupBarcode = async (barcode: string) => {
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const n = p.nutriments || {};
        setProduct({
          name: p.product_name || 'Unknown Product',
          brand: p.brands,
          image: p.image_front_small_url,
          calories: Math.round(n['energy-kcal_100g'] || n['energy-kcal'] || 0),
          protein: Math.round((n.proteins_100g || 0) * 10) / 10,
          carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
          fat: Math.round((n.fat_100g || 0) * 10) / 10,
          fiber: Math.round((n.fiber_100g || 0) * 10) / 10,
          sugar: Math.round((n.sugars_100g || 0) * 10) / 10,
          sodium: Math.round((n.sodium_100g || 0) * 1000),
          serving_size: p.serving_size || '100g',
        });
      } else {
        setError(t('product_not_found'));
      }
    } catch {
      setError(t('product_not_found'));
    }
    setLoading(false);
    stopCamera();
  };

  const searchFood = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchResults([]);
    setError('');
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&search_simple=1&action=process&json=1&page_size=10`);
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        setSearchResults(data.products.map((p: any) => {
          const n = p.nutriments || {};
          return {
            name: p.product_name || 'Unknown',
            brand: p.brands,
            image: p.image_front_small_url,
            calories: Math.round(n['energy-kcal_100g'] || 0),
            protein: Math.round((n.proteins_100g || 0) * 10) / 10,
            carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
            fat: Math.round((n.fat_100g || 0) * 10) / 10,
            fiber: Math.round((n.fiber_100g || 0) * 10) / 10,
            sugar: Math.round((n.sugars_100g || 0) * 10) / 10,
            sodium: Math.round((n.sodium_100g || 0) * 1000),
            serving_size: p.serving_size || '100g',
          };
        }).filter((p: NutritionData) => p.name !== 'Unknown'));
      } else {
        setError(t('no_results'));
      }
    } catch {
      setError(t('no_results'));
    }
    setLoading(false);
  };

  const handleCulturalSearch = (query: string) => {
    setCulturalQuery(query);
    if (!query.trim()) {
      setCulturalResults(culturalFoods);
    } else {
      setCulturalResults(searchCulturalFoods(query, language as 'en' | 'es'));
    }
  };

  const addToMealLog = (food: NutritionData | CulturalFood) => {
    const existing = JSON.parse(localStorage.getItem('sajoma-meal-log') || '[]');
    const entry = 'name_en' in food ? {
      name: language === 'es' ? food.name_es : food.name_en,
      calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat,
      timestamp: Date.now(), date: new Date().toLocaleDateString(),
    } : {
      name: food.name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat,
      timestamp: Date.now(), date: new Date().toLocaleDateString(),
    };
    existing.unshift(entry);
    localStorage.setItem('sajoma-meal-log', JSON.stringify(existing));
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const NutritionCard: React.FC<{ food: NutritionData; onAdd: () => void }> = ({ food, onAdd }) => (
    <div className="card" style={{ padding: '16px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        {food.image && <img src={food.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />}
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>{food.name}</p>
          {food.brand && <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.8rem' }}>{food.brand}</p>}
          <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.75rem' }}>{t('serving_size')}: {food.serving_size}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: t('calories'), value: food.calories, unit: 'kcal', color: '#E53935' },
          { label: t('protein'), value: food.protein, unit: 'g', color: '#1E88E5' },
          { label: t('carbs'), value: food.carbs, unit: 'g', color: '#FB8C00' },
          { label: t('fat'), value: food.fat, unit: 'g', color: '#8E24AA' },
        ].map((n, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '8px 4px', backgroundColor: n.color + '10', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: n.color }}>{n.value}</p>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-gray)' }}>{n.label}</p>
          </div>
        ))}
      </div>
      <button onClick={onAdd} className="btn btn-full" style={{ fontSize: '0.9rem', padding: '10px', borderRadius: '10px' }}>
        {t('add_to_meal_log')}
      </button>
    </div>
  );

  return (
    <div className="container" style={{ padding: '20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', textAlign: 'center' }}>{t('barcode_scanner')}</h1>

      {/* Success Toast */}
      {showAdded && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#D4A017', color: 'white', padding: '12px 24px',
          borderRadius: '12px', zIndex: 1000, fontWeight: '600', fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          ✓ {t('added_to_log')}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', backgroundColor: '#f1f3f5', borderRadius: '12px', padding: '4px' }}>
        {(['scan', 'search', 'cultural'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setProduct(null); setSearchResults([]); setError(''); }}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-gray)',
              fontWeight: activeTab === tab ? '700' : '500', fontSize: '0.8rem',
              cursor: 'pointer', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {tab === 'scan' ? t('scan_barcode') : tab === 'search' ? t('search_food') : t('cultural_foods')}
          </button>
        ))}
      </div>

      {/* SCAN TAB */}
      {activeTab === 'scan' && (
        <div>
          {/* Camera View */}
          <div style={{
            position: 'relative', width: '100%', aspectRatio: '4/3',
            backgroundColor: '#1a1a1a', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px',
          }}>
            {isScanning ? (
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
                <span style={{ fontSize: '3rem', marginBottom: '12px' }}>📷</span>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{t('point_camera_at_barcode')}</p>
              </div>
            )}
            {isScanning && (
              <div style={{
                position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px',
                backgroundColor: '#F8B4C8', boxShadow: '0 0 10px #F8B4C8',
                animation: 'scanLine 2s ease-in-out infinite',
              }} />
            )}
          </div>

          <style>{`@keyframes scanLine { 0%, 100% { transform: translateY(-40px); } 50% { transform: translateY(40px); } }`}</style>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button onClick={isScanning ? stopCamera : startScanning} className="btn" style={{ flex: 1, borderRadius: '12px', padding: '12px' }}>
              {isScanning ? '⏹ Stop' : '📷 ' + t('scan_barcode')}
            </button>
          </div>

          {/* Manual Barcode Entry */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px' }}>{t('manual_search')}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                placeholder="Enter barcode number..."
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '1rem' }}
                onKeyDown={e => e.key === 'Enter' && barcodeInput && lookupBarcode(barcodeInput)}
              />
              <button
                onClick={() => barcodeInput && lookupBarcode(barcodeInput)}
                className="btn"
                disabled={!barcodeInput || loading}
                style={{ borderRadius: '10px', padding: '12px 20px', opacity: barcodeInput ? 1 : 0.5 }}
              >
                {loading ? '...' : '🔍'}
              </button>
            </div>
          </div>

          {error && <p style={{ color: '#E53935', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
          {product && <NutritionCard food={product} onAdd={() => addToMealLog(product)} />}
        </div>
      )}

      {/* SEARCH TAB */}
      {activeTab === 'search' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('search_food_placeholder')}
              style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '1rem' }}
              onKeyDown={e => e.key === 'Enter' && searchFood()}
            />
            <button onClick={searchFood} className="btn" disabled={loading || !searchQuery.trim()} style={{ borderRadius: '10px', padding: '12px 20px' }}>
              {loading ? '...' : '🔍'}
            </button>
          </div>

          {error && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-gray)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🔍</span>
              <p>{error}</p>
              <p style={{ fontSize: '0.85rem' }}>{t('try_different_search')}</p>
            </div>
          )}

          {searchResults.map((food, i) => (
            <NutritionCard key={i} food={food} onAdd={() => addToMealLog(food)} />
          ))}
        </div>
      )}

      {/* CULTURAL FOODS TAB */}
      {activeTab === 'cultural' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={culturalQuery}
              onChange={e => handleCulturalSearch(e.target.value)}
              placeholder={t('search_cultural_foods')}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🌮 {t('latino_hispanic_foods')}
          </h2>

          {culturalResults.map(food => (
            <div key={food.id} className="card" style={{ padding: '14px 16px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>
                    {language === 'es' ? food.name_es : food.name_en}
                  </p>
                  <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.75rem' }}>
                    {food.origin} · {language === 'es' ? food.serving_size_es : food.serving_size}
                  </p>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#E53935' }}>{food.calories} kcal</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
                {[
                  { label: t('protein'), value: food.protein, color: '#1E88E5' },
                  { label: t('carbs'), value: food.carbs, color: '#FB8C00' },
                  { label: t('fat'), value: food.fat, color: '#8E24AA' },
                  { label: t('fiber'), value: food.fiber, color: '#C4900A' },
                ].map((n, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '4px', backgroundColor: n.color + '10', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: n.color }}>{n.value}g</p>
                    <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--text-gray)' }}>{n.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => addToMealLog(food)} className="btn btn-full" style={{ fontSize: '0.8rem', padding: '8px', borderRadius: '8px' }}>
                {t('add_to_meal_log')}
              </button>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default BarcodeScannerPage;
