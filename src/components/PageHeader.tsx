import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { assetUrl } from '../lib/basePath';

interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
  onOpenMenu?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showBack = false, onOpenMenu }) => {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useTranslation();

  return (
    <header className="page-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-light-grey)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      {/* Left: back button or logo */}
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showBack ? (
          <button
            className="icon-btn"
            onClick={() => navigate(-1)}
            aria-label={t('back')}
            style={{
              background: 'white', border: 'none', width: 38, height: 38,
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.3rem',
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
              src={assetUrl('/sajoma-icon.png')}
              alt="Sajoma Fitness"
              style={{ width: 38, height: 38, borderRadius: 10, boxShadow: 'var(--shadow-gold)' }}
            />
          </div>
        )}
        {title && (
          <h1 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--text)' }}>
            {title}
          </h1>
        )}
      </div>

      {/* Right: Language toggle + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* EN / ES pill toggle — always visible */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            borderRadius: 20,
            padding: '3px',
            boxShadow: 'var(--shadow-sm)',
            border: '1.5px solid rgba(0,0,0,0.1)',
          }}
        >
          <button
            onClick={() => changeLanguage('en')}
            style={{
              padding: '5px 11px',
              borderRadius: 16,
              border: 'none',
              background: language === 'en' ? 'var(--gold-gradient)' : 'transparent',
              color: language === 'en' ? 'white' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.03em',
            }}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('es')}
            style={{
              padding: '5px 11px',
              borderRadius: 16,
              border: 'none',
              background: language === 'es' ? 'var(--gold-gradient)' : 'transparent',
              color: language === 'es' ? 'white' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.03em',
            }}
            aria-label="Cambiar a Español"
          >
            ES
          </button>
        </div>

        {/* Hamburger menu button */}
        {onOpenMenu && (
          <button
            className="icon-btn"
            onClick={onOpenMenu}
            aria-label="Menu"
            style={{
              background: 'white', border: 'none', width: 38, height: 38,
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
