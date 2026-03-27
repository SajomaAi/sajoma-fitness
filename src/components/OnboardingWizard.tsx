import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { t: _t } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const steps = [
    {
      icon: '✨', title: 'Welcome to Sajoma!', subtitle: "Let's personalize your wellness journey in just a few steps.",
      type: 'welcome' as const,
    },
    {
      icon: '🎯', title: "What's your main goal?", subtitle: "We'll customize your experience based on your target.",
      type: 'select' as const, key: 'goal',
      options: ['Lose Weight', 'Build Muscle', 'Stay Healthy', 'Eat Better', 'Improve Sleep'],
    },
    {
      icon: '📈', title: "What's your fitness level?", subtitle: "Be honest, we all start somewhere!",
      type: 'select' as const, key: 'level',
      options: ['Beginner', 'Intermediate', 'Advanced'],
    },
    {
      icon: '📊', title: "How active are you?", subtitle: "This helps us set realistic daily goals.",
      type: 'select' as const, key: 'activity',
      options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'],
    },
    {
      icon: '🔥', title: "Preferred workout type?", subtitle: "What gets you moving and motivated?",
      type: 'select' as const, key: 'workout_type',
      options: ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Mixed'],
    },
    {
      icon: '🥗', title: "Do you follow a specific diet?", subtitle: "We'll suggest relevant meals and recipes.",
      type: 'select' as const, key: 'diet',
      options: ['No specific diet', 'Keto', 'Vegan', 'Vegetarian', 'Mediterranean', 'Gluten-free'],
    },
    {
      icon: '⏰', title: "When do you prefer to work out?", subtitle: "When do you feel most energetic?",
      type: 'select' as const, key: 'workout_time',
      options: ['Morning', 'Afternoon', 'Evening', 'No preference'],
    },
    {
      icon: '🎉', title: "You're all set!", subtitle: "We've created a personalized plan just for you. Ready to start?",
      type: 'complete' as const,
    },
  ];

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      padding: '60px 24px 40px'
    }}>
      {/* Progress Bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, background: 'rgba(212,160,23,0.1)' }}>
        <div style={{ 
          width: `${progress}%`, height: '100%', 
          background: 'var(--gold-gradient)', transition: 'width 0.4s ease' 
        }} />
      </div>

      {/* Back Button */}
      {step > 0 && step < steps.length - 1 && (
        <button onClick={handleBack} style={{ 
          position: 'absolute', top: 24, left: 20, background: 'none', border: 'none', 
          fontSize: '1.5rem', color: 'var(--text)', cursor: 'pointer' 
        }}>←</button>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 24, animation: 'float 3s ease-in-out infinite' }}>{current.icon}</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold)', marginBottom: 12 }}>{current.title}</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 320, lineHeight: 1.6 }}>{current.subtitle}</p>

        {current.type === 'select' && (
          <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {current.options.map(opt => (
              <button key={opt} onClick={() => {
                setAnswers({ ...answers, [current.key!]: opt });
                setTimeout(handleNext, 300);
              }} style={{
                padding: '18px 24px', borderRadius: 20, border: answers[current.key!] === opt ? '2.5px solid var(--gold)' : '1.5px solid rgba(212,160,23,0.1)',
                background: answers[current.key!] === opt ? 'rgba(212,160,23,0.08)' : 'white',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                boxShadow: answers[current.key!] === opt ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
                textAlign: 'left', fontWeight: 700, color: 'var(--text)'
              }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {(current.type === 'welcome' || current.type === 'complete') && (
          <button className="btn btn-gold btn-full btn-lg" onClick={handleNext} style={{ maxWidth: 360 }}>
            {current.type === 'welcome' ? 'Get Started' : "Let's Go!"}
          </button>
        )}
      </div>

      {/* Manual Continue Button for select steps if not auto-advancing */}
      {current.type === 'select' && !answers[current.key!] && (
        <div style={{ marginTop: 20, width: '100%', maxWidth: 360, alignSelf: 'center' }}>
          <button className="btn btn-gold btn-full btn-lg" onClick={handleNext} disabled={!answers[current.key!]}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingWizard;
