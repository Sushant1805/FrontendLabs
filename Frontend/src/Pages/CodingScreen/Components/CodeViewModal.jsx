import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeCodeModal } from '../codeSlice';
import styles from '../CodingScreen.module.css';
import { IoClose, IoCopy, IoCheckmark } from 'react-icons/io5';

const CodeViewModal = () => {
  const dispatch = useDispatch();
  const { showCodeModal, modalCode } = useSelector(state => state.code);
  const [copied, setCopied] = useState(false);
  const codeBlockRef = useRef(null);



  const handleClose = () => {
    dispatch(closeCodeModal());
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(modalCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy code:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = modalCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleModalClick = (e) => {
    // Prevent modal click from bubbling to backdrop
    e.stopPropagation();
  };

  // Handle scrolling
  useEffect(() => {
    const codeBlock = codeBlockRef.current;
    if (codeBlock && showCodeModal) {
      const handleWheel = (e) => {
        // Stop event from bubbling to parent components
        e.stopPropagation();
        
        // Allow natural scrolling within the code block
        if (codeBlock.scrollHeight > codeBlock.clientHeight) {
          // Let the browser handle the scroll naturally
          return;
        } else {
          // Prevent scroll if content doesn't need scrolling
          e.preventDefault();
        }
      };

      codeBlock.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        codeBlock.removeEventListener('wheel', handleWheel);
      };
    }
  }, [showCodeModal, modalCode]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (showCodeModal) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showCodeModal]);

  if (!showCodeModal) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.codeModal} onClick={handleModalClick}>
        <div className={styles.modalHeader}>
          <h3>Submission Code</h3>
          <div className={styles.modalActions}>
            <button 
              onClick={handleCopy} 
              className={`${styles.modalButton} ${styles.copyButton}`}
              disabled={copied}
            >
              {copied ? <IoCheckmark /> : <IoCopy />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button 
              onClick={handleClose} 
              className={`${styles.modalButton} ${styles.closeButton}`}
            >
              <IoClose />
            </button>
          </div>
        </div>
        
        <div className={styles.modalContent}>
          <pre ref={codeBlockRef} className={styles.modalCodeBlock}>
            <code>{modalCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeViewModal;