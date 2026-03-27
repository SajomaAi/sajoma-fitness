import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      padding: '20px 24px', textAlign: 'center', background: '#FFF0F5',
      borderTop: '1px solid rgba(212,160,23,0.06)',
    }}>
      <p style={{ fontSize: '0.72rem', color: '#BCAAA4', margin: 0 }}>
        &copy; {new Date().getFullYear()} Sajoma Fitness. All rights reserved.
      </p>
    </footer>
  );
};

export { Footer };
export default Footer;
