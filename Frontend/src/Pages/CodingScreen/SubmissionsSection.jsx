import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSubmissions, setIsLoadingSubmissions, clearSubmissions, openCodeModal } from './codeSlice';
import styles from './CodingScreen.module.css';
import CodeViewModal from './Components/CodeViewModal';

const SubmissionsSection = ({ problemId }) => {
  const dispatch = useDispatch();
  const { submissions, isLoadingSubmissions } = useSelector(state => state.code);
  const userData = useSelector(state => state.auth.user);
  const submissionsInfoRef = useRef(null);



  // Function to fetch submissions
  const fetchSubmissions = async () => {
    if (!userData || !problemId) {
      console.log('Cannot fetch submissions: missing user or problem data', { userData: !!userData, problemId });
      return;
    }

    console.log('Fetching submissions for user:', userData._id, 'problem:', problemId);

    try {
      dispatch(setIsLoadingSubmissions(true));

      const url = `http://localhost:5000/api/submissions/${userData._id}/${problemId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }

      const data = await response.json();
      console.log('Submissions fetched:', data.submissions ? data.submissions.length : 0, 'submissions');

      if (data.submissions && Array.isArray(data.submissions)) {
        dispatch(setSubmissions(data.submissions));
      } else {
        dispatch(setSubmissions([]));
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      dispatch(setSubmissions([]));
    } finally {
      dispatch(setIsLoadingSubmissions(false));
    }
  };

  // Fetch submissions when component mounts or when problemId/userData changes
  useEffect(() => {
    if (userData && problemId) {
      fetchSubmissions();
    }
    
    // Cleanup function
    return () => {
      dispatch(clearSubmissions());
    };
  }, [userData, problemId, dispatch]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return styles.statusAccepted;
      case 'Wrong Answer':
        return styles.statusWrongAnswer;
      case 'Runtime Error':
        return styles.statusRuntimeError;
      default:
        return styles.statusDefault;
    }
  };

  // Handle view code button click
  const handleViewCode = (code) => {
    dispatch(openCodeModal(code));
  };

  // Handle scroll for the submissions container
  useEffect(() => {
    const submissionsInfo = submissionsInfoRef.current;

    if (submissionsInfo) {
      const wheelHandler = (e) => {
        if (submissionsInfo.scrollHeight > submissionsInfo.clientHeight) {
          e.stopPropagation();

          const atTop = submissionsInfo.scrollTop === 0;
          const atBottom = submissionsInfo.scrollTop >= submissionsInfo.scrollHeight - submissionsInfo.clientHeight;

          if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            return;
          }

          e.preventDefault();
          submissionsInfo.scrollTop += e.deltaY;
        }
      };

      submissionsInfo.addEventListener('wheel', wheelHandler, { passive: false });

      return () => {
        submissionsInfo.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [submissions]);

  // Show loading state
  if (isLoadingSubmissions) {
    return (
      <div ref={submissionsInfoRef} className={styles.problemInfoContainer}>
        <h2>Submissions</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Fetching your submissions...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!userData) {
    return (
      <div ref={submissionsInfoRef} className={styles.problemInfoContainer}>
        <h2>Submissions</h2>
        <div className={styles.noResults}>
          <p>Please log in to view your submissions.</p>
        </div>
      </div>
    );
  }

  // Show empty state if no submissions
  if (!submissions || submissions.length === 0) {
    return (
      <div ref={submissionsInfoRef} className={styles.problemInfoContainer}>
        <h2>Submissions (0)</h2>
        <div className={styles.noResults}>
          <p>No submissions yet for this problem.</p>
          <p>Submit your solution to see it appear here!</p>
        </div>
      </div>
    );
  }

  // Sort submissions by submission time in descending order (latest first)
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  return (
    <div ref={submissionsInfoRef} className={styles.problemInfoContainer}>
      <h2>Your Submissions ({submissions.length})</h2>
      
      <div className={styles.submissionsContainer}>
        {sortedSubmissions.map((submission, index) => (
          <div key={submission._id} className={styles.submissionCard}>
            <div className={styles.submissionHeader}>
              <div className={styles.submissionInfo}>
                <span className={styles.submissionNumber}>#{index + 1}</span>
                <span className={`${styles.submissionStatus} ${getStatusColor(submission.status)}`}>
                  {submission.status}
                </span>
              </div>
              <div className={styles.submissionActions}>
                <span className={styles.submissionDate}>
                  {formatDate(submission.submittedAt)}
                </span>
                <button 
                  className={styles.viewCodeButton}
                  onClick={() => handleViewCode(submission.code)}
                >
                  View Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <CodeViewModal />
    </div>
  );
};

export default SubmissionsSection;