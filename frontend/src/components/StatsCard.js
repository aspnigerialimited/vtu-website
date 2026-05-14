import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div className="stats-icon" style={{ color }}>{ icon}</div>
      <div className="stats-content">
        <p className="stats-title">{title}</p>
        <h3 className="stats-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;