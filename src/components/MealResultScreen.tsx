import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface MealResultScreenProps {}

interface MealData {
  mealType: string;
  image?: string;
  manualEntry?: boolean;
  timestamp: string;
}

const MealResultScreen: React.FC<MealResultScreenProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mealData = location.state as MealData;

  // Mock analysis results
  const analysisResults = {
    calories: 420,
    protein: 28,
    carbs: 45,
    fat: 12,
    fiber: 8,
    sugar: 12,
    sodium: 680,
    ingredients: [
      { name: 'Grilled Chicken Breast', amount: '150g', healthy: true },
      { name: 'Brown Rice', amount: '100g', healthy: true },
      { name: 'Steamed Broccoli', amount: '80g', healthy: true },
      { name: 'Olive Oil', amount: '1 tbsp', healthy: true }
    ],
    healthScore: 85,
    suggestions: [
      'Great protein choice! Chicken breast is lean and nutritious.',
      'Brown rice provides complex carbohydrates for sustained energy.',
      'Broccoli is rich in vitamins C and K, plus fiber.',
      'Consider adding more colorful vegetables for additional nutrients.'
    ],
    warnings: [
      'Sodium content is moderate - watch your salt intake for the rest of the day.'
    ]
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return '#6b8e23';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (!mealData) {
    return (
      <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
        <h1>No meal data found</h1>
        <Link to="/meal-logger" className="btn">
          Back to Meal Logger
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '24px',
        gap: '12px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6b8e23'
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>
          Meal Analysis
        </h1>
      </div>

      {/* Meal Info */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#333', margin: 0 }}>
            {mealData.mealType}
          </h2>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            {formatTime(mealData.timestamp)}
          </span>
        </div>

        {mealData.image && !mealData.manualEntry && (
          <div style={{ 
            width: '100%',
            height: '200px',
            borderRadius: '8px',
            backgroundImage: `url(${mealData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '16px'
          }} />
        )}

        {mealData.manualEntry && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>✏️</span>
            <p style={{ color: '#666', margin: 0 }}>Manual Entry</p>
          </div>
        )}
      </div>

      {/* Health Score */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#333' }}>
          Health Score
        </h3>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: getHealthScoreColor(analysisResults.healthScore),
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '0 auto 12px'
        }}>
          {analysisResults.healthScore}
        </div>
        <p style={{ color: '#666', margin: 0 }}>
          {analysisResults.healthScore >= 80 ? 'Excellent choice!' : 
           analysisResults.healthScore >= 60 ? 'Good meal!' : 'Could be healthier'}
        </p>
      </div>

      {/* Nutrition Facts */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#333' }}>
          Nutrition Facts
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b8e23', margin: '0 0 4px 0' }}>
              {analysisResults.calories}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Calories</p>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b8e23', margin: '0 0 4px 0' }}>
              {analysisResults.protein}g
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Protein</p>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b8e23', margin: '0 0 4px 0' }}>
              {analysisResults.carbs}g
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Carbs</p>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b8e23', margin: '0 0 4px 0' }}>
              {analysisResults.fat}g
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Fat</p>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#333' }}>
          Identified Ingredients
        </h3>
        {analysisResults.ingredients.map((ingredient, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <div>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', color: '#333' }}>
                {ingredient.name}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                {ingredient.amount}
              </p>
            </div>
            <span style={{ fontSize: '1.2rem' }}>
              {ingredient.healthy ? '✅' : '⚠️'}
            </span>
          </div>
        ))}
      </div>

      {/* Expert Suggestions */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#333' }}>
          Expert Suggestions
        </h3>
        {analysisResults.suggestions.map((suggestion, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '12px',
            gap: '8px'
          }}>
            <span style={{ color: '#6b8e23', fontSize: '1.2rem' }}>💡</span>
            <p style={{ margin: 0, color: '#333', fontSize: '0.95rem' }}>
              {suggestion}
            </p>
          </div>
        ))}

        {analysisResults.warnings.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            {analysisResults.warnings.map((warning, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '12px',
                gap: '8px'
              }}>
                <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>⚠️</span>
                <p style={{ margin: 0, color: '#333', fontSize: '0.95rem' }}>
                  {warning}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px',
        marginBottom: '32px'
      }}>
        <button
          onClick={() => navigate('/meal-logger')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#6b8e23',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Log Another Meal
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#6b8e23',
            border: '2px solid #6b8e23',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          View Dashboard
        </button>
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
    </div>
  );
};

export default MealResultScreen;

