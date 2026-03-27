import React from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../lib/basePath';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout: _onLogout }) => {
  // In the mobile app, logged-in users use BottomNav. Navbar only shows for public pages.
  if (isLoggedIn) return null;

  return (
    <nav style={{
      background: 'rgba(248,249,250,0.95)', backdropFilter: 'blur(10px)',
      padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      position: 'sticky', top: 0, zIndex: 1000,
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    }}>
      <Link to="/" style={{ color: '#212529', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, overflow: 'hidden',
          background: 'linear-gradient(135deg, #D4AF37, #D4AF37)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src={assetUrl('/sajoma-icon.png')} alt="" style={{ width: 32, height: 32 }} onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }} />
        </div>
        Sajoma Fitness
      </Link>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/login" style={{
          color: '#D4AF37', textDecoration: 'none', padding: '8px 16px', borderRadius: 10,
          fontSize: '0.82rem', fontWeight: 600,
        }}>Log In</Link>
        <Link to="/login?mode=signup" style={{
          color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: 10,
          fontSize: '0.82rem', fontWeight: 600,
          background: 'linear-gradient(135deg, #D4AF37, #C19A29)',
        }}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
