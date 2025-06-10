import React, { useState } from 'react';
// import { useTranslation } from '../hooks/useTranslation'; // Commented out as not currently used

interface PremiumPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

const PremiumPaywall: React.FC<PremiumPaywallProps> = ({ isOpen, onClose, feature }) => {
  // const { t } = useTranslation(); // Commented out as not currently used
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      alert('Premium upgrade coming soon! This feature will be available in the next update.');
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  const getFeatureDescription = (feature: string) => {
    switch (feature) {
      case 'unlimited_scans':
        return 'Unlimited ingredient scanning and meal analysis';
      case 'wearable_sync':
        return 'Sync with Apple Watch, Whoop, and other wearables';
      case 'advanced_tips':
        return 'Personalized nutrition tips and expert guidance';
      case 'meal_history':
        return 'Access to complete meal history and trends';
      default:
        return 'Premium features and enhanced functionality';
    }
  };

  return (
    <div style={{
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
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            fontSize: '2rem'
          }}>
            👑
          </div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            color: '#1a1a1a'
          }}>
            Upgrade to Premium
          </h2>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: '0.9rem'
          }}>
            Unlock {getFeatureDescription(feature)}
          </p>
        </div>

        {/* Features List */}
        <div style={{ 
          textAlign: 'left', 
          marginBottom: '24px',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            margin: '0 0 16px 0',
            color: '#1a1a1a'
          }}>
            Premium includes:
          </h3>
          <ul style={{ 
            listStyleType: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ 
                color: '#4CAF50',
                marginRight: '12px',
                fontSize: '1.2rem'
              }}>✓</span>
              <span style={{ fontSize: '0.9rem' }}>Unlimited ingredient scanning</span>
            </li>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ 
                color: '#4CAF50',
                marginRight: '12px',
                fontSize: '1.2rem'
              }}>✓</span>
              <span style={{ fontSize: '0.9rem' }}>Wearable device integration</span>
            </li>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ 
                color: '#4CAF50',
                marginRight: '12px',
                fontSize: '1.2rem'
              }}>✓</span>
              <span style={{ fontSize: '0.9rem' }}>Personalized meal suggestions</span>
            </li>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ 
                color: '#4CAF50',
                marginRight: '12px',
                fontSize: '1.2rem'
              }}>✓</span>
              <span style={{ fontSize: '0.9rem' }}>Expert nutritional guidance</span>
            </li>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center'
            }}>
              <span style={{ 
                color: '#4CAF50',
                marginRight: '12px',
                fontSize: '1.2rem'
              }}>✓</span>
              <span style={{ fontSize: '0.9rem' }}>Ad-free experience</span>
            </li>
          </ul>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>$9.99</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>per month</div>
          </div>
          <p style={{ 
            fontSize: '0.8rem', 
            color: '#666', 
            margin: 0 
          }}>
            Cancel anytime • 7-day free trial
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isProcessing ? 'Processing...' : 'Start Free Trial'}
          </button>
          
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Maybe Later
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#999',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PremiumPaywall;

