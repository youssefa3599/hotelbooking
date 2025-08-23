import React from 'react';

const DashboardHome: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <img
        src="/picm.jpg"
        alt="Welcome"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default DashboardHome;
