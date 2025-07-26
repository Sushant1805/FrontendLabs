import React from 'react';
import './StaticBackground.css';

const StaticBackground = () => {
  return (
    <div className="static-background">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>

      <div className="grid-overlay"></div>

      <div className="accent-line accent-line-1"></div>
      <div className="accent-line accent-line-2"></div>
      <div className="accent-line accent-line-3"></div>

      <div className="geometric-shape shape-circle"></div>
      <div className="geometric-shape shape-square"></div>
      <div className="geometric-shape shape-triangle"></div>
    </div>
  );
};

export default StaticBackground;
