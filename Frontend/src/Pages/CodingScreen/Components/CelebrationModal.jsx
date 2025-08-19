import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowCelebration } from '../codeSlice';
import styles from './CelebrationModal.module.css';

const CelebrationModal = () => {
  const dispatch = useDispatch();
  const { showCelebration } = useSelector(state => state.code);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (showCelebration) {
      // Generate confetti particles
      const particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 3,
          animationDuration: 3 + Math.random() * 2,
          backgroundColor: getRandomColor(),
        });
      }
      setConfetti(particles);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const getRandomColor = () => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5a24', '#0abde3', '#3867d6', '#8c7ae6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleClose = () => {
    dispatch(setShowCelebration(false));
  };

  if (!showCelebration) return null;

  return (
    <div className={styles.celebrationOverlay} onClick={handleClose}>
      <div className={styles.celebrationContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Confetti Animation */}
        <div className={styles.confettiContainer}>
          {confetti.map((particle) => (
            <div
              key={particle.id}
              className={styles.confetti}
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
                backgroundColor: particle.backgroundColor,
              }}
            />
          ))}
        </div>

        {/* Main Celebration Content */}
        <div className={styles.celebrationMain}>
          <div className={styles.trophy}>🏆</div>
          <h1 className={styles.celebrationTitle}>
            🎉 CONGRATULATIONS! 🎉
          </h1>
          <h2 className={styles.celebrationSubtitle}>
            All Test Cases Passed!
          </h2>
          <div className={styles.celebrationEmojis}>
            <span className={styles.emoji}>🚀</span>
            <span className={styles.emoji}>💯</span>
            <span className={styles.emoji}>⭐</span>
            <span className={styles.emoji}>🔥</span>
            <span className={styles.emoji}>💪</span>
          </div>
          <p className={styles.celebrationMessage}>
            You've successfully solved this problem! <br />
            Your coding skills are on fire! 🔥
          </p>
          <div className={styles.celebrationStats}>
            <div className={styles.stat}>
              <span className={styles.statIcon}>✅</span>
              <span className={styles.statText}>Perfect Solution</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>⚡</span>
              <span className={styles.statText}>Code Ninja</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>🎯</span>
              <span className={styles.statText}>Problem Solved</span>
            </div>
          </div>
          <button className={styles.celebrationButton} onClick={handleClose}>
            Continue Coding! 🚀
          </button>
        </div>

        {/* Floating Elements */}
        <div className={styles.floatingElements}>
          <div className={styles.floatingElement} style={{animationDelay: '0s'}}>🎊</div>
          <div className={styles.floatingElement} style={{animationDelay: '0.5s'}}>🎉</div>
          <div className={styles.floatingElement} style={{animationDelay: '1s'}}>⭐</div>
          <div className={styles.floatingElement} style={{animationDelay: '1.5s'}}>🏆</div>
          <div className={styles.floatingElement} style={{animationDelay: '2s'}}>💎</div>
          <div className={styles.floatingElement} style={{animationDelay: '2.5s'}}>🔥</div>
        </div>

        {/* Pulse Rings */}
        <div className={styles.pulseRings}>
          <div className={styles.pulseRing} style={{animationDelay: '0s'}}></div>
          <div className={styles.pulseRing} style={{animationDelay: '0.5s'}}></div>
          <div className={styles.pulseRing} style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;
