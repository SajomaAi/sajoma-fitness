import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface DashboardPageProps {}

const DashboardPage: React.FC<DashboardPageProps> = () => {
  const { t } = useTranslation();
  // Mock data with goals
  const [userData] = useState({
    name: 'Sarah',
    goals: {
      calories: 2000,
      water: 64, // oz
      meals: 3
    },
    todayStats: {
      calories: 850,
      water: 24,
      meals: 2
    },
    recentMeals: [
      {
        id: 1,
        type: 'Breakfast',
        time: '8:30 AM',
        timestamp: new Date().setHours(8, 30, 0, 0),
        calories: 420,
        quality: 'good'
      },
      {
        id: 2,
        type: 'Lunch',
        time: '12:45 PM',
        timestamp: new Date().setHours(12, 45, 0, 0),
        calories: 430,
        quality: 'excellent'
      }
    ]
  });

  const [timeSinceLastMeal, setTimeSinceLastMeal] = useState('');

  // Calculate time since last meal
  useEffect(() => {
    const calculateTimeSinceLastMeal = () => {
      if (userData.recentMeals.length === 0) return;
      
      const lastMeal = userData.recentMeals[userData.recentMeals.length - 1];
      const now = new Date().getTime();
      const timeDiff = now - lastMeal.timestamp;
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeSinceLastMeal(`${hours}h ${minutes}m ago`);
      } else {
        setTimeSinceLastMeal(`${minutes}m ago`);
      }
    };

    calculateTimeSinceLastMeal();
    const interval = setInterval(calculateTimeSinceLastMeal, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [userData.recentMeals]);

  // Progress ring component
  const ProgressRing: React.FC<{
    value: number;
    goal: number;
    size: number;
    strokeWidth: number;
    color: string;
    label: string;
    unit?: string;
  }> = ({ value, goal, size, strokeWidth, label, unit = '' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min((value / goal) * 100, 100);
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    // Color coding based on percentage
    const getColor = (percent: number) => {
      if (percent >= 80) return '#4CAF50'; // Green
      if (percent >= 60) return '#8BC34A'; // Light green
      if (percent >= 40) return '#FFC107'; // Yellow
      if (percent >= 20) return '#FF9800'; // Orange
      return '#FF5722'; // Red
    };

    const ringColor = getColor(percentage);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e0e0e0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dasharray 0.5s ease-in-out'
              }}
            />
          </svg>
          {/* Center text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', lineHeight: '1.2' }}>
              {value}{unit} of {goal}{unit}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>
              {Math.round(percentage)}%
            </div>
          </div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          {label}
        </div>
      </div>
    );
  };

  const getQualityColor = (quality: string): string => {
    switch(quality) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'average': return '#FFC107';
      case 'poor': return '#FF5722';
      default: return '#8BC34A';
    }
  };

  const formatDate = (): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Wellness tips of the day (7 static tips for rotation)
  const wellnessTips = [
    "✅ Avoid eating past 8PM — fasting supports hormone reset.",
    "✅ Start your day with 16oz of water to kickstart metabolism and hydration.",
    "✅ Include protein in every meal to maintain stable blood sugar levels.",
    "✅ Take a 10-minute walk after meals to improve digestion and blood sugar.",
    "✅ Choose whole foods over processed — your body will thank you.",
    "✅ Practice deep breathing for 5 minutes daily to reduce stress hormones.",
    "✅ Aim for 7-9 hours of quality sleep for optimal hormone regulation."
  ];

  const getDailyWellnessTip = (): string => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    return wellnessTips[dayOfWeek];
  };

  return (
    <div className="container" style={{ padding: '20px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{t('hello_name', { name: userData.name })}</h1>
        <p style={{ color: 'var(--text-gray)' }}>{t('today_date', { date: formatDate() })}</p>
      </div>

      {/* Today's Progress Card with Progress Rings */}
      <div className="card" style={{ 
        backgroundColor: 'var(--primary-light)', 
        marginBottom: '24px',
        padding: '20px'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>{t('todays_progress')}</h2>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <ProgressRing
            value={userData.todayStats.calories}
            goal={userData.goals.calories}
            size={80}
            strokeWidth={6}
            color="#4CAF50"
            label={t("calories")}
          />
          <ProgressRing
            value={userData.todayStats.water}
            goal={userData.goals.water}
            size={80}
            strokeWidth={6}
            color="#2196F3"
            label={t("water")}
            unit=" oz"
          />
          <ProgressRing
            value={userData.todayStats.meals}
            goal={userData.goals.meals}
            size={80}
            strokeWidth={6}
            color="#FF9800"
            label={t("meals")}
          />
        </div>
      </div>

      {/* Recent Meals */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{t('recent_meals')}</h2>
      <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px', lineHeight: '1.4' }}>
        {t('meal_quality_legend')}
        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4CAF50', marginLeft: '10px', marginRight: '5px' }}></span> {t('low_carb_clean_meal')}
        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFC107', marginLeft: '10px', marginRight: '5px' }}></span> {t('moderate_meal')}
        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF5722', marginLeft: '10px', marginRight: '5px' }}></span> {t('flagged_meal')}
      </div>
      
      {userData.recentMeals.map(meal => (
        <div key={meal.id} className="card" style={{ 
          marginBottom: '16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: 'var(--gray-color)',
            borderRadius: '8px',
            marginRight: '16px'
          }}></div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 'bold', margin: '0' }}>{meal.type}</p>
            <p style={{ color: 'var(--text-gray)', margin: '0', fontSize: '0.9rem' }}>
              {meal.time} · {meal.calories} cal
            </p>
          </div>
          <div style={{ 
            width: '16px', 
            height: '16px', 
            borderRadius: '50%', 
            backgroundColor: getQualityColor(meal.quality)
          }}></div>
        </div>
      ))}

      {/* Time Since Last Meal */}
      <div className="card" style={{ 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0', fontSize: '1rem', color: '#495057' }}>{t('time_since_last_meal')}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#212529' }}>
              {timeSinceLastMeal}
            </p>
          </div>
          <div style={{ fontSize: '1.5rem' }}>🍽️</div>
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#6c757d' }}>
          {t('gentle_fasting_guidance_soon')}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <Link to="/meal-logger" className="btn" style={{ textAlign: "center" }}>
          {t("log_meal")}
        </Link>
        <Link to="/water-tracker" className="btn" style={{ textAlign: "center" }}>
          {t("add_water")}
        </Link>
      </div>

      {/* Mood and Energy Buttons */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <button 
          className="btn" 
          style={{ 
            backgroundColor: '#E8F5E8',
            color: '#2E7D32',
            border: '1px solid #4CAF50'
          }}
          onClick={() => alert(t("mood_logging_coming_soon"))}
        >
          {t("log_mood")}
        </button>
        <button 
          className="btn" 
          style={{ 
            backgroundColor: "#FFF3E0",
            color: "#E65100",
            border: "1px solid #FF9800"
          }}
          onClick={() => alert(t("energy_logging_coming_soon"))}
        >
          {t("log_energy")}
        </button>
      </div>

      {/* Quick Access Grid */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{t('quick_actions')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          { to: '/exercise', icon: '💪', label: t('exercise'), color: '#E53935' },
          { to: '/barcode-scanner', icon: '📱', label: t('barcode_scanner'), color: '#1E88E5' },
          { to: '/journal', icon: '📓', label: t('journal'), color: '#8E24AA' },
          { to: '/progress-photos', icon: '📸', label: t('progress_photos'), color: '#FB8C00' },
          { to: '/reminders', icon: '🔔', label: t('reminders'), color: '#43A047' },
          { to: '/subscription', icon: '⭐', label: t('premium'), color: '#FF9800' },
        ].map((item, i) => (
          <Link key={i} to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ padding: '14px 8px', textAlign: 'center', transition: 'transform 0.2s ease' }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '6px' }}>{item.icon}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#495057' }}>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Wellness Tip of the Day */}
      <div className="card" style={{ 
        marginBottom: '24px',
        padding: '20px',
        backgroundColor: '#E8F5E8',
        border: '1px solid #4CAF50'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>🌟</span>
          <h3 style={{ margin: "0", fontSize: "1.1rem", color: "#2E7D32" }}>{t("wellness_tip_of_the_day")}</h3>
        </div>
        <p style={{ margin: '0', fontSize: '0.95rem', color: '#1B5E20', lineHeight: '1.5', fontWeight: '500' }}>
          {getDailyWellnessTip()}
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
