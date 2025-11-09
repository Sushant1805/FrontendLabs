import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import styles from './Navbar.module.css'
import { CgProfile } from "react-icons/cg"
import { useSelector, useDispatch } from "react-redux"
import { setShowRegister,setShowLogin } from "./Auth/modalSlice"
import { setTestResults, setTestType, setActiveTab, setShowSuccessToast, setIsLoading, clearSubmissions } from '../Pages/CodingScreen/codeSlice'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
import FrontendLabsLogo from '../assets/FrontendLabs.png';
import { endpoint } from '../utils/apiClient';
// Removed complex test execution imports - using simple server-side approach
const Navbar = ({ problemId }) => {
  const userData = useSelector((state) => state.auth.user)
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated)
  useEffect(() => {
    console.log('[Navbar] userData:', userData, 'isLoggedIn:', isLoggedIn);
  }, [userData, isLoggedIn]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If userData is null and user is not logged in, show loading for a short time
    if (userData === null && !isLoggedIn) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000); // 1s fallback
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [userData, isLoggedIn]);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const code = useSelector((state)=>state.code.code)
  const sampleTestCases = useSelector((state)=>state.code.sampleTestCases)
  const mainTestCases = useSelector((state)=>state.code.mainTestCases)
  const isLoading = useSelector((state)=>state.code.isLoading)
  const activeTab = useSelector((state)=>state.code.activeTab)

  const [showHamburgerMenu,setShowHamburgerMenu] = useState(false)

  useEffect(() => {
    if (showHamburgerMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showHamburgerMenu]);

  // Check if we're on the coding screen page
  const isCodingScreen = location.pathname.startsWith('/codingScreen/')

  // Simple server-side test execution
  const executeTests = async (code, testCases) => {
    try {
      console.log('Executing tests on server...');

      const response = await fetch(endpoint('/api/execute/code'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: code,
          testCases: testCases
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const results = await response.json();
      console.log('Server execution results:', results);

      return results;
    } catch (error) {
      console.error('Server execution failed:', error);
      return [{
        error: "Server Error",
        message: `Failed to execute code: ${error.message}`,
        pass: false
      }];
    }
  };

  // Simple input validation (server will handle execution)
  const validateInputs = (code, testCases) => {
    if (!code || code.trim() === '') {
      return { valid: false, error: "No Code", message: "Please write some code to test." };
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return { valid: false, error: "No Test Cases", message: "No test cases available to run." };
    }

    return { valid: true };
  };

  // All parsing logic removed - server handles everything

  // Function to save submission after successful test execution
  const saveSubmission = async (code, results, testType) => {
    try {
      if (!userData || !problemId) {
        console.log('Cannot save submission: missing user or problem data');
        return;
      }

      // Determine if submission is accepted (all tests passed)
      const hasErrors = results.some(test => test.error && !test.pass);
      const allPassed = results.every(test => test.pass) && !hasErrors && results.length > 0;
      const status = allPassed ? 'Accepted' : 'Wrong Answer';

      const submissionData = {
        userId: userData._id,
        problemId: problemId,
        code: code,
        status: status
      };

      console.log('Saving submission:', submissionData);

      const response = await fetch(endpoint('/api/submissions/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(`Failed to save submission: ${response.status}`);
      }

      const savedSubmission = await response.json();
      console.log('Submission saved successfully:', savedSubmission);
    } catch (error) {
      console.error('Error saving submission:', error);
    }
  };

  const handleRun = async () => {
    console.log('Run button clicked - switching to Results tab');

    // Immediately switch to results tab and set loading state
    dispatch(setActiveTab(2)); // Switch to Results tab first
    dispatch(setTestType('sample'));
    dispatch(setIsLoading(true));
    dispatch(setTestResults([])); // Clear previous results

    // Validate inputs
    const validation = validateInputs(code, sampleTestCases);
    if (!validation.valid) {
      dispatch(setTestResults([{
        error: validation.error,
        message: validation.message,
        pass: false
      }]));
      dispatch(setIsLoading(false));
      return;
    }

    try {
      // Execute tests on server
      const results = await executeTests(code, sampleTestCases);

      console.log('Sample test results:', results);

      dispatch(setTestResults(results));
    } catch (error) {
      console.error('Error in handleRun:', error);
      dispatch(setTestResults([{
        error: "Execution Error",
        message: error.message,
        pass: false
      }]));
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  const handleSubmit = async () => {
    console.log('Submit button clicked - switching to Results tab');

    // Immediately switch to results tab and set loading state
    dispatch(setActiveTab(2)); // Switch to Results tab first
    dispatch(setTestType('main'));
    dispatch(setIsLoading(true));
    dispatch(setTestResults([])); // Clear previous results

    // Validate inputs
    const validation = validateInputs(code, mainTestCases);
    if (!validation.valid) {
      dispatch(setTestResults([{
        error: validation.error,
        message: validation.message,
        pass: false
      }]));
      dispatch(setIsLoading(false));
      return;
    }

    try {
      // Execute tests on server
      const results = await executeTests(code, mainTestCases);

      console.log('Main test results:', results);

      dispatch(setTestResults(results));

      // Save submission after test execution (regardless of pass/fail)
      await saveSubmission(code, results, 'main');

      // Clear submissions cache to force refresh when submissions tab is viewed
      dispatch(clearSubmissions());

      // Check if all tests passed and show success toast
      const hasErrors = results.some(test => test.error && !test.pass);
      const allPassed = results.every(test => test.pass) && !hasErrors && results.length > 0;

      if (allPassed) {
        dispatch(setShowSuccessToast(true));
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorResults = [{
        error: "Execution Error",
        message: error.message,
        pass: false
      }];
      dispatch(setTestResults(errorResults));
      
      // Save submission even on error
      await saveSubmission(code, errorResults, 'main');

      // Clear submissions cache to force refresh when submissions tab is viewed
      dispatch(clearSubmissions());
    } finally {
      dispatch(setIsLoading(false));
    }
  }
  const NavbarMenu = ({className}) => {
  return (
    <ul className={className}>
      <li><Link to="/features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</Link></li>
      <li><Link to="/problems" style={{ textDecoration: 'none', color: 'inherit' }}>Problems</Link></li>
      <li>Blog</li>
    </ul>
  );
};

  return (
    <>
      <div className="navbar glass-effect">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo">
            <img className="FrontendLabs-logo" src={FrontendLabsLogo} alt="FrontendLabs Logo" />
            <p className="logo"><strong>FrontendLabs</strong></p>
          </div>
        </Link>

        {/* Conditionally render menu or coding buttons */}
        {isCodingScreen ? (
          <div className="navbar-buttons">
            <button onClick={handleRun} className="button button-white" disabled={isLoading}>
              {isLoading ? 'Running...' : 'Run'}
            </button>
            <button onClick={handleSubmit} className="button button-primary" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        ) : (
          <NavbarMenu className={'navbar-menu'}/>
        )}

        {loading ? (
          <div className={styles.userWelcome}><h2 className={styles.userWelcomeMessage}>Loading...</h2></div>
        ) : !isLoggedIn ? (
          <div className="navbar-buttons">
            <Link>
              <button onClick={()=>dispatch(setShowLogin(true))} className="button button-white">Login</button>
            </Link>
            <Link>
              <button onClick={()=>dispatch(setShowRegister(true))} className="button button-primary">Sign up</button>
            </Link>
          </div>
        ) : (
          userData && (
            <div className={styles.userWelcome}>
              <h2 className={styles.userWelcomeMessage}>
                Welcome, {userData.name && userData.name.split(' ')[0].charAt(0).toUpperCase() + userData.name.split(' ')[0].slice(1).toLowerCase()}
              </h2>
              <CgProfile
                className={styles.profileIcon}
                onClick={() => navigate('/profile')}
                title="View Profile"
              />
            </div>
          )
        )}
         <RxHamburgerMenu className="hamburger" onClick={()=>setShowHamburgerMenu((v)=>!v)}/>
          {showHamburgerMenu && (
            <div className="nav-dropdown">
              <IoCloseSharp className="nav-dropdown-close" onClick={()=>setShowHamburgerMenu(false)} />
              {isCodingScreen ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={()=>{handleRun(); setShowHamburgerMenu(false);}} 
                    className="button button-white" 
                    style={{ width: '100%' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Running...' : 'Run'}
                  </button>
                  <button 
                    onClick={()=>{handleSubmit(); setShowHamburgerMenu(false);}} 
                    className="button button-primary" 
                    style={{ width: '100%' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              ) : (
                <>
                  <NavbarMenu className={'nav-dropdown-menu'} />
                  {!isLoggedIn ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                      <button onClick={()=>{dispatch(setShowLogin(true)); setShowHamburgerMenu(false);}} className="button button-white" style={{ width: '100%' }}>Login</button>
                      <button onClick={()=>{dispatch(setShowRegister(true)); setShowHamburgerMenu(false);}} className="button button-primary" style={{ width: '100%' }}>Sign up</button>
                    </div>
                  ) : (
                    <button onClick={()=>{navigate('/profile'); setShowHamburgerMenu(false);}} className="button button-primary" style={{ width: '100%', marginTop: '12px' }}>Profile</button>
                  )}
                </>
              )}
            </div>
          )}
      </div>
    </>
  )
}

export default Navbar
