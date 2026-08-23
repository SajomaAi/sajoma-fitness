import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const GOAL_MAP: Record<string, string> = {
  'Lose Weight': 'lose_weight',
  'Build Muscle': 'build_muscle',
  'Stay Healthy': 'maintain',
  'Eat Better': 'eat_healthier',
  'Improve Sleep': 'improve_sleep',
};
const LEVEL_MAP: Record<string, string> = {
  'Beginner': 'beginner',
  'Intermediate': 'intermediate',
  'Advanced': 'advanced',
};
const ACTIVITY_MAP: Record<string, string> = {
  'Sedentary': 'sedentary',
  'Lightly Active': 'light',
  'Moderately Active': 'moderate',
  'Very Active': 'very_active',
};
const DIET_MAP: Record<string, string> = {
  'No specific diet': 'none',
  'Keto': 'keto',
  'Vegan': 'vegan',
  'Vegetarian': 'vegetarian',
  'Mediterranean': 'mediterranean',
  'Gluten-free': 'gluten_free',
};
const SEX_MAP: Record<string, string> = {
  'Female': 'female',
  'Male': 'male',
  'Other': 'other',
  'Prefer not to say': 'prefer_not_to_say',
};

// Mifflin-St Jeor Basal Metabolic Rate × activity multiplier → daily calorie goal.
const ACTIVITY_MULT: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};
function calcCalorieGoal(sex: string | null, weightKg: number | null, heightCm: number | null, birthYear: number | null, activity: string | null): number | null {
  if (!weightKg || !heightCm || !birthYear) return null;
  const age = new Date().getFullYear() - birthYear;
  if (age < 10 || age > 100) return null;
  const bmr = sex === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const mult = activity && ACTIVITY_MULT[activity] ? ACTIVITY_MULT[activity] : 1.375;
  return Math.round(bmr * mult);
}

type StepDef =
  | { type: 'welcome'; icon: string; title: string; subtitle: string }
  | { type: 'complete'; icon: string; title: string; subtitle: string }
  | { type: 'select'; icon: string; title: string; subtitle: string; key: string; options: string[] }
  | { type: 'number'; icon: string; title: string; subtitle: string; key: string; placeholder: string; min: number; max: number; unit: string };

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { t: _t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const steps: StepDef[] = [
    { type: 'welcome', icon: '✨', title: 'Welcome to Sajoma!', subtitle: "Let's personalize your wellness journey in just a few steps." },
    { type: 'select', icon: '🎯', title: "What's your main goal?", subtitle: "We'll customize your experience based on your target.",
      key: 'goal', options: ['Lose Weight', 'Build Muscle', 'Stay Healthy', 'Eat Better', 'Improve Sleep'] },
    { type: 'select', icon: '📈', title: "What's your fitness level?", subtitle: "Be honest, we all start somewhere!",
      key: 'level', options: ['Beginner', 'Intermediate', 'Advanced'] },
    { type: 'select', icon: '📊', title: "How active are you?", subtitle: "This helps us set realistic daily goals.",
      key: 'activity', options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
    { type: 'select', icon: '👤', title: "Which best describes you?", subtitle: "Used to estimate your daily calorie needs.",
      key: 'sex', options: ['Female', 'Male', 'Other', 'Prefer not to say'] },
    { type: 'number', icon: '📅', title: "What year were you born?", subtitle: "Just the year — we don't need your birthday.",
      key: 'birth_year', placeholder: '1990', min: 1920, max: new Date().getFullYear() - 10, unit: '' },
    { type: 'number', icon: '📏', title: "How tall are you?", subtitle: "In centimeters.",
      key: 'height_cm', placeholder: '170', min: 100, max: 250, unit: 'cm' },
    { type: 'number', icon: '⚖️', title: "Your current weight?", subtitle: "In kilograms. Only used to personalize goals.",
      key: 'weight_kg', placeholder: '68', min: 30, max: 300, unit: 'kg' },
    { type: 'select', icon: '🔥', title: "Preferred workout type?", subtitle: "What gets you moving and motivated?",
      key: 'workout_type', options: ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Mixed'] },
    { type: 'select', icon: '🥗', title: "Do you follow a specific diet?", subtitle: "We'll suggest relevant meals and recipes.",
      key: 'diet', options: ['No specific diet', 'Keto', 'Vegan', 'Vegetarian', 'Mediterranean', 'Gluten-free'] },
    { type: 'select', icon: '⏰', title: "When do you prefer to work out?", subtitle: "When do you feel most energetic?",
      key: 'workout_time', options: ['Morning', 'Afternoon', 'Evening', 'No preference'] },
    { type: 'complete', icon: '🎉', title: "You're all set!", subtitle: "We've created a personalized plan just for you. Ready to start?" },
  ];

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const persistAnswers = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const sex = answers.sex ? SEX_MAP[answers.sex] ?? null : null;
      const weightKg = answers.weight_kg ? Number(answers.weight_kg) : null;
      const heightCm = answers.height_cm ? Number(answers.height_cm) : null;
      const birthYear = answers.birth_year ? Number(answers.birth_year) : null;
      const activity = answers.activity ? ACTIVITY_MAP[answers.activity] ?? null : null;
      const calorieGoal = calcCalorieGoal(sex, weightKg, heightCm, birthYear, activity);

      await supabase.from('profiles').update({
        goal: answers.goal ? GOAL_MAP[answers.goal] ?? null : null,
        fitness_level: answers.level ? LEVEL_MAP[answers.level] ?? null : null,
        activity_level: activity,
        diet_preference: answers.diet ? DIET_MAP[answers.diet] ?? null : null,
        sex,
        weight_kg: weightKg,
        height_cm: heightCm,
        birth_year: birthYear,
        daily_calorie_goal: calorieGoal,
        // workout_type / workout_time have no dedicated column; stashed in avatar_url-adjacent free text isn't a fit.
        // Keep as first-class fields if schema evolves; for now they inform the calorie/goal computation only.
      }).eq('id', user.id);
      await refreshProfile();
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      await persistAnswers();
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentValue = current.type === 'select' || current.type === 'number' ? answers[current.key] : undefined;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      padding: '60px 24px 40px'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, background: 'rgba(212,175,55,0.1)' }}>
        <div style={{
          width: `${progress}%`, height: '100%',
          background: 'var(--gold-gradient)', transition: 'width 0.4s ease'
        }} />
      </div>

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
                setAnswers({ ...answers, [current.key]: opt });
                setTimeout(handleNext, 300);
              }} style={{
                padding: '18px 24px', borderRadius: 20,
                border: currentValue === opt ? '2.5px solid var(--gold)' : '1.5px solid rgba(212,175,55,0.1)',
                background: currentValue === opt ? 'rgba(212,175,55,0.08)' : 'white',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                boxShadow: currentValue === opt ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
                textAlign: 'left', fontWeight: 700, color: 'var(--text)'
              }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {current.type === 'number' && (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 20, padding: '4px 20px', border: '1.5px solid rgba(212,175,55,0.15)', boxShadow: 'var(--shadow-sm)' }}>
              <input
                type="number"
                inputMode="numeric"
                min={current.min}
                max={current.max}
                placeholder={current.placeholder}
                value={currentValue ?? ''}
                onChange={e => setAnswers({ ...answers, [current.key]: e.target.value })}
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: '1.4rem', fontWeight: 700,
                  padding: '16px 0', background: 'transparent', color: 'var(--text)', fontFamily: 'inherit',
                }}
              />
              {current.unit && <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>{current.unit}</span>}
            </div>
          </div>
        )}

        {(current.type === 'welcome' || current.type === 'complete') && (
          <button className="btn btn-gold btn-full btn-lg" onClick={handleNext} disabled={saving} style={{ maxWidth: 360 }}>
            {saving ? '...' : current.type === 'welcome' ? 'Get Started' : "Let's Go!"}
          </button>
        )}
      </div>

      {(current.type === 'number' || (current.type === 'select' && !currentValue)) && (
        <div style={{ marginTop: 20, width: '100%', maxWidth: 360, alignSelf: 'center' }}>
          <button className="btn btn-gold btn-full btn-lg" onClick={handleNext} disabled={current.type === 'select' ? !currentValue : !currentValue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingWizard;
