import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      padding: '20px 24px', textAlign: 'center', background: '#F8F9FA',
      borderTop: '1px solid rgba(212,175,55,0.06)',
    }}>
      <p style={{ fontSize: '0.72rem', color: '#ADB5BD', margin: 0 }}>
        &copy; {new Date().getFullYear()} Sajoma Fitness. All rights reserved.
      </p>
    </footer>
  );
};

export { Footer };
export default Footer;
