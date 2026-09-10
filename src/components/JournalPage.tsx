interface PageProps {
  onOpenMenu: () => void;
}
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

interface JournalEntry {
  id: string;
  entry_date: string;
  mood: number | null;
  energy: number | null;
  gratitude: string | null;
  notes: string | null;
  prompt: string | null;
  created_at: string;
}

const JournalPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'write' | 'history'>('write');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [gratitude, setGratitude] = useState('');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const moods = [
    { val: 1, emoji: '😢', label: t('mood_rough') || 'Rough', color: '#E57373' },
    { val: 2, emoji: '😕', label: t('mood_low') || 'Low', color: '#FFB74D' },
    { val: 3, emoji: '😊', label: t('mood_good') || 'Good', color: '#FFD54F' },
    { val: 4, emoji: '😄', label: t('mood_great') || 'Great', color: '#81C784' },
    { val: 5, emoji: '🤩', label: t('mood_amazing') || 'Amazing', color: '#D4AF37' },
  ];

  const energyLevels = [
    { val: 1, emoji: '🔋', label: t('energy_drained') || 'Drained' },
    { val: 2, emoji: '🔋', label: t('energy_low') || 'Low' },
    { val: 3, emoji: '🔋', label: t('energy_moderate') || 'Moderate' },
    { val: 4, emoji: '⚡', label: t('energy_high') || 'High' },
    { val: 5, emoji: '⚡', label: t('energy_energized') || 'Energized' },
  ];

  const prompts = [
    t('prompt_gratitude') || "What are you most grateful for today?",
    t('prompt_smile') || "What made you smile today?",
    t('prompt_health') || "What's one thing you did for your health today?",
    t('prompt_peace') || "Describe a moment of peace you experienced.",
    t('prompt_win') || "What's a small win you had today?",
    t('prompt_kindness') || "How did you show kindness to yourself?",
    t('prompt_tomorrow') || "What would make tomorrow even better?",
  ];
  const todayPrompt = prompts[new Date().getDay()];

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('journal_entries')
        .select('id, entry_date, mood, energy, gratitude, notes, prompt, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      setEntries((data as JournalEntry[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!notes && !gratitude) return;
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setSaving(false); showToast('Not signed in'); return; }
    const payload = {
      user_id: userData.user.id,
      entry_date: new Date().toISOString().slice(0, 10),
      mood, energy, gratitude: gratitude || null, notes: notes || null, prompt: todayPrompt,
    };
    const { data, error } = await supabase.from('journal_entries').insert(payload).select().single();
    setSaving(false);
    if (error) { showToast(error.message); return; }
    setEntries([data as JournalEntry, ...entries]);
    setGratitude(''); setNotes(''); setMood(3); setEnergy(3);
    showToast(t('entry_saved') || 'Journal entry saved!');
    setTab('history');
  };

  const filteredEntries = searchQuery
    ? entries.filter(e =>
        (e.notes ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.gratitude ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  return (
    <div className="page animate-in">
      <PageHeader title={t('journal') || 'Journal'} onOpenMenu={onOpenMenu} />

      <div className="tabs">
        <button className={`tab ${tab === 'write' ? 'active' : ''}`} onClick={() => setTab('write')}>✏️ {t('write') || 'Write'}</button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>📖 {t('history') || 'History'}</button>
      </div>

      {tab === 'write' && (
        <>
          <div className="card card-gold" style={{ padding: 18, marginBottom: 20, textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', opacity: 0.8, marginBottom: 6 }}>{t('todays_prompt') || "Today's Prompt"}</p>
            <p style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.4 }}>"{todayPrompt}"</p>
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 className="section-title" style={{ marginBottom: 14 }}>{t('how_feeling') || 'How are you feeling?'}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
              {moods.map(m => (
                <button key={m.val} onClick={() => setMood(m.val)} style={{
                  flex: 1, padding: '12px 4px', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: mood === m.val ? m.color + '22' : 'transparent',
                  boxShadow: mood === m.val ? `0 0 0 2px ${m.color}` : 'none',
                  transition: 'all 0.2s ease', fontFamily: 'inherit',
                }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{m.emoji}</div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 600, color: mood === m.val ? m.color : '#6C757D' }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 className="section-title" style={{ marginBottom: 14 }}>{t('energy_level') || 'Energy Level'}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
              {energyLevels.map(e => (
                <button key={e.val} onClick={() => setEnergy(e.val)} style={{
                  flex: 1, padding: '10px 4px', borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: energy === e.val ? 'rgba(212,175,55,0.1)' : 'transparent',
                  boxShadow: energy === e.val ? '0 0 0 2px #D4AF37' : 'none',
                  transition: 'all 0.2s ease', fontFamily: 'inherit',
                }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>{e.emoji}</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 600, color: energy === e.val ? '#D4AF37' : '#6C757D' }}>{e.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 className="section-title" style={{ marginBottom: 10 }}>🙏 {t('gratitude') || 'Gratitude'}</h3>
            <textarea className="input" rows={3} placeholder={t('gratitude_placeholder') || "What are you grateful for today?"} value={gratitude} onChange={e => setGratitude(e.target.value)} style={{ resize: 'none' }} />
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <h3 className="section-title" style={{ marginBottom: 10 }}>📝 {t('journal_entry') || 'Journal Entry'}</h3>
            <textarea className="input" rows={5} placeholder={t('write_something') || "Write freely about your day..."} value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'none' }} />
          </div>

          <button className="btn btn-gold btn-full btn-lg" onClick={handleSave} disabled={saving || (!notes && !gratitude)}>
            {saving ? '…' : (t('save_entry') || 'Save Entry')}
          </button>
        </>
      )}

      {tab === 'history' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <input className="input" placeholder={t('search_entries') || "🔍 Search entries..."} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          {loading ? (
            <div className="card" style={{ padding: 32, textAlign: 'center', color: '#6C757D', fontSize: '0.85rem' }}>Loading…</div>
          ) : filteredEntries.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>📓</p>
              <p style={{ color: '#6C757D' }}>{t('no_entries') || 'No journal entries yet'}</p>
            </div>
          ) : filteredEntries.map(entry => (
            <div key={entry.id} className="card" style={{ padding: 18, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.78rem', color: '#6C757D', fontWeight: 600 }}>
                  {new Date(entry.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: '1.1rem' }}>{moods.find(m => m.val === entry.mood)?.emoji}</span>
                  <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700 }}>⚡{entry.energy ?? '—'}/5</span>
                </div>
              </div>
              {entry.gratitude && (
                <div style={{ background: 'rgba(212,175,55,0.06)', borderRadius: 12, padding: '10px 14px', marginBottom: 8 }}>
                  <p style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 600, marginBottom: 2 }}>{t('gratitude') || 'Gratitude'}</p>
                  <p style={{ fontSize: '0.82rem', color: '#212529', margin: 0, lineHeight: 1.4 }}>{entry.gratitude}</p>
                </div>
              )}
              {entry.notes && <p style={{ fontSize: '0.85rem', color: '#495057', lineHeight: 1.5, margin: 0 }}>{entry.notes}</p>}
            </div>
          ))}
        </>
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

export default JournalPage;
