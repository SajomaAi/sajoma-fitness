import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface WaterLog {
  id: number;
  amount: number;
  time: string;
}

interface WaterTrackerPageProps {}

const WaterTrackerPage: React.FC<WaterTrackerPageProps> = () => {
  // Mock data
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([
    { id: 1, amount: 8, time: '9:00 AM' },
    { id: 2, amount: 8, time: '11:15 AM' },
    { id: 3, amount: 8, time: '1:30 PM' },
    { id: 4, amount: 8, time: '3:45 PM' }
  ]);
  
  const [dailyGoal] = useState(64); // in oz
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const getTotalWater = (): number => {
    return waterLogs.reduce((total, log) => total + log.amount, 0);
  };
  
  const getProgressPercentage = (): number => {
    const percentage = (getTotalWater() / dailyGoal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };
  
  const addWater = (): void => {
    setIsAdding(true);
    
    setTimeout(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit'
      });
      
      const newLog: WaterLog = {
        id: Date.now(),
        amount: 8, // 8 oz per tap
        time: timeString
      };
      
      setWaterLogs([...waterLogs, newLog]);
      setIsAdding(false);
      setShowSuccess(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
    }, 500);
  };

  const removeLastWater = (): void => {
    if (waterLogs.length > 0) {
      setWaterLogs(waterLogs.slice(0, -1));
    }
  };

  const getMotivationalMessage = (): string => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return "🎉 Goal achieved! Great job staying hydrated!";
    if (percentage >= 75) return "💪 Almost there! Keep it up!";
    if (percentage >= 50) return "👍 You're halfway to your goal!";
    if (percentage >= 25) return "🌱 Good start! Keep drinking water!";
    return "💧 Start your hydration journey!";
  };

  const getCupsVisualization = () => {
    const totalCups = Math.ceil(dailyGoal / 8); // 8 cups for 64 oz
    const filledCups = Math.floor(getTotalWater() / 8);
    
    return Array.from({ length: totalCups }, (_, index) => (
      <div
        key={index}
        style={{
          width: '30px',
          height: '30px',
          margin: '2px',
          borderRadius: '4px',
          backgroundColor: index < filledCups ? '#6b8e23' : '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          transition: 'all 0.3s ease'
        }}
      >
        💧
      </div>
    ));
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      {/* Header */}
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center', color: '#333' }}>
        Water Intake Tracker
      </h1>
      
      {/* Success Message */}
      {showSuccess && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          textAlign: 'center',
          border: '1px solid #c3e6cb',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          ✅ Added 8 oz of water!
        </div>
      )}
      
      {/* Progress Section */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#6b8e23'
        }}>
          {getTotalWater()} oz
        </p>
        <p style={{ 
          fontSize: '1rem', 
          color: '#666',
          marginBottom: '16px'
        }}>
          of {dailyGoal} oz daily goal
        </p>
        
        {/* Progress Bar */}
        <div style={{ 
          height: '24px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '12px', 
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{ 
            height: '100%', 
            width: `${getProgressPercentage()}%`, 
            backgroundColor: '#6b8e23', 
            borderRadius: '12px',
            transition: 'width 0.5s ease-in-out'
          }}></div>
        </div>
        
        {/* Progress Percentage */}
        <p style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold',
          color: '#6b8e23'
        }}>
          {Math.round(getProgressPercentage())}% Complete
        </p>
        
        {/* Motivational Message */}
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#666',
          marginTop: '8px',
          fontStyle: 'italic'
        }}>
          {getMotivationalMessage()}
        </p>
      </div>
      
      {/* Cups Visualization */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', textAlign: 'center' }}>
          Daily Progress
        </h3>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: '4px'
        }}>
          {getCupsVisualization()}
        </div>
      </div>
      
      {/* Add Water Button */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <button 
          onClick={addWater}
          disabled={isAdding}
          style={{ 
            width: '140px', 
            height: '140px', 
            borderRadius: '50%', 
            backgroundColor: isAdding ? '#9ca3af' : '#6b8e23', 
            border: 'none', 
            color: 'white', 
            cursor: isAdding ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 4px 12px rgba(107, 142, 35, 0.3)',
            transition: 'all 0.3s ease',
            transform: isAdding ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          {isAdding ? (
            <>
              <div style={{
                width: '24px',
                height: '24px',
                border: '3px solid #ffffff',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '8px'
              }}></div>
              <span style={{ fontSize: '0.9rem' }}>Adding...</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '3rem', marginBottom: '8px' }}>💧</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>+ 8 oz</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Tap to add</span>
            </>
          )}
        </button>
        
        {/* Undo Button */}
        {waterLogs.length > 0 && (
          <button
            onClick={removeLastWater}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '2px solid #6b8e23',
              color: '#6b8e23',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            ↶ Undo Last
          </button>
        )}
      </div>
      
      {/* Today's Log */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '16px', color: '#333' }}>
          Today's Log ({waterLogs.length} entries)
        </h2>
        
        {waterLogs.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
            No water logged yet today. Start by tapping the button above!
          </p>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {waterLogs.map((log, index) => (
              <div key={log.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px', 
                borderRadius: '8px', 
                backgroundColor: index % 2 === 0 ? '#f9fafb' : 'transparent', 
                marginBottom: '8px',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>💧</span>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>{log.amount} oz</span>
                </div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>{log.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        marginTop: '32px',
        padding: '16px 0',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        <Link to="/dashboard" style={{ 
          textDecoration: 'none', 
          color: '#6b7280',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'color 0.3s ease'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🏠</span>
          <span style={{ fontSize: '0.8rem' }}>Home</span>
        </Link>
        <Link to="/meal-logger" style={{ 
          textDecoration: 'none', 
          color: '#6b7280',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'color 0.3s ease'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📷</span>
          <span style={{ fontSize: '0.8rem' }}>Meals</span>
        </Link>
        <Link to="/water-tracker" style={{ 
          textDecoration: 'none', 
          color: '#6b8e23',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontWeight: 'bold'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>💧</span>
          <span style={{ fontSize: '0.8rem' }}>Water</span>
        </Link>
        <Link to="/health-tracker" style={{ 
          textDecoration: 'none', 
          color: '#6b7280',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'color 0.3s ease'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📊</span>
          <span style={{ fontSize: '0.8rem' }}>Health</span>
        </Link>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default WaterTrackerPage;
