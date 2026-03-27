import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  return (
    <nav style={{
      background: 'linear-gradient(135deg, #3E2723 0%, #4E342E 100%)',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(62,39,35,0.3)'
    }}>
      <div>
        <Link to="/" style={{ 
          color: '#D4A017', 
          textDecoration: 'none', 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #F8B4C8 0%, #D4A017 100%)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px',
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(212,160,23,0.4)'
          }}>
            S
          </div>
          Sajoma Fitness
        </Link>
      </div>
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#5D4037'
            }}>
              Dashboard
            </Link>
            <Link to="/settings" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #F8B4C8, #D4A017)',
              border: 'none'
            }}>
              Settings
            </Link>
            <button 
              onClick={onLogout}
              style={{
                backgroundColor: '#8b0000',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#5D4037'
            }}>
              Login
            </Link>
            <Link to="/signup" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #F8B4C8, #D4A017)',
              border: 'none',
              fontWeight: 'bold'
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
