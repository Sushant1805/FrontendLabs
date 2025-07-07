// src/Components/HeroBackground.js
import React, { useEffect } from 'react';
import './HeroBackground.css'; // We'll move the CSS there

const HeroBackground = () => {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 18 + 's';
      particle.style.animationDuration = Math.random() * 10 + 15 + 's';

      const container = document.querySelector('.hero-background');
      container && container.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 30000);
    };

    const interval = setInterval(createParticle, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const orbs = document.querySelectorAll('.orb');
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.3;
        const x = (mouseX - 0.5) * speed * 10;
        const y = (mouseY - 0.5) * speed * 10;
        orb.style.transform = `translate(${x}px, ${y}px)`; // Reset each time
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hero-background">
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

      {/* Initial static particles */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{ left: `${10 * (i + 1)}%`, animationDelay: `${i * 3}s` }}
        />
      ))}
    </div>
  );
};

export default HeroBackground;
