import React from "react"

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
                    <button className="button">Login</button>
                    <button className="button button-purple">Sign up</button>
                </div>
            </div>
            
        </>
    )
}

export default Navbar