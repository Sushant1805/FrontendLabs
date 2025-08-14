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

  const [showHamburgerMenu,setShowHamburgerMenu] = useState(false)

  // Check if we're on the coding screen page
  const isCodingScreen = location.pathname.startsWith('/codingScreen/')

  const handleRun = () => {
    console.log('Run button clicked');
    // Add your run logic here
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
