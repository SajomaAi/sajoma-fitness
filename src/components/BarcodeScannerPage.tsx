interface PageProps {
  onOpenMenu: () => void;
}
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from '@ericblade/quagga2';
import { useTranslation } from '../hooks/useTranslation';
import { saveMealLog, MealAnalysis } from '../lib/mealAnalysis';
import BottomNav from './BottomNav';
import { culturalFoods, CulturalFood } from '../lib/culturalFoods';

interface BarcodeResult {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving_size: string;
  image?: string;
  barcode: string;
}

const BarcodeScannerPage: React.FC<PageProps> = ({ onOpenMenu: _onOpenMenu }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const scannerRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'scan' | 'search' | 'cultural'>('scan');
  const [barcode, setBarcode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [result, setResult] = useState<BarcodeResult | null>(null);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const lookupBarcode = useCallback(async (code: string) => {
    setError('');
    setResult(null);
    setIsLookingUp(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      if (data.status === 1) {
        const n = data.product.nutriments ?? {};
        setResult({
          name: data.product.product_name || 'Unknown product',
          brand: data.product.brands || '',
          calories: Number(n['energy-kcal_100g']) || 0,
          protein: Number(n.proteins_100g) || 0,
          carbs: Number(n.carbohydrates_100g) || 0,
          fat: Number(n.fat_100g) || 0,
          fiber: Number(n.fiber_100g) || 0,
          serving_size: data.product.serving_size || '100g',
          image: data.product.image_url,
          barcode: code,
        });
      } else {
        setError(t('product_not_found') || 'Product not found. Try manual search.');
      }
    } catch {
      setError(t('network_error') || 'Network error. Please try again.');
    }
    setIsLookingUp(false);
  }, [t]);

  const stopCamera = useCallback(async () => {
    try { await Quagga.stop(); } catch { /* already stopped */ }
    Quagga.offDetected();
    setIsCameraOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!scannerRef.current) return;
    setCameraError('');
    try {
      await Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            facingMode: 'environment',
            width: { min: 320, ideal: 640, max: 1280 },
            height: { min: 240, ideal: 480, max: 720 },
          },
          area: { top: '20%', right: '10%', left: '10%', bottom: '20%' },
        },
        locator: { patchSize: 'medium', halfSample: true },
        numOfWorkers: navigator.hardwareConcurrency ? Math.min(4, navigator.hardwareConcurrency) : 2,
        decoder: {
          readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader', 'code_128_reader'],
        },
        locate: true,
      });
      await Quagga.start();
      setIsCameraOn(true);

      Quagga.onDetected((data) => {
        const code = data.codeResult?.code;
        if (!code) return;
        // Debounce: accept on first good hit then stop
        Quagga.offDetected();
        stopCamera();
        setBarcode(code);
        lookupBarcode(code);
      });
    } catch (e) {
      setCameraError(e instanceof Error ? e.message : 'Camera access denied or unavailable');
      setIsCameraOn(false);
    }
  }, [lookupBarcode, stopCamera]);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  // Stop camera when switching tabs
  useEffect(() => {
    if (tab !== 'scan' && isCameraOn) stopCamera();
  }, [tab, isCameraOn, stopCamera]);

  const saveResult = async () => {
    if (!result) return;
    setSavingId('result');
    const analysis: MealAnalysis = {
      name: result.brand ? `${result.brand} ${result.name}` : result.name,
      calories: result.calories,
      protein_g: result.protein,
      carbs_g: result.carbs,
      fat_g: result.fat,
      fiber_g: result.fiber,
      serving_size: result.serving_size,
      confidence: 'high',
      notes: '',
    };
    const { error: saveErr } = await saveMealLog({
      analysis,
      photoPath: null,
      mealType: null,
      source: 'barcode',
      barcode: result.barcode,
    });
    setSavingId(null);
    if (saveErr) { setError(saveErr); return; }
    showToast(t('added_to_log') || 'Added to food log');
    setResult(null);
    setBarcode('');
  };

  const saveCulturalFood = async (food: CulturalFood) => {
    setSavingId(food.id);
    const analysis: MealAnalysis = {
      name: language === 'es' ? food.name_es : food.name_en,
      calories: food.calories,
      protein_g: food.protein,
      carbs_g: food.carbs,
      fat_g: food.fat,
      fiber_g: food.fiber,
      serving_size: language === 'es' ? food.serving_size_es : food.serving_size,
      confidence: 'high',
      notes: '',
    };
    const { error: saveErr } = await saveMealLog({
      analysis,
      photoPath: null,
      mealType: null,
      source: 'cultural_db',
    });
    setSavingId(null);
    if (saveErr) { setError(saveErr); return; }
    showToast(t('added_to_log') || 'Added to food log');
  };

  const filteredFoods = culturalFoods.filter(f => {
    const name = language === 'es' ? f.name_es : f.name_en;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="page animate-in">
      <div className="page-header">
        <button className="page-back" onClick={() => { stopCamera(); navigate('/meal-logger'); }}>&#8249;</button>
        <h1 className="page-header-title">{t('food_scanner') || 'Food Scanner'}</h1>
        <div style={{ width: 32 }} />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'scan' ? 'active' : ''}`} onClick={() => setTab('scan')}>📷 {t('scan') || 'Scan'}</button>
        <button className={`tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>🔍 {t('search') || 'Search'}</button>
        <button className={`tab ${tab === 'cultural' ? 'active' : ''}`} onClick={() => setTab('cultural')}>🌮 {t('cultural') || 'Cultural'}</button>
      </div>

      {tab === 'scan' && (
        <>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            <div
              ref={scannerRef}
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #212529, #495057)',
                height: 260,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {!isCameraOn && (
                <>
                  <div style={{ width: 180, height: 120, border: '3px solid rgba(212,175,55,0.6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.5 }}>📷</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginTop: 12 }}>
                    {t('tap_start_camera') || 'Tap below to start the camera'}
                  </p>
                </>
              )}
              {isCameraOn && (
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '3px solid rgba(212,175,55,0.6)',
                  boxShadow: 'inset 0 0 0 40px rgba(0,0,0,0.35)',
                  pointerEvents: 'none',
                }} />
              )}
            </div>
            <div style={{ padding: 14 }}>
              {!isCameraOn ? (
                <button className="btn btn-gold btn-full btn-sm" onClick={startCamera}>
                  📷 {t('start_camera') || 'Start Camera'}
                </button>
              ) : (
                <button className="btn btn-pink btn-full btn-sm" onClick={stopCamera}>
                  ⏹ {t('stop_camera') || 'Stop Camera'}
                </button>
              )}
              {cameraError && (
                <p style={{ color: '#C62828', fontSize: '0.78rem', marginTop: 8, margin: '8px 0 0' }}>{cameraError}</p>
              )}
            </div>
            <div style={{ padding: '0 18px 18px' }}>
              <label className="label">{t('or_enter_manually') || 'Or enter barcode manually'}</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="input" placeholder="Enter barcode number..." value={barcode} onChange={e => setBarcode(e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-gold btn-sm" onClick={() => lookupBarcode(barcode)} disabled={!barcode || isLookingUp}>
                  {isLookingUp ? '...' : (t('look_up') || 'Look Up')}
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#212529', marginBottom: 2 }}>{result.name}</h3>
                  {result.brand && <p style={{ fontSize: '0.78rem', color: '#6C757D', margin: 0 }}>{result.brand}</p>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                {[
                  { label: t('calories') || 'Calories', val: Math.round(result.calories) },
                  { label: t('protein') || 'Protein', val: `${Math.round(result.protein)}g` },
                  { label: t('carbs') || 'Carbs', val: `${Math.round(result.carbs)}g` },
                  { label: t('fat') || 'Fat', val: `${Math.round(result.fat)}g` },
                ].map(n => (
                  <div key={n.label} style={{ textAlign: 'center', padding: 10, background: 'rgba(212,175,55,0.05)', borderRadius: 12 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#D4AF37' }}>{n.val}</div>
                    <div style={{ fontSize: '0.62rem', color: '#6C757D', fontWeight: 600 }}>{n.label}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-gold btn-full" onClick={saveResult} disabled={savingId === 'result'}>
                {savingId === 'result' ? '…' : `+ ${t('add_to_meal_log') || 'Add to Meal Log'}`}
              </button>
            </div>
          )}

          <div className="card" style={{ padding: 16 }}>
            <h3 className="section-title">{t('try_these_barcodes') || 'Try These Barcodes'}</h3>
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
          <input className="input" placeholder={`🔍 ${t('search_foods') || 'Search foods...'}`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: 16 }} />
          {searchQuery && filteredFoods.slice(0, 15).map((food) => (
            <div key={food.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#212529' }}>{language === 'es' ? food.name_es : food.name_en}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{language === 'es' ? food.serving_size_es : food.serving_size}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D4AF37' }}>{food.calories} cal</span>
                <button className="btn btn-gold btn-sm" style={{ padding: '6px 12px' }} onClick={() => saveCulturalFood(food)} disabled={savingId === food.id}>
                  {savingId === food.id ? '…' : '+'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'cultural' && (
        <div>
          <div className="card card-gold" style={{ padding: 16, marginBottom: 16, textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>🌮 Latino &amp; Hispanic Foods</h3>
            <p style={{ fontSize: '0.78rem', opacity: 0.85 }}>{t('traditional_dishes_subtitle') || 'Traditional dishes with nutrition data'}</p>
          </div>
          {culturalFoods.map((food) => (
            <div key={food.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#212529' }}>{language === 'es' ? food.name_es : food.name_en}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{language === 'es' ? food.serving_size_es : food.serving_size} &middot; P:{food.protein}g C:{food.carbs}g F:{food.fat}g</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D4AF37' }}>{food.calories}</span>
                <button className="btn btn-gold btn-sm" style={{ padding: '6px 12px' }} onClick={() => saveCulturalFood(food)} disabled={savingId === food.id}>
                  {savingId === food.id ? '…' : '+'}
                </button>
              </div>
            </div>
          ))}
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

export default BarcodeScannerPage;
