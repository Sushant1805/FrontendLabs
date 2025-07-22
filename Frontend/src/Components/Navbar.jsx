import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import styles from './Navbar.module.css'
import { RiArrowDownSLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useSelector } from "react-redux";
const Navbar = () => {
    const userData = useSelector((state)=>state.auth.user);
    const isLoggedIn = useSelector((state)=>state.auth.isAuthenticated)
    const [showUserWelcomeModal, setshowUserWelcomeModal] = useState(false)
    console.log(userData);
    return (
        <>
            <div className="navbar glass-effect">
                <div className="logo">
                    <img className="FrontendLabs-logo" src="./src/assets/FrontendLabs.png" alt="FrontendLabs Logo" />
                    <p className="logo"><strong>FrontendLabs</strong></p>
                </div>
                <ul className="navbar-menu">
                    <li>About</li>
                    <li>Features</li>
                    <li>Blog</li>
                </ul>
                {!isLoggedIn ? <div className="navbar-buttons">
                    <Link to={'/login'}>
                        <button className="button button-white">Login</button>
                    </Link>
                    <Link to={'/register'}>
                        <button className="button button-primary">Sign up</button>
                    </Link>
                </div> :
                    <div className={styles.userWelcome}>
                        <h2 className={styles.userWelcomeMessage}>Welcome, {userData.name}</h2>
                        <RiArrowDownSLine onClick={() => setshowUserWelcomeModal(!showUserWelcomeModal)} />
                        {showUserWelcomeModal && <div className={styles.userWelcomeModal}>
                            <div className={styles.userWelcomeModelOptions}>
                                <CgProfile  />
                                <Link style={{color:"white"}}>Profile</Link>
                            </div>
                            <div className={styles.userWelcomeModelOptions}>
                                <RiLogoutCircleRLine  />
                                <Link style={{color:"red"}} >Logout</Link>
                            </div>


                        </div>}
                    </div>}
            </div>

        </>
    )
}

export default Navbar