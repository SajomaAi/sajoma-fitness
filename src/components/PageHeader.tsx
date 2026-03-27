import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
  onOpenMenu?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showBack = false, onOpenMenu }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="page-header" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '16px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-pink)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showBack ? (
          <button 
            className="icon-btn" 
            onClick={() => navigate(-1)} 
            aria-label={t('back')}
            style={{ 
              background: 'white', border: 'none', width: 40, height: 40, 
              borderRadius: 12, display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontSize: '1.4rem', 
              boxShadow: 'var(--shadow-sm)', cursor: 'pointer' 
            }}
          >
            ←
          </button>
        ) : (
          <div 
            className="header-logo" 
            onClick={() => navigate('/dashboard')} 
            style={{ cursor: 'pointer' }}
          >
            <img 
              src="/sajoma-icon.png" 
              alt="Sajoma Fitness" 
              style={{ width: 40, height: 40, borderRadius: 10, boxShadow: 'var(--shadow-gold)' }} 
            />
          </div>
        )}
        {title && <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: 'var(--text-dark)' }}>{title}</h1>}
      </div>

      <div className="header-right">
        {onOpenMenu && (
          <button 
            className="icon-btn" 
            onClick={onOpenMenu} 
            aria-label="Menu"
            style={{ 
              background: 'white', border: 'none', width: 40, height: 40, 
              borderRadius: 12, display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontSize: '1.2rem', 
              boxShadow: 'var(--shadow-sm)', cursor: 'pointer' 
            }}
          >
            ☰
          </button>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
