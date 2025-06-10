import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface MealLoggerPageProps {}

const MealLoggerPage: React.FC<MealLoggerPageProps> = () => {
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  
  const handleCapture = (): void => {
    setIsProcessing(true);
    
    // Simulate camera capture and processing
    setTimeout(() => {
      // Generate a placeholder image URL for demo
      const placeholderImage = `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="#f3f4f6"/>
          <circle cx="150" cy="120" r="40" fill="#6b8e23"/>
          <rect x="110" y="160" width="80" height="60" rx="10" fill="#8b4513"/>
          <circle cx="120" cy="180" r="8" fill="#ff6b6b"/>
          <circle cx="180" cy="180" r="8" fill="#4ecdc4"/>
          <text x="150" y="250" text-anchor="middle" fill="#666" font-family="Arial" font-size="14">Sample Meal</text>
        </svg>
      `)}`;
      
      setCapturedImage(placeholderImage);
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Navigate to meal result page after a short delay
      setTimeout(() => {
        navigate('/meal-result', { 
          state: { 
            mealType: selectedMealType,
            image: placeholderImage,
            timestamp: new Date().toISOString()
          }
        });
      }, 1500);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setCapturedImage(imageUrl);
        setIsProcessing(true);
        
        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false);
          setShowSuccess(true);
          
          setTimeout(() => {
            navigate('/meal-result', { 
              state: { 
                mealType: selectedMealType,
                image: imageUrl,
                timestamp: new Date().toISOString()
              }
            });
          }, 1500);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleManualEntry = () => {
    // For demo purposes, create a manual entry
    const manualMeal = {
      mealType: selectedMealType,
      manualEntry: true,
      timestamp: new Date().toISOString()
    };
    
    navigate('/meal-result', { state: manualMeal });
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      {/* Header */}
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center', color: '#333' }}>
        Log Your Meal
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
          ✅ Meal captured! Analyzing nutrition...
        </div>
      )}
      
      {/* Meal Type Selector */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>Meal Type:</p>
        
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto',
          gap: '8px',
          paddingBottom: '8px'
        }}>
          {mealTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: selectedMealType === type ? '#6b8e23' : '#f3f4f6',
                color: selectedMealType === type ? 'white' : '#333',
                fontWeight: selectedMealType === type ? 'bold' : 'normal',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {/* Camera Viewfinder */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          width: '100%',
          aspectRatio: '1',
          border: '3px dashed #6b8e23',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: capturedImage ? `url(${capturedImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {isProcessing && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #6b8e23',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px'
              }}></div>
              <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold' }}>
                Analyzing meal...
              </p>
              <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                Identifying ingredients and nutrition
              </p>
            </div>
          )}
          
          {!capturedImage && !isProcessing && (
            <div style={{ textAlign: 'center', color: '#666' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>📷</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>
                Snap a photo of your plate. We'll help you understand what's on it.
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Prefer to type it in? Use Manual Entry.
              </p>
            </div>
          )}
        </div>
        
        {/* Capture Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleCapture}
            disabled={isProcessing}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: isProcessing ? '#9ca3af' : '#6b8e23',
              border: '6px solid white',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(107, 142, 35, 0.3)',
              transition: 'all 0.3s ease',
              transform: isProcessing ? 'scale(0.9)' : 'scale(1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!isProcessing && (
              <span style={{ color: 'white', fontSize: '1.5rem' }}>📸</span>
            )}
          </button>
          <p style={{ marginTop: '8px', color: '#666', fontSize: '0.9rem' }}>
            Tap to capture
          </p>
        </div>
      </div>
      
      {/* Alternative Options */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#333' }}>
          Other Options
        </h3>
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexDirection: 'column'
        }}>
          <button 
            onClick={handleGalleryClick}
            disabled={isProcessing}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '2px solid #6b8e23',
              backgroundColor: 'transparent',
              color: '#6b8e23',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🖼️</span>
            Upload from Gallery
          </button>
          <button 
            onClick={handleManualEntry}
            disabled={isProcessing}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '2px solid #6b8e23',
              backgroundColor: 'transparent',
              color: '#6b8e23',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>✏️</span>
            Manual Entry
          </button>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
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
          color: '#6b8e23',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontWeight: 'bold'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📷</span>
          <span style={{ fontSize: '0.8rem' }}>Meals</span>
        </Link>
        <Link to="/water-tracker" style={{ 
          textDecoration: 'none', 
          color: '#6b7280',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'color 0.3s ease'
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

export default MealLoggerPage;
