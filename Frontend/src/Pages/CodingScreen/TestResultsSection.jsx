import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './CodingScreen.module.css';

const TestResultsSection = () => {
  const { testResults, testType } = useSelector(state => state.code);
  const resultsInfoRef = useRef(null);

  useEffect(() => {
    const resultsInfo = resultsInfoRef.current;

    if (resultsInfo) {
      // Add wheel event handler to ensure mouse wheel scrolling works
      const wheelHandler = (e) => {
        // Only handle wheel events if the element can scroll
        if (resultsInfo.scrollHeight > resultsInfo.clientHeight) {
          e.stopPropagation(); // Prevent parent elements from handling the wheel event

          // Check if we're at the top or bottom to allow natural scrolling
          const atTop = resultsInfo.scrollTop === 0;
          const atBottom = resultsInfo.scrollTop >= resultsInfo.scrollHeight - resultsInfo.clientHeight;

          if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            return; // Allow default behavior at boundaries
          }

          e.preventDefault();
          resultsInfo.scrollTop += e.deltaY;
        }
      };

      resultsInfo.addEventListener('wheel', wheelHandler, { passive: false });

      return () => {
        resultsInfo.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [testResults]);

  // Check if there are any error results
  const hasErrors = testResults.some(result => result.error);
  const errorResult = testResults.find(result => result.error);
  
  const passedTests = testResults.filter(result => result.pass).length;
  const totalTests = testResults.length;
  const allPassed = passedTests === totalTests && !hasErrors;

  if (!testResults || testResults.length === 0) {
    return (
      <div ref={resultsInfoRef} className={styles.problemInfoContainer}>
        <h2>Test Results</h2>
        <div className={styles.noResults}>
          <p>No test results yet.</p>
          <p>Click <strong>"Run"</strong> to test your code against sample test cases.</p>
          <p>Click <strong>"Submit"</strong> to test against all test cases.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={resultsInfoRef} className={styles.problemInfoContainer}>
      <h2>
        {testType === 'sample' ? 'Sample Test Results' : 'Submission Results'}
      </h2>

      <div className={styles.resultsSummary}>
        {hasErrors ? (
          <div className={`${styles.summaryCard} ${styles.error}`}>
            <h3>❌ {errorResult.error}</h3>
            <p>{errorResult.message}</p>
          </div>
        ) : (
          <div className={`${styles.summaryCard} ${allPassed ? styles.success : styles.failure}`}>
            <h3>{allPassed ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}</h3>
            <p>{passedTests} / {totalTests} test cases passed</p>
          </div>
        )}
      </div>

      {!hasErrors && (
        <div className={styles.testCasesList}>
          {testResults.map((result, index) => (
            <div key={index} className={`${styles.testCase} ${result.pass ? styles.passed : styles.failed}`}>
              <div className={styles.testCaseHeader}>
                <span className={styles.testCaseNumber}>Test Case {index + 1}</span>
                <span className={`${styles.status} ${result.pass ? styles.statusPassed : styles.statusFailed}`}>
                  {result.pass ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              
              <div className={styles.testCaseDetails}>
                <div className={styles.inputSection}>
                  <strong>Input:</strong>
                  <div className={styles.codeBlock}>{result.input || 'No input provided'}</div>
                </div>
                
                <div className={styles.outputSection}>
                  <div className={styles.expectedOutput}>
                    <strong>Expected Output:</strong>
                    <div className={styles.codeBlock}>{result.expected || 'No expected output'}</div>
                  </div>
                  
                  <div className={styles.actualOutput}>
                    <strong>Your Output:</strong>
                    <div className={`${styles.codeBlock} ${result.pass ? styles.correctOutput : styles.incorrectOutput}`}>
                      {result.received !== undefined && result.received !== null 
                        ? (typeof result.received === 'object' ? JSON.stringify(result.received, null, 2) : String(result.received))
                        : 'No output'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResultsSection;
