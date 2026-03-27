import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import PageHeader from './PageHeader';

interface MeditationPageProps {
  onOpenMenu: () => void;
}

const MeditationPage: React.FC<MeditationPageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // Default 10 minutes
  const [selectedTime, setSelectedTime] = useState(600);
  const [isBreathing, setIsBreathing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const timeOptions = [
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '20 min', value: 1200 },
  ];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsBreathing(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsBreathing(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreathing(false);
    setTimeLeft(selectedTime);
  };

  const handleTimeSelect = (seconds: number) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
    setIsBreathing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page meditation-page animate-in">
      <PageHeader title={t('meditation') || 'Meditation'} onOpenMenu={onOpenMenu} />
      
      <div className="page-content" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '70vh', 
        textAlign: 'center',
        padding: '20px'
      }}>
        
        <div className="breathing-container" style={{ 
          marginBottom: '40px', 
          position: 'relative', 
          width: '250px', 
          height: '250px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div 
            className={`breathing-circle ${isBreathing ? 'breathing' : ''}`}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'var(--gold-gradient)',
              boxShadow: '0 0 30px rgba(212, 160, 23, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 700,
              zIndex: 2,
              transition: 'transform 4s ease-in-out',
              animation: isBreathing ? 'breathe 8s ease-in-out infinite' : 'none'
            }}
          >
            {formatTime(timeLeft)}
          </div>
          <div 
            className={`breathing-ring ${isBreathing ? 'breathing-outer' : ''}`}
            style={{
              position: 'absolute',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              border: '2px solid var(--gold-metallic)',
              opacity: 0.3,
              zIndex: 1,
              animation: isBreathing ? 'breatheOuter 8s ease-in-out infinite' : 'none'
            }}
          />
        </div>

        <h2 style={{ color: 'var(--text)', marginBottom: '8px', fontWeight: 800 }}>
          {isBreathing ? t('breathe_deeply') || 'Breathe Deeply' : t('ready_to_start') || 'Ready to start?'}
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '32px', maxWidth: '280px', fontSize: '0.95rem' }}>
          {isBreathing ? t('meditation_active_desc') || 'Focus on your breath and clear your mind.' : t('meditation_desc') || 'Find a quiet place and prepare for your session.'}
        </p>

        <div className="time-options" style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '40px',
          overflowX: 'auto',
          width: '100%',
          justifyContent: 'center',
          padding: '4px'
        }}>
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTimeSelect(option.value)}
              className={`time-btn ${selectedTime === option.value ? 'active' : ''}`}
              style={{
                padding: '10px 18px',
                borderRadius: '20px',
                border: '1.5px solid var(--gold-metallic)',
                background: selectedTime === option.value ? 'var(--gold-gradient)' : 'white',
                color: selectedTime === option.value ? 'white' : 'var(--gold-metallic)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: selectedTime === option.value ? 'var(--shadow-sm)' : 'none'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="controls" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button 
            onClick={toggleTimer}
            className="btn-gold"
            style={{ 
              width: '160px', 
              padding: '16px', 
              borderRadius: '30px', 
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            {isActive ? t('pause') || 'Pause' : t('start') || 'Start'}
          </button>
          <button 
            onClick={resetTimer}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-light)', 
              fontWeight: 700, 
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            {t('reset') || 'Reset'}
          </button>
        </div>

        <div className="meditation-sessions" style={{ marginTop: '60px', width: '100%', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '16px', paddingLeft: '4px', fontWeight: 800 }}>{t('guided_sessions') || 'Guided Sessions'}</h3>
          <div className="horizontal-scroll" style={{ 
            display: 'flex', 
            gap: '16px', 
            overflowX: 'auto', 
            padding: '4px 4px 20px', 
            scrollbarWidth: 'none' 
          }}>
            {[
              { title: t('morning_calm') || 'Morning Calm', duration: '5 min', type: t('relaxing') || 'Relaxing', icon: '🧘‍♀️' },
              { title: t('deep_sleep') || 'Deep Sleep', duration: '15 min', type: t('calming') || 'Calming', icon: '😴' },
              { title: t('focus_boost') || 'Focus Boost', duration: '10 min', type: t('energizing') || 'Energizing', icon: '⚡' },
            ].map((session, i) => (
              <div key={i} className="card" style={{ 
                minWidth: '200px', 
                padding: '20px', 
                background: 'white', 
                borderRadius: '24px', 
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(212, 160, 23, 0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{session.icon}</div>
                <h4 style={{ marginBottom: '4px', fontWeight: 700 }}>{session.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{session.duration} • {session.type}</p>
                <button 
                  className="play-btn" 
                  onClick={() => handleTimeSelect(parseInt(session.duration) * 60)}
                  style={{ 
                    marginTop: '12px', 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: 'var(--gold-gradient)', 
                    border: 'none', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  ▶
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        @keyframes breatheOuter {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.7); opacity: 0.1; }
        }
        .breathing-circle.breathing {
          animation: breathe 8s ease-in-out infinite;
        }
        .breathing-ring.breathing-outer {
          animation: breatheOuter 8s ease-in-out infinite;
        }
        .time-options::-webkit-scrollbar {
          display: none;
        }
        .horizontal-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MeditationPage;
