import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import styles from './Navbar.module.css'
import { CgProfile } from "react-icons/cg"
import { useSelector, useDispatch } from "react-redux"
import { setShowRegister,setShowLogin } from "./Auth/modalSlice"
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
import FrontendLabsLogo from '../assets/FrontendLabs.png';
const Navbar = () => {
  const userData = useSelector((state) => state.auth.user)
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const code = useSelector((state)=>state.code.code)
  const testCases = useSelector((state)=>state.code.testCases)

  const [showHamburgerMenu,setShowHamburgerMenu] = useState(false)

  // Check if we're on the coding screen page
  const isCodingScreen = location.pathname.startsWith('/codingScreen/')
  function runTests(code, testCases) {
  const results = [];
  try {
    const userFn = new Function(code + "; return " + code.match(/function\s+(\w+)/)[1] + ";")();

    for (const testCase of testCases) {
      let result;
      try {
        // Parse the string input into actual arguments
        const parsedInput = parseTestInput(testCase.input);
        // Parse the string output into actual expected value
        const parsedOutput = JSON.parse(testCase.output);
        
        result = userFn(...parsedInput);
        results.push({
          input: testCase.input,  // Keep original string for display
          expected: testCase.output,  // Keep original string for display
          received: result,
          pass: JSON.stringify(result) === JSON.stringify(parsedOutput)
        });
      } catch (err) {
        results.push({
          input: testCase.input,
          expected: testCase.output,
          received: String(err),
          pass: false
        });
      }
    }
  } catch (err) {
    return [{ error: "Compilation Error", message: err.message }];
  }
  return results;
}

// Helper function to parse input string
function parseTestInput(inputString) {
  try {
    const args = [];
    
    // Split by parameter assignments, but preserve quoted strings and arrays/objects
    const parts = smartSplit(inputString);
    
    parts.forEach(part => {
      const equalIndex = part.indexOf('=');
      if (equalIndex > 0) {
        const value = part.substring(equalIndex + 1).trim();
        args.push(intelligentParse(value));
      }
    });
    
    return args;
  } catch (err) {
    console.error('Error parsing input:', inputString, err);
    return [];
  }
}

function smartSplit(str) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  let bracketDepth = 0;
  let braceDepth = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];
    
    if (!inQuotes) {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
      } else if (char === '[') {
        bracketDepth++;
      } else if (char === ']') {
        bracketDepth--;
      } else if (char === '{') {
        braceDepth++;
      } else if (char === '}') {
        braceDepth--;
      } else if (char === ',' && bracketDepth === 0 && braceDepth === 0) {
        // Check if next part starts with parameter assignment
        const remaining = str.substring(i + 1).trim();
        if (remaining.match(/^\w+\s*=/)) {
          parts.push(current.trim());
          current = '';
          continue;
        }
      }
    } else {
      if (char === quoteChar && str[i - 1] !== '\\') {
        inQuotes = false;
        quoteChar = '';
      }
    }
    
    current += char;
  }
  
  if (current.trim()) {
    parts.push(current.trim());
  }
  
  return parts;
}

function intelligentParse(value) {
  const trimmed = value.trim();
  
  // Handle arrays
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  
  // Handle objects
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  
  // Handle quoted strings
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }
  
  // Handle numbers
  if (!isNaN(trimmed) && trimmed !== '') {
    return parseFloat(trimmed);
  }
  
  // Handle booleans
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  
  // Return as string
  return trimmed;
}

  const handleRun = () => {
    console.log('Run button clicked');
    const result = runTests(code,testCases)
    console.log(result)
  }

  const handleSubmit = () => {
    console.log('Submit button clicked');
    // Add your submit logic here
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
            <button onClick={handleRun} className="button button-white">Run</button>
            <button onClick={handleSubmit} className="button button-primary">Submit</button>
          </div>
        ) : (
          <NavbarMenu className={'navbar-menu'}/>
        )}

        {!isLoggedIn ? (
          <div className="navbar-buttons">
            <Link>
              <button onClick={()=>dispatch(setShowLogin(true))} className="button button-white">Login</button>
            </Link>
            <Link>
              <button onClick={()=>dispatch(setShowRegister(true))} className="button button-primary">Sign up</button>
            </Link>
          </div>
        ) : (
          <div className={styles.userWelcome}>
            <h2 className={styles.userWelcomeMessage}>Welcome, {userData.name}</h2>
            <CgProfile
              className={styles.profileIcon}
              onClick={() => navigate('/profile')}
              title="View Profile"
            />
          </div>
        )}
         <RxHamburgerMenu className="hamburger" onClick={()=>setShowHamburgerMenu(true)}/>
          {
            showHamburgerMenu && <div className="hamburger-menu">
              <IoCloseSharp className="hamburger-close"onClick={()=>setShowHamburgerMenu((prev)=>!prev)} />
              {isCodingScreen ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                  <button onClick={handleRun} className="button button-white">Run</button>
                  <button onClick={handleSubmit} className="button button-primary">Submit</button>
                </div>
              ) : (
                <NavbarMenu className={'hamburgerNavMenu'}/>
              )}
            </div>
          }
      </div>
    </>
  )
}

export default Navbar
