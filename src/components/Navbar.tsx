import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  return (
    <nav style={{
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div>
        <Link to="/" style={{ 
          color: '#6b8e23', 
          textDecoration: 'none', 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#6b8e23',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px',
            fontWeight: 'bold'
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
              backgroundColor: '#333'
            }}>
              Dashboard
            </Link>
            <Link to="/settings" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#6b8e23'
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
              backgroundColor: '#333'
            }}>
              Login
            </Link>
            <Link to="/signup" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#6b8e23',
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
