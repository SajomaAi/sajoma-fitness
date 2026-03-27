import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface OnboardingWizardProps { onComplete: () => void; }

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { t } = useTranslation();
   // const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else onComplete();
  };

  const steps = [
    {
      title: t('welcome_title') || 'Welcome to Sajoma Fitness',
      desc: t('welcome_desc') || 'Your personalized journey to a healthier, more vibrant you starts here.',
      icon: '✨',
    },
    {
      title: t('track_everything') || 'Track Everything',
      desc: t('track_desc') || 'From meals and water to workouts and mood. Get a complete picture of your health.',
      icon: '📊',
    },
    {
      title: t('ai_powered') || 'AI-Powered Insights',
      desc: t('ai_desc') || 'Snap a photo of your meal and let our AI analyze the nutrition for you instantly.',
      icon: '🧠',
    },
    {
      title: t('ready_to_start') || 'Ready to Start?',
      desc: t('ready_desc') || 'Join thousands of others on their wellness journey. Let\'s achieve your goals together.',
      icon: '🚀',
    },
  ];

  const current = steps[step - 1];

  return (
    <div className="page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 40, background: 'white' }}>
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 32, animation: 'float 3s ease-in-out infinite' }}>{current.icon}</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3E2723', marginBottom: 16 }}>{current.title}</h1>
        <p style={{ fontSize: '1rem', color: '#8D6E63', lineHeight: 1.6, marginBottom: 40 }}>{current.desc}</p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
          {Array(totalSteps).fill(0).map((_, i) => (
            <div key={i} style={{
              width: i + 1 === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i + 1 === step ? '#D4A017' : '#FFF0F5',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
        <button className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg" onClick={next}>
          {step === totalSteps ? (t('get_started') || 'Get Started') : (t('next') || 'Next')}
        </button>
      </div>
      <style>{`@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`}</style>
    </div>
  );
};

export default OnboardingWizard;
