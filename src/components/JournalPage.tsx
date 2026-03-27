import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface JournalEntry { id: number; date: string; mood: number; energy: number; gratitude: string; notes: string; prompt: string; }

const JournalPage: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'write'|'history'>('write');
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const s = localStorage.getItem('sajoma-journal');
    return s ? JSON.parse(s) : [];
  });
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [gratitude, setGratitude] = useState('');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');

  const moods = ['😢','😟','😐','😊','🤩'];
   // const energyLevels = ['🔋','🔋','🔋','🔋','⚡'];
  const prompts = [
    "What made you smile today?", "What healthy choice are you proud of?",
    "How did your body feel during exercise?", "What are you grateful for today?",
    "What is one thing you can improve tomorrow?", "How did you nourish your body today?",
    "What positive affirmation resonates with you?",
  ];
  const todayPrompt = prompts[new Date().getDay()];

  const handleSave = () => {
    const entry: JournalEntry = {
      id: Date.now(), date: new Date().toISOString(),
      mood, energy, gratitude, notes, prompt: todayPrompt,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('sajoma-journal', JSON.stringify(updated));
    setGratitude(''); setNotes(''); setMood(3); setEnergy(3);
    setTab('history');
  };

  const filtered = entries.filter(e =>
    !search || e.notes.toLowerCase().includes(search.toLowerCase()) || e.gratitude.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>📓 {t('journal') || 'Journal'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 16 }}>{t('journal_subtitle') || 'Daily wellness reflections'}</p>

      <div className="sf-tabs">
        <button className={`sf-tab ${tab === 'write' ? 'active' : ''}`} onClick={() => setTab('write')}>{t('write') || 'Write'}</button>
        <button className={`sf-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>{t('history') || 'History'}</button>
      </div>

      {tab === 'write' && (
        <div>
          {/* Prompt Card */}
          <div className="sf-card sf-card-pink" style={{ padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: '0.78rem', color: '#C5961B', fontWeight: 600, marginBottom: 4 }}>✨ {t('todays_prompt') || "Today's Prompt"}</p>
            <p style={{ fontSize: '0.92rem', color: '#3E2723', fontWeight: 500, fontStyle: 'italic', margin: 0 }}>{todayPrompt}</p>
          </div>

          <div className="sf-card" style={{ padding: 18, marginBottom: 16 }}>
            {/* Mood */}
            <label className="sf-label">{t('mood') || 'Mood'}</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {moods.map((m, i) => (
                <button key={i} onClick={() => setMood(i + 1)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: mood === i + 1 ? 'linear-gradient(135deg, #D4A017, #C5961B)' : '#FFF0F5',
                  fontSize: '1.3rem', transition: 'all 0.2s', transform: mood === i + 1 ? 'scale(1.1)' : 'scale(1)',
                }}>{m}</button>
              ))}
            </div>

            {/* Energy */}
            <label className="sf-label">{t('energy_level') || 'Energy Level'}</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setEnergy(i)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: energy >= i ? 'linear-gradient(135deg, #F8B4C8, #D4A017)' : '#FFF0F5',
                  fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit',
                  color: energy >= i ? 'white' : '#BCAAA4',
                }}>{i}</button>
              ))}
            </div>

            {/* Gratitude */}
            <label className="sf-label">{t('gratitude') || 'Gratitude'}</label>
            <textarea className="sf-input" rows={2} placeholder={t('gratitude_placeholder') || 'What are you grateful for today?'}
              value={gratitude} onChange={e => setGratitude(e.target.value)} style={{ marginBottom: 14, resize: 'none' }} />

            {/* Notes */}
            <label className="sf-label">{t('journal_notes') || 'Notes'}</label>
            <textarea className="sf-input" rows={4} placeholder={t('journal_notes_placeholder') || 'How are you feeling? What happened today?'}
              value={notes} onChange={e => setNotes(e.target.value)} style={{ marginBottom: 14, resize: 'none' }} />

            <button className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg" onClick={handleSave}>
              {t('save_entry') || 'Save Entry'}
            </button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          <input className="sf-input" placeholder={t('search_journal') || 'Search entries...'} value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14 }} />
          {filtered.length === 0 ? (
            <div className="sf-card" style={{ padding: 32, textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>📓</p>
              <p style={{ color: '#8D6E63' }}>{t('no_entries') || 'No journal entries yet'}</p>
            </div>
          ) : filtered.map(e => (
            <div key={e.id} className="sf-card" style={{ padding: 16, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.78rem', color: '#8D6E63' }}>{new Date(e.date).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ fontSize: '1.1rem' }}>{moods[e.mood - 1]}</span>
                  <span className="sf-badge sf-badge-gold">⚡{e.energy}/5</span>
                </div>
              </div>
              {e.gratitude && <p style={{ fontSize: '0.85rem', color: '#C5961B', margin: '0 0 6px', fontStyle: 'italic' }}>🙏 {e.gratitude}</p>}
              {e.notes && <p style={{ fontSize: '0.85rem', color: '#5D4037', margin: 0, lineHeight: 1.5 }}>{e.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default JournalPage;
