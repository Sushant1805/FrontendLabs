import React, { useState } from "react"
import { Link } from "react-router-dom"
import styles from './Navbar.module.css'
import { RiArrowDownSLine } from "react-icons/ri"
import { CgProfile } from "react-icons/cg"
import { RiLogoutCircleRLine } from "react-icons/ri"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { logout } from "./Auth/authSlice"
import UserProfileModal from "./Auth/UserProfileModal"
import { setShowRegister,setShowLogin } from "./Auth/modalSlice"
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
const Navbar = () => {
  const userData = useSelector((state) => state.auth.user)
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated)
  const dispatch = useDispatch()
  const [showUserWelcomeModal, setshowUserWelcomeModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showHamburgerMenu,setShowHamburgerMenu] = useState(false)
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true, // ✅ ensure cookie is sent
        }
      )
      dispatch(logout()) // ✅ update Redux state
    } catch (err) {
      console.error("Logout failed", err)
      alert("Logout failed")
    }
  }
  const NavbarMenu = ({className}) => {
  return (
    <ul className={className}>
      <li>About</li>
      <li>Features</li>
      <li>Blog</li>
    </ul>
  );
};
  return (
    <>
      <div className="navbar glass-effect">
        <div className="logo">
          <img className="FrontendLabs-logo" src="./src/assets/FrontendLabs.png" alt="FrontendLabs Logo" />
          <p className="logo"><strong>FrontendLabs</strong></p>
        </div>
       
       <NavbarMenu className={'navbar-menu'}/>
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
            <RiArrowDownSLine onClick={() => setshowUserWelcomeModal(!showUserWelcomeModal)} />
            {showUserWelcomeModal && (
              <div className={styles.userWelcomeModal}>
                <div className={styles.userWelcomeModelOptions} onClick={() => {
                  setShowProfileModal(true)
                  setshowUserWelcomeModal(false)
                }}>
                  <CgProfile />
                  <span style={{ color: "white", cursor: "pointer" }}>Profile</span>
                </div>
                <div
                  className={styles.userWelcomeModelOptions}
                  onClick={handleLogout}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  <RiLogoutCircleRLine />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        )}
         <RxHamburgerMenu className="hamburger" onClick={()=>setShowHamburgerMenu(true)}/>
          {
            showHamburgerMenu && <div className="hamburger-menu">
              <IoCloseSharp className="hamburger-close"onClick={()=>setShowHamburgerMenu((prev)=>!prev)} />
              <NavbarMenu className={'hamburgerNavMenu'}/>
            </div>
          }
      </div>
      
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  )
}

export default Navbar
