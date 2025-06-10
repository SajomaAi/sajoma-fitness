import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HealthTrackerPageProps {}

const HealthTrackerPage: React.FC<HealthTrackerPageProps> = () => {
  const [weight, setWeight] = useState('');
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  
  const moodLabels = ['Poor', 'Low', 'Okay', 'Good', 'Great'];
  const energyLabels = ['Low', 'Mild', 'Moderate', 'High', 'Excellent'];
  const moodEmojis = ['😞', '😐', '🙂', '😊', '😁'];
  const energyEmojis = ['🔋', '🔋', '🔋', '🔋', '🔋'];
  
  const handleSave = (): void => {
    setIsLoading(true);
    
    // Simulate saving data
    setTimeout(() => {
      setIsLoading(false);
      // Show success message or redirect
    }, 1000);
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      {/* Header */}
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center' }}>Health Tracker</h1>
      
      {/* Weight Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>Weight</h2>
        <div style={{ position: 'relative' }}>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in lbs"
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: '40px',
              borderRadius: '8px',
              border: '1px solid var(--gray-color)',
              fontSize: '1rem'
            }}
          />
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-gray)'
          }}>
            lbs
          </span>
        </div>
      </div>
      
      {/* Mood Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>Mood</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {moodLabels.map((label, index) => (
            <div 
              key={label}
              onClick={() => setMood(index + 1)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: mood === index + 1 ? 'var(--primary-color)' : 'var(--gray-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                fontSize: '24px'
              }}>
                {moodEmojis[index]}
              </div>
              <span style={{
                fontSize: '12px',
                color: mood === index + 1 ? 'var(--primary-color)' : 'var(--text-gray)',
                fontWeight: mood === index + 1 ? 'bold' : 'normal'
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Energy Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>Energy</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {energyLabels.map((label, index) => (
            <div 
              key={label}
              onClick={() => setEnergy(index + 1)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: energy === index + 1 ? 'var(--primary-color)' : 'var(--gray-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                fontSize: '24px'
              }}>
                {energyEmojis[index]}
              </div>
              <span style={{
                fontSize: '12px',
                color: energy === index + 1 ? 'var(--primary-color)' : 'var(--text-gray)',
                fontWeight: energy === index + 1 ? 'bold' : 'normal'
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Save Button */}
      <button
        className="btn btn-full"
        onClick={handleSave}
        disabled={isLoading}
        style={{
          marginBottom: '32px',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Saving...' : 'SAVE'}
      </button>
      
      {/* History Chart Placeholder */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>History</h2>
      <div style={{
        height: '200px',
        backgroundColor: 'var(--gray-color)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <p style={{ color: 'var(--text-gray)' }}>Health History Chart</p>
      </div>
      
      {/* Bottom Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        marginTop: '40px',
        padding: '16px 0',
        borderTop: '1px solid var(--gray-color)'
      }}>
        <Link to="/dashboard" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-gray)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🏠</span>
          <span style={{ fontSize: '0.8rem' }}>Home</span>
        </Link>
        <Link to="/meal-logger" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-gray)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📷</span>
          <span style={{ fontSize: '0.8rem' }}>Meals</span>
        </Link>
        <Link to="/water-tracker" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-gray)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>💧</span>
          <span style={{ fontSize: '0.8rem' }}>Water</span>
        </Link>
        <Link to="/health-tracker" style={{ 
          textDecoration: 'none', 
          color: 'var(--primary-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📊</span>
          <span style={{ fontSize: '0.8rem' }}>Health</span>
        </Link>
      </div>
    </div>
  );
};

export default HealthTrackerPage;
