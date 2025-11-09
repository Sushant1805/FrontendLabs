import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { endpoint } from '../../utils/apiClient';
import { setIsLoading } from './codeSlice';
import styles from './CodingScreen.module.css';

const TestResultsSection = (props) => {
  const { testResults, testType, isLoading, code } = useSelector(state => state.code);
  const resultsInfoRef = useRef(null);
  const aiExplanationRef = useRef(null);

  const dispatch = useDispatch();
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Helper function to format objects in JavaScript object literal format
  const formatObjectForDisplay = (obj) => {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    
    if (Array.isArray(obj)) {
      return '[' + obj.map(item => formatObjectForDisplay(item)).join(', ') + ']';
    }
    
    if (typeof obj === 'object') {
      const entries = Object.entries(obj).map(([key, value]) => {
        const formattedValue = formatObjectForDisplay(value);
        return `${key}: ${formattedValue}`;
      });
      return '{' + entries.join(', ') + '}';
    }
    
    if (typeof obj === 'string') {
      return `"${obj}"`;
    }
    
    return String(obj);
  };

  // Handle scroll
  useEffect(() => {
    const aiEl = aiExplanationRef.current;
    if (!aiEl) return;

    let pointerActive = false;
    const pointerDown = () => { pointerActive = true; };
    const pointerUp = () => { pointerActive = false; };

    const wheelHandler = (e) => {
      const canScroll = aiEl.scrollHeight > aiEl.clientHeight;
      if (!canScroll) return; // nothing to do

      const atTop = aiEl.scrollTop === 0;
      const atBottom = aiEl.scrollTop >= aiEl.scrollHeight - aiEl.clientHeight - 1;

      // If inner can scroll, prevent the parent from capturing the wheel when not at boundaries
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        // let event bubble so parent can handle overscroll
        return;
      }

      e.stopPropagation();
      // prevent page from scrolling
      e.preventDefault();
      aiEl.scrollTop += e.deltaY;
    };

    aiEl.addEventListener('wheel', wheelHandler, { passive: false });
    aiEl.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);

    // Touch move for mobile
    let startY = 0;
    const touchStart = (e) => { startY = e.touches[0].clientY; };
    const touchMove = (e) => {
      const diff = startY - e.touches[0].clientY;
      const canScroll = aiEl.scrollHeight > aiEl.clientHeight;
      if (!canScroll) return;

      const atTop = aiEl.scrollTop === 0;
      const atBottom = aiEl.scrollTop >= aiEl.scrollHeight - aiEl.clientHeight - 1;

      if ((atTop && diff < 0) || (atBottom && diff > 0)) {
        return; // let parent handle overscroll
      }

      e.stopPropagation();
      // prevent native overscroll
      e.preventDefault();
      aiEl.scrollTop += diff;
      startY = e.touches[0].clientY;
    };

    aiEl.addEventListener('touchstart', touchStart, { passive: true });
    aiEl.addEventListener('touchmove', touchMove, { passive: false });

    return () => {
      aiEl.removeEventListener('wheel', wheelHandler);
      aiEl.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', pointerUp);
      aiEl.removeEventListener('touchstart', touchStart);
      aiEl.removeEventListener('touchmove', touchMove);
    };
  }, [aiExplanation]);

  useEffect(() => {
    const resultsInfo = resultsInfoRef.current;

    if (resultsInfo) {
      const wheelHandler = (e) => {
        if (resultsInfo.scrollHeight > resultsInfo.clientHeight) {
          e.stopPropagation();

          const atTop = resultsInfo.scrollTop === 0;
          const atBottom = resultsInfo.scrollTop >= resultsInfo.scrollHeight - resultsInfo.clientHeight;

          if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            return;
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

  const safeResults = testResults || [];
  const hasErrors = safeResults.some(result => result && (result.error || !result.pass));
  const errorResult = safeResults.find(result => result && result.error);

  const passedTests = safeResults.filter(result => result && result.pass).length;
  const totalTests = safeResults.length;
  const allPassed = passedTests === totalTests && !hasErrors;

  // Ask AI handler
  const handleAskAI = async () => {
    try {
      setAiLoading(true);
      setAiExplanation(null);
      dispatch(setIsLoading(true));

      const payload = {
        code: code || (window.__USER_CODE__ || ''), // prefer Redux-stored code
        testResults,
        problem: props?.problem || null
      };

      // Try to find code from the editor area if available
      try {
        const codeArea = document.querySelector('.monaco-editor, textarea, .code-editor');
        if (codeArea) {
          payload.code = codeArea.innerText || codeArea.value || payload.code;
        }
      } catch (e) {
        // ignore
      }

      const res = await fetch(endpoint('/api/ai/explain'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        // If backend returned provider details, format them for display
        if (err && (err.status || err.details || err.url)) {
          const parts = [];
          if (err.status) parts.push(`Provider status: ${err.status}`);
          if (err.url) parts.push(`URL: ${err.url}`);
          if (err.details) parts.push(`Details: ${typeof err.details === 'string' ? err.details : JSON.stringify(err.details)}`);
          setAiExplanation(parts.join('\n\n'));
        } else {
          setAiExplanation(err?.error || `AI request failed: ${res.status}`);
        }
      } else {
        const data = await res.json();
        setAiExplanation(data.explanation || 'No explanation returned');
      }
    } catch (error) {
      setAiExplanation(error.message || 'Unknown error');
    } finally {
      setAiLoading(false);
      dispatch(setIsLoading(false));
    }
  };

  // Show loading state
  if (isLoading) {
    const loadingMessage = aiLoading ? 'Asking help from AI, please wait...' : 'Executing your code, please wait...';

    return (
      <div ref={resultsInfoRef} className={styles.problemInfoContainer}>
        <h2>
          {testType === 'sample' ? 'Running Sample Tests...' : 'Running All Tests...'}
        </h2>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  }

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

      {/* Modern Results Header */}
      <div className={styles.modernResultsHeader}>
        <div className={styles.resultsOverview}>
          <div className={styles.overviewStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{passedTests}</span>
              <span className={styles.statLabel}>Passed</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{totalTests - passedTests}</span>
              <span className={styles.statLabel}>Failed</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{totalTests}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
          </div>
          
          <div className={styles.overallStatus}>
            {hasErrors ? (
              <div className={styles.statusError}>
                <span className={styles.statusIcon}>⚠️</span>
                <span className={styles.statusText}>{errorResult?.error || `${totalTests - passedTests} Failed`}</span>
              </div>
            ) : (
              <div className={`${styles.statusBadge} ${allPassed ? styles.statusSuccess : styles.statusPartial}`}>
                <span className={styles.statusIcon}>{allPassed ? '✅' : '⚠️'}</span>
                <span className={styles.statusText}>
                  {allPassed ? 'All Tests Passed' : `${passedTests}/${totalTests} Passed`}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {!hasErrors && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(passedTests / totalTests) * 100}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{Math.round((passedTests / totalTests) * 100)}% Complete</span>
          </div>
        )}
      </div>

      {/* Modern Test Cases List */}
      <div className={styles.modernTestCases}>
        {/* Ask AI section - shown when there are failing tests */}
        {hasErrors && (
          <div className={styles.askAiContainer}>
            <button className={styles.askAiButton} onClick={handleAskAI} disabled={aiLoading}>
              {aiLoading ? 'Asking AI...' : 'Ask AI'}
            </button>
            {aiExplanation && (
              <div className={styles.aiExplanation} ref={aiExplanationRef}>
                <h4>AI Explanation</h4>
                <pre>{aiExplanation}</pre>
              </div>
            )}
          </div>
        )}
        {testResults.map((result, index) => (
          <div key={index} className={`${styles.modernTestCase} ${result.pass ? styles.testPassed : styles.testFailed}`}>
            <div className={styles.testCaseHeader}>
              <div className={styles.testCaseInfo}>
                <span className={styles.testCaseLabel}>Test Case {index + 1}</span>
                <div className={`${styles.statusIndicator} ${result.pass ? styles.passIndicator : styles.failIndicator}`}>
                  <span className={styles.statusDot}></span>
                  <span className={styles.statusLabel}>{result.pass ? 'Passed' : 'Failed'}</span>
                </div>
              </div>
            </div>

            <div className={styles.modernTestDetails}>
              {(!result.failures || result.failures.length === 0) && (
                <div className={styles.modernSection}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>📥</span>
                    <span className={styles.sectionTitle}>Input</span>
                  </div>
                  <div className={styles.modernCodeBlock}>
                    {result.input || 'No input provided'}
                  </div>
                </div>
              )}

              <div className={styles.outputComparison}>
                <div className={styles.modernSection}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✅</span>
                    <span className={styles.sectionTitle}>Expected</span>
                  </div>
                  <div className={styles.modernCodeBlock}>
                    {result.expected !== undefined && result.expected !== null 
                      ? (typeof result.expected === 'object' ? formatObjectForDisplay(result.expected) : String(result.expected))
                      : 'No expected output'
                    }
                  </div>
                </div>

                <div className={styles.modernSection}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>{result.pass ? '✅' : '❌'}</span>
                    <span className={styles.sectionTitle}>Your Output</span>
                  </div>
                  <div className={`${styles.modernCodeBlock} ${result.pass ? styles.correctOutput : styles.incorrectOutput}`}>
                    {result.failures && result.failures.length > 0 && result.failures.some(f => f.summary) ? (
                      <div>
                        {result.failures.map((f, fi) => (
                          <div key={fi}>
                            <pre className={styles.failureText}>{f.summary}</pre>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {result.failures && result.failures.length > 0 ? (
                          <div>
                            {result.failures.map((f, fi) => {
                              let conciseLines = [];
                              if (f.summary && f.summary.trim()) {
                                conciseLines = f.summary.trim().split('\n').map(l => l.trim()).filter(l => l);
                              } else {
                                const fm = (f.failureMessages || []).join('\n');
                                const lines = fm.split('\n').map(l => l.trim()).filter(l => l);
                                const matched = lines.filter(l => /^(Expected|Received|Received array|Expected length|Received length)/i.test(l) || /^\[.*\]$/.test(l));
                                if (matched.length) conciseLines = matched;
                                else conciseLines = lines.slice(-3);
                              }
                              conciseLines = conciseLines.slice(0, 3);

                              return (
                                <div key={fi}>
                                  <pre className={styles.failureText}>{conciseLines.join('\n')}</pre>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div>
                            {result.received ? (
                              <pre className={styles.outputText}>{String(result.received).split('\n').slice(0,3).join('\n')}</pre>
                            ) : 'No output'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResultsSection;