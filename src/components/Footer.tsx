import React from 'react';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--dark-color)',
      color: 'var(--light-color)',
      padding: '40px 0 20px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginBottom: '40px'
        }}>
          {/* Logo and Description */}
          <div style={{ flex: '1', minWidth: '250px', marginBottom: '30px', paddingRight: '20px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Sajoma Fitness</h2>
            <p style={{ color: 'var(--gray-color)', lineHeight: '1.6' }}>
              Wellness simplified for adults 40+. Track meals, monitor health metrics, and receive expert-backed suggestions.
            </p>
          </div>
          
          {/* Quick Links */}
          <div style={{ flex: '1', minWidth: '200px', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Quick Links</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <a href="/" style={{ color: 'var(--gray-color)', textDecoration: 'none' }}>Home</a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="/login" style={{ color: 'var(--gray-color)', textDecoration: 'none' }}>Login</a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#features" style={{ color: 'var(--gray-color)', textDecoration: 'none' }}>Features</a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#" style={{ color: 'var(--gray-color)', textDecoration: 'none' }}>About Us</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div style={{ flex: '1', minWidth: '200px', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Contact</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px', color: 'var(--gray-color)' }}>
                Email: info@sajomafitness.app
              </li>
              <li style={{ marginBottom: '10px', color: 'var(--gray-color)' }}>
                Phone: (555) 123-4567
              </li>
              <li style={{ marginBottom: '10px', color: 'var(--gray-color)' }}>
                Address: 123 Wellness St, Health City, HC 12345
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div style={{ flex: '1', minWidth: '250px', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Newsletter</h3>
            <p style={{ color: 'var(--gray-color)', marginBottom: '16px' }}>
              Subscribe to our newsletter for wellness tips and updates.
            </p>
            <div style={{ display: 'flex' }}>
              <input 
                type="email" 
                placeholder="Your email"
                style={{
                  flex: '1',
                  padding: '10px',
                  borderRadius: '4px 0 0 4px',
                  border: 'none'
                }}
              />
              <button style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer'
              }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Social Media Icons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <a href="#" style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 10px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.2rem'
          }}>
            f
          </a>
          <a href="#" style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 10px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.2rem'
          }}>
            t
          </a>
          <a href="#" style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 10px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.2rem'
          }}>
            in
          </a>
          <a href="#" style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 10px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.2rem'
          }}>
            ig
          </a>
        </div>
        
        {/* Copyright */}
        <div style={{ 
          textAlign: 'center', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          color: 'var(--gray-color)'
        }}>
          <p>&copy; {new Date().getFullYear()} Sajoma Fitness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
