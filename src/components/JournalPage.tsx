import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  mood: number;
  energy: number;
  gratitude: string;
  notes: string;
  prompt: string;
  promptResponse: string;
}

const MOOD_EMOJIS = ['😞', '😐', '🙂', '😊', '😁'];
const MOOD_LABELS_EN = ['Poor', 'Low', 'Okay', 'Good', 'Great'];
const MOOD_LABELS_ES = ['Mal', 'Bajo', 'Regular', 'Bien', 'Excelente'];
const ENERGY_LABELS_EN = ['Exhausted', 'Low', 'Moderate', 'High', 'Energized'];
const ENERGY_LABELS_ES = ['Agotado', 'Bajo', 'Moderado', 'Alto', 'Energizado'];

const PROMPTS_EN = [
  "What's one thing you did today that made you proud?",
  "Describe a moment of peace you experienced recently.",
  "What healthy choice did you make today?",
  "Who or what inspired you today?",
  "What's one thing you'd like to improve about your wellness routine?",
  "Describe how your body feels right now.",
  "What's a goal you're working toward this week?",
  "What food made you feel the best today?",
  "How did you move your body today?",
  "What's something you're looking forward to?",
  "Write about a challenge you overcame recently.",
  "What does self-care mean to you today?",
  "How did you practice mindfulness today?",
  "What's one small win you had today?",
  "Describe your ideal healthy day.",
];

const PROMPTS_ES = [
  "¿Qué hiciste hoy que te hizo sentir orgulloso/a?",
  "Describe un momento de paz que experimentaste recientemente.",
  "¿Qué decisión saludable tomaste hoy?",
  "¿Quién o qué te inspiró hoy?",
  "¿Qué te gustaría mejorar de tu rutina de bienestar?",
  "Describe cómo se siente tu cuerpo ahora mismo.",
  "¿Cuál es una meta en la que estás trabajando esta semana?",
  "¿Qué comida te hizo sentir mejor hoy?",
  "¿Cómo moviste tu cuerpo hoy?",
  "¿Qué es algo que esperas con ansias?",
  "Escribe sobre un desafío que superaste recientemente.",
  "¿Qué significa el autocuidado para ti hoy?",
  "¿Cómo practicaste la atención plena hoy?",
  "¿Cuál es una pequeña victoria que tuviste hoy?",
  "Describe tu día saludable ideal.",
];

const JournalPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [gratitude, setGratitude] = useState('');
  const [notes, setNotes] = useState('');
  const [promptResponse, setPromptResponse] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const prompts = language === 'es' ? PROMPTS_ES : PROMPTS_EN;
  const moodLabels = language === 'es' ? MOOD_LABELS_ES : MOOD_LABELS_EN;
  const energyLabels = language === 'es' ? ENERGY_LABELS_ES : ENERGY_LABELS_EN;
  const todayPrompt = prompts[new Date().getDate() % prompts.length];

  useEffect(() => {
    const saved = localStorage.getItem('sajoma-journal');
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const saveEntry = () => {
    if (!gratitude && !notes && !promptResponse) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      mood,
      energy,
      gratitude,
      notes,
      prompt: todayPrompt,
      promptResponse,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('sajoma-journal', JSON.stringify(updated));
    setShowSuccess(true);
    setGratitude('');
    setNotes('');
    setPromptResponse('');
    setMood(3);
    setEnergy(3);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('sajoma-journal', JSON.stringify(updated));
  };

  const filteredEntries = searchQuery
    ? entries.filter(e =>
        e.gratitude.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.promptResponse.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  return (
    <div className="container" style={{ padding: '20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', textAlign: 'center' }}>{t('daily_journal')}</h1>

      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#D4A017', color: 'white', padding: '12px 24px',
          borderRadius: '12px', zIndex: 1000, fontWeight: '600', fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          ✓ {t('entry_saved')}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', backgroundColor: '#f1f3f5', borderRadius: '12px', padding: '4px' }}>
        {(['new', 'history'] as const).map(tab => (
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
            {tab === 'new' ? t('new_entry') : t('journal_history')}
          </button>
        ))}
      </div>

      {/* NEW ENTRY TAB */}
      {activeTab === 'new' && (
        <div>
          {/* Today's Prompt */}
          <div className="card" style={{
            padding: '16px', marginBottom: '20px',
            background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0F5 100%)',
            border: '1px solid #c8e6c9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: '#B8860B' }}>{t('todays_prompt')}</p>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.95rem', fontStyle: 'italic', color: '#8B6914', lineHeight: '1.5' }}>
              "{todayPrompt}"
            </p>
            <textarea
              value={promptResponse}
              onChange={e => setPromptResponse(e.target.value)}
              placeholder={t('write_your_thoughts')}
              rows={3}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #c8e6c9',
                fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
                backgroundColor: 'white',
              }}
            />
          </div>

          {/* Mood */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '10px' }}>{t('how_are_you_feeling')}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {MOOD_EMOJIS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i + 1)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    padding: '10px 8px', borderRadius: '12px', border: '2px solid',
                    borderColor: mood === i + 1 ? 'var(--primary-color)' : 'transparent',
                    backgroundColor: mood === i + 1 ? 'var(--primary-color)' + '15' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.2s ease', minWidth: '52px',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: mood === i + 1 ? '700' : '500', color: mood === i + 1 ? 'var(--primary-color)' : '#666' }}>
                    {moodLabels[i]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '10px' }}>{t('energy_level')}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {[1, 2, 3, 4, 5].map(level => {
                const colors = ['#E53935', '#FB8C00', '#FDD835', '#66BB6A', '#C4900A'];
                return (
                  <button
                    key={level}
                    onClick={() => setEnergy(level)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      padding: '10px 8px', borderRadius: '12px', border: '2px solid',
                      borderColor: energy === level ? colors[level - 1] : 'transparent',
                      backgroundColor: energy === level ? colors[level - 1] + '20' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.2s ease', minWidth: '52px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1px' }}>
                      {Array.from({ length: level }).map((_, j) => (
                        <div key={j} style={{ width: '6px', height: '16px', backgroundColor: colors[level - 1], borderRadius: '2px' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.6rem', fontWeight: energy === level ? '700' : '500', color: energy === level ? colors[level - 1] : '#666' }}>
                      {energyLabels[level - 1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gratitude */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '8px' }}>
              🙏 {t('what_are_you_grateful_for')}
            </p>
            <textarea
              value={gratitude}
              onChange={e => setGratitude(e.target.value)}
              placeholder={t('write_your_thoughts')}
              rows={3}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6',
                fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Personal Notes */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '8px' }}>
              📝 {t('personal_notes')}
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('write_your_thoughts')}
              rows={4}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6',
                fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Save Button */}
          <button
            className="btn btn-full"
            onClick={saveEntry}
            disabled={!gratitude && !notes && !promptResponse}
            style={{
              opacity: (gratitude || notes || promptResponse) ? 1 : 0.5,
              fontSize: '1rem', padding: '14px', borderRadius: '12px',
            }}
          >
            {t('save_entry')}
          </button>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div>
          {/* Search */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('search_journal')}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6',
                fontSize: '0.9rem', boxSizing: 'border-box',
              }}
            />
          </div>

          {filteredEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-gray)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>📓</span>
              <p>{t('no_entries_yet')}</p>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <div
                key={entry.id}
                className="card"
                style={{ padding: '14px 16px', marginBottom: '10px', cursor: 'pointer' }}
                onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expandedEntry === entry.id ? '12px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{MOOD_EMOJIS[entry.mood - 1]}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{entry.date}</p>
                      <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.75rem' }}>
                        {t('mood')}: {moodLabels[entry.mood - 1]} · {t('energy')}: {energyLabels[entry.energy - 1]}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{expandedEntry === entry.id ? '▲' : '▼'}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                      style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {expandedEntry === entry.id && (
                  <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '12px' }}>
                    {entry.promptResponse && (
                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '600', color: '#B8860B' }}>💡 {t('journal_prompt')}</p>
                        <p style={{ margin: '0 0 4px', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-gray)' }}>"{entry.prompt}"</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>{entry.promptResponse}</p>
                      </div>
                    )}
                    {entry.gratitude && (
                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '600', color: '#FB8C00' }}>🙏 {t('grateful_for')}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>{entry.gratitude}</p>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '600', color: '#1E88E5' }}>📝 {t('personal_notes')}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>{entry.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default JournalPage;
