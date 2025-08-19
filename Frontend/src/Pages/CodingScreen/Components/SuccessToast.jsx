import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowSuccessToast } from '../codeSlice';
import styles from './SuccessToast.module.css';

const SuccessToast = () => {
  const dispatch = useDispatch();
  const { showSuccessToast } = useSelector(state => state.code);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showSuccessToast) {
      setIsVisible(true);
      // Auto hide after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for fade out animation before hiding completely
        setTimeout(() => {
          dispatch(setShowSuccessToast(false));
        }, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, dispatch]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(setShowSuccessToast(false));
    }, 300);
  };

  if (!showSuccessToast) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${isVisible ? styles.visible : styles.hidden}`}>
        <div className={styles.toastIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.toastContent}>
          <div className={styles.toastTitle}>Problem Solved!</div>
          <div className={styles.toastMessage}>All test cases passed successfully</div>
        </div>
        <button
          className={styles.toastClose}
          onClick={handleClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;
