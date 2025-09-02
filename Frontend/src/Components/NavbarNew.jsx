import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../Pages/Auth/authSlice'
import { setTestResults, setTestType, setActiveTab, setShowSuccessToast } from '../Pages/CodingScreen/codeSlice'
import TestExecutor from '../utils/testExecutor'
import styles from './Navbar.module.css'

const Navbar = ({ problemId }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const code = useSelector((state) => state.code.code)
  const sampleTestCases = useSelector((state) => state.code.sampleTestCases)
  const mainTestCases = useSelector((state) => state.code.mainTestCases)

  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if we're on the coding screen page
  const isCodingScreen = location.pathname.startsWith('/codingScreen/')

  // Initialize test executor
  const testExecutor = new TestExecutor()

  // Detect problem type based on code content
  const detectProblemType = (code) => {
    if (code.includes('class ') && code.includes('constructor')) {
      return 'class'
    }
    if (code.includes('export default') || code.includes('module.exports')) {
      return 'module'
    }
    if (code.includes('function ')) {
      return 'function'
    }
    return 'function' // default
  }

  // Handle Run button click
  const handleRun = async () => {
    if (isRunning) return
    
    setIsRunning(true)
    console.log('Run button clicked')

    try {
      // Validate inputs
      if (!code || code.trim() === '') {
        dispatch(setTestResults([{
          error: "No Code",
          message: "Please write some code to test.",
          pass: false
        }]))
        dispatch(setTestType('sample'))
        dispatch(setActiveTab(2))
        return
      }

      if (!sampleTestCases || sampleTestCases.length === 0) {
        dispatch(setTestResults([{
          error: "No Test Cases",
          message: "No test cases available to run.",
          pass: false
        }]))
        dispatch(setTestType('sample'))
        dispatch(setActiveTab(2))
        return
      }

      // Detect problem type and execute tests
      const problemType = detectProblemType(code)
      console.log('Detected problem type:', problemType)

      const results = await testExecutor.executeTests(code, sampleTestCases, problemType, 'sample', problemId)
      console.log('Sample test results:', results)

      // Transform results to match your existing format
      const transformedResults = results.map((result, index) => ({
        input: result.input || sampleTestCases[index]?.input || `Test ${index + 1}`,
        expected: result.expected || sampleTestCases[index]?.expectedOutput || sampleTestCases[index]?.output || 'No expected output',
        // prefer structured received; fall back to error/raw
        received: result.received || (result.pass ? 'Correct' : (result.error || result.raw || 'Test failed')),
        pass: result.pass,
        error: result.error,
        failures: result.failures || [],
        raw: result.raw || ''
      }))

      dispatch(setTestResults(transformedResults))
      dispatch(setTestType('sample'))
      dispatch(setActiveTab(2)) // Switch to Results tab
    } catch (error) {
      console.error('Error running tests:', error)
      dispatch(setTestResults([{
        error: "Execution Error",
        message: error.message,
        pass: false
      }]))
      dispatch(setTestType('sample'))
      dispatch(setActiveTab(2))
    } finally {
      setIsRunning(false)
    }
  }

  // Handle Submit button click
  const handleSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    console.log('Submit button clicked')

    try {
      // Validate inputs
      if (!code || code.trim() === '') {
        dispatch(setTestResults([{
          error: "No Code",
          message: "Please write some code to submit.",
          pass: false
        }]))
        dispatch(setTestType('main'))
        dispatch(setActiveTab(2))
        return
      }

      if (!mainTestCases || mainTestCases.length === 0) {
        dispatch(setTestResults([{
          error: "No Test Cases",
          message: "No test cases available for submission.",
          pass: false
        }]))
        dispatch(setTestType('main'))
        dispatch(setActiveTab(2))
        return
      }

      // Detect problem type and execute tests
      const problemType = detectProblemType(code)
      console.log('Detected problem type:', problemType)

      const results = await testExecutor.executeTests(code, mainTestCases, problemType, 'main', problemId)
      console.log('Main test results:', results)

      // Transform results to match your existing format
      const transformedResults = results.map((result, index) => ({
        input: result.input || mainTestCases[index]?.input || `Test ${index + 1}`,
        expected: result.expected || mainTestCases[index]?.expectedOutput || mainTestCases[index]?.output || 'No expected output',
        received: result.received || (result.pass ? 'Correct' : result.error),
        pass: result.pass,
        error: result.error
      }))

      dispatch(setTestResults(transformedResults))
      dispatch(setTestType('main'))
      dispatch(setActiveTab(2)) // Switch to Results tab

      // Check if all tests passed and show success toast
      const hasErrors = transformedResults.some(test => test.error && !test.pass)
      const allPassed = transformedResults.every(test => test.pass) && !hasErrors && transformedResults.length > 0

      if (allPassed) {
        dispatch(setShowSuccessToast(true))
      }
    } catch (error) {
      console.error('Error submitting tests:', error)
      dispatch(setTestResults([{
        error: "Execution Error",
        message: error.message,
        pass: false
      }]))
      dispatch(setTestType('main'))
      dispatch(setActiveTab(2))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <div className={styles.navbarLogo}>
          <Link to="/" className={styles.logoLink}>
            Frontend<span className={styles.logoAccent}>Labs</span>
          </Link>
        </div>

        {/* Navigation Links - Hidden on coding screen */}
        {!isCodingScreen && (
          <div className={styles.navbarMenu}>
            <Link to="/problems" className={styles.navbarLink}>
              Problems
            </Link>
            <Link to="/about" className={styles.navbarLink}>
              About
            </Link>
            <Link to="/contact" className={styles.navbarLink}>
              Contact
            </Link>
          </div>
        )}

        {/* Coding Screen Actions */}
        {isCodingScreen && (
          <div className={styles.codingActions}>
            <button 
              className={`${styles.runButton} ${isRunning ? styles.loading : ''}`}
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button 
              className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}

        {/* User Actions */}
        <div className={styles.navbarActions}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>
                Welcome, {user?.username || 'User'}
              </span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginButton}>
                Login
              </Link>
              <Link to="/register" className={styles.registerButton}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className={styles.mobileMenuToggle}>
          <button
            className={styles.hamburger}
            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showHamburgerMenu && (
        <div className={styles.mobileMenu}>
          {!isCodingScreen && (
            <>
              <Link to="/problems" className={styles.mobileLink}>
                Problems
              </Link>
              <Link to="/about" className={styles.mobileLink}>
                About
              </Link>
              <Link to="/contact" className={styles.mobileLink}>
                Contact
              </Link>
            </>
          )}
          
          {!isLoggedIn ? (
            <>
              <Link to="/login" className={styles.mobileLink}>
                Login
              </Link>
              <Link to="/register" className={styles.mobileLink}>
                Sign Up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className={styles.mobileLink}>
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
