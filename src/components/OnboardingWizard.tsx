import React, { useState } from 'react';

interface OnboardingWizardProps { onComplete: () => void; }

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const steps = [
    {
      icon: '🌟', title: 'Welcome to Sajoma Fitness', subtitle: 'Your personalized wellness journey starts here',
      type: 'welcome' as const,
    },
    {
      icon: '🎯', title: "What's your main goal?", subtitle: 'We\'ll customize your experience',
      type: 'select' as const, key: 'goal',
      options: [
        { icon: '🏋️', label: 'Lose Weight' },
        { icon: '💪', label: 'Build Muscle' },
        { icon: '🧘', label: 'Stay Healthy' },
        { icon: '🍎', label: 'Eat Better' },
        { icon: '😴', label: 'Improve Sleep' },
      ],
    },
    {
      icon: '📊', title: 'How active are you?', subtitle: 'This helps us set realistic goals',
      type: 'select' as const, key: 'activity',
      options: [
        { icon: '🛋️', label: 'Sedentary' },
        { icon: '🚶', label: 'Lightly Active' },
        { icon: '🏃', label: 'Moderately Active' },
        { icon: '⚡', label: 'Very Active' },
      ],
    },
    {
      icon: '🎉', title: "You're all set!", subtitle: 'Let\'s start your wellness journey',
      type: 'complete' as const,
    },
  ];

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF0F5', display: 'flex', flexDirection: 'column' }}>
      {/* Progress Bar */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(212,160,23,0.12)' }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #D4A017, #F0D060)', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: '0.68rem', color: '#8D6E63' }}>Step {step + 1} of {steps.length}</span>
          {step > 0 && <button onClick={() => setStep(step - 1)} style={{ fontSize: '0.72rem', color: '#D4A017', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>{current.icon}</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3E2723', textAlign: 'center', marginBottom: 8 }}>{current.title}</h1>
        <p style={{ fontSize: '0.88rem', color: '#8D6E63', textAlign: 'center', marginBottom: 32, maxWidth: 300 }}>{current.subtitle}</p>

        {current.type === 'select' && current.options && (
          <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.options.map(opt => (
              <button key={opt.label} onClick={() => setAnswers({ ...answers, [current.key!]: opt.label })} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                borderRadius: 16, border: answers[current.key!] === opt.label ? '2px solid #D4A017' : '1.5px solid rgba(212,160,23,0.1)',
                background: answers[current.key!] === opt.label ? 'rgba(212,160,23,0.08)' : 'white',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease',
                boxShadow: answers[current.key!] === opt.label ? '0 4px 16px rgba(212,160,23,0.12)' : '0 2px 8px rgba(62,39,35,0.04)',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#3E2723' }}>{opt.label}</span>
                {answers[current.key!] === opt.label && <span style={{ marginLeft: 'auto', color: '#D4A017', fontWeight: 700 }}>&#10003;</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div style={{ padding: '16px 24px 32px' }}>
        <button onClick={() => {
          if (step < steps.length - 1) setStep(step + 1);
          else onComplete();
        }} style={{
          width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #D4A017, #C5961B)', color: 'white',
          fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit',
          boxShadow: '0 4px 16px rgba(212,160,23,0.3)',
        }}>
          {current.type === 'complete' ? "Let's Go!" : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingWizard;
