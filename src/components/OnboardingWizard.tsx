import React, { useState } from 'react';

interface OnboardingWizardProps {
  onComplete: (preferences: any) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState({
    goals: {
      primaryGoal: '',
      targetWeight: '',
      activityLevel: ''
    },
    dietary: {
      restrictions: [] as string[],
      preferences: [] as string[],
      allergies: [] as string[]
    },
    notifications: {
      mealReminders: true,
      waterReminders: true,
      exerciseReminders: false,
      tipOfTheDay: true
    }
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePreferences = (section: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const toggleArrayItem = (section: string, key: string, item: string) => {
    setPreferences(prev => {
      const sectionData = prev[section as keyof typeof prev] as any;
      const currentArray = sectionData[key] as string[];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [key]: newArray
        }
      };
    });
  };

  const renderStep1 = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎯</div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#B8860B' }}>
        What's Your Primary Goal?
      </h2>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '1rem' }}>
        Help us personalize your Sajoma Fitness experience
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
        {[
          { value: 'weight_loss', label: '🏃‍♀️ Lose Weight', desc: 'Track calories and maintain a healthy deficit' },
          { value: 'weight_gain', label: '💪 Gain Weight', desc: 'Build muscle and increase healthy calories' },
          { value: 'maintain', label: '⚖️ Maintain Weight', desc: 'Stay healthy and maintain current weight' },
          { value: 'health', label: '❤️ Improve Health', desc: 'Focus on nutrition and wellness habits' }
        ].map(goal => (
          <button
            key={goal.value}
            onClick={() => updatePreferences('goals', 'primaryGoal', goal.value)}
            style={{
              padding: '16px',
              border: preferences.goals.primaryGoal === goal.value ? '2px solid #D4A017' : '1px solid #ddd',
              borderRadius: '12px',
              backgroundColor: preferences.goals.primaryGoal === goal.value ? '#FFF5F8' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px' }}>
              {goal.label}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {goal.desc}
            </div>
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '32px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Activity Level
        </label>
        <select
          value={preferences.goals.activityLevel}
          onChange={(e) => updatePreferences('goals', 'activityLevel', e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem'
          }}
        >
          <option value="">Select your activity level</option>
          <option value="sedentary">Sedentary (little to no exercise)</option>
          <option value="light">Light (1-3 days/week)</option>
          <option value="moderate">Moderate (3-5 days/week)</option>
          <option value="active">Active (6-7 days/week)</option>
          <option value="very_active">Very Active (2x/day or intense exercise)</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🥗</div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#B8860B' }}>
        Dietary Preferences
      </h2>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '1rem' }}>
        Tell us about your dietary needs and preferences
      </p>
      
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
        {/* Dietary Restrictions */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', textAlign: 'center' }}>
            Dietary Restrictions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Low-Fat'].map(restriction => (
              <button
                key={restriction}
                onClick={() => toggleArrayItem('dietary', 'restrictions', restriction)}
                style={{
                  padding: '12px',
                  border: preferences.dietary.restrictions.includes(restriction) ? '2px solid #D4A017' : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: preferences.dietary.restrictions.includes(restriction) ? '#FFF5F8' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {restriction}
              </button>
            ))}
          </div>
        </div>

        {/* Food Allergies */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', textAlign: 'center' }}>
            Food Allergies
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
            {['Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish', 'Sesame', 'Milk', 'Wheat'].map(allergy => (
              <button
                key={allergy}
                onClick={() => toggleArrayItem('dietary', 'allergies', allergy)}
                style={{
                  padding: '12px',
                  border: preferences.dietary.allergies.includes(allergy) ? '2px solid #FF5722' : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: preferences.dietary.allergies.includes(allergy) ? '#FFEBEE' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        {/* Food Preferences */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', textAlign: 'center' }}>
            Food Preferences
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {['Organic', 'Local', 'Whole Foods', 'Lean Proteins', 'High Fiber', 'Low Sodium', 'Superfoods', 'Mediterranean'].map(preference => (
              <button
                key={preference}
                onClick={() => toggleArrayItem('dietary', 'preferences', preference)}
                style={{
                  padding: '12px',
                  border: preferences.dietary.preferences.includes(preference) ? '2px solid #2196F3' : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: preferences.dietary.preferences.includes(preference) ? '#E3F2FD' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {preference}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🔔</div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#B8860B' }}>
        Notification Preferences
      </h2>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '1rem' }}>
        Choose how you'd like Sajoma Fitness to keep you on track
      </p>
      
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
        {[
          { key: 'mealReminders', label: '🍽️ Meal Reminders', desc: 'Get notified when it\'s time to log meals' },
          { key: 'waterReminders', label: '💧 Water Reminders', desc: 'Stay hydrated with gentle reminders' },
          { key: 'exerciseReminders', label: '🏃‍♀️ Exercise Reminders', desc: 'Motivation to stay active' },
          { key: 'tipOfTheDay', label: '💡 Daily Health Tips', desc: 'Learn something new every day' }
        ].map(notification => (
          <div
            key={notification.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '12px',
              backgroundColor: 'white'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px' }}>
                {notification.label}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {notification.desc}
              </div>
            </div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
              <input
                type="checkbox"
                checked={preferences.notifications[notification.key as keyof typeof preferences.notifications]}
                onChange={(e) => updatePreferences('notifications', notification.key, e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: preferences.notifications[notification.key as keyof typeof preferences.notifications] ? '#D4A017' : '#ccc',
                borderRadius: '34px',
                transition: '0.4s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '26px',
                  width: '26px',
                  left: '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.4s',
                  transform: preferences.notifications[notification.key as keyof typeof preferences.notifications] ? 'translateX(26px)' : 'translateX(0)'
                }}></span>
              </span>
            </label>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '32px', 
        padding: '20px', 
        backgroundColor: '#FFF5F8', 
        borderRadius: '12px',
        border: '1px solid #D4A017'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#B8860B' }}>
          🎉 You're All Set!
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#424242', margin: 0 }}>
          Your preferences have been saved. You can always change these settings later in your profile.
        </p>
      </div>
    </div>
  );

  const handleClose = () => {
    // Allow users to skip onboarding by clicking outside or pressing escape
    onComplete({});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#B8860B' }}>
              Welcome to Sajoma Fitness
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                Step {currentStep} of 3
              </span>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px',
                  borderRadius: '4px'
                }}
                title="Skip onboarding"
                aria-label="Close onboarding wizard"
              >
                ×
              </button>
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(currentStep / 3) * 100}%`,
              height: '100%',
              backgroundColor: '#D4A017',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: '32px' }}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              padding: '12px 24px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: currentStep === 1 ? '#ccc' : '#666',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !preferences.goals.primaryGoal) ||
              (currentStep === 1 && !preferences.goals.activityLevel)
            }
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#D4A017',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              opacity: (currentStep === 1 && (!preferences.goals.primaryGoal || !preferences.goals.activityLevel)) ? 0.5 : 1
            }}
          >
            {currentStep === 3 ? 'Complete Setup' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;

