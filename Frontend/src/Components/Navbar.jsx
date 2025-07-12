import React from "react"
import { Link } from "react-router-dom"

const Navbar = ()=>{
    return(
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
                <div className="navbar-buttons">
                    <Link to={'/login'}>
                        <button className="button button-white">Login</button>
                    </Link>
                    <Link to={'/register'}>
                        <button className="button button-primary">Sign up</button>
                    </Link>
                </div>
            </div>
            
        </>
    )
}

export default Navbar