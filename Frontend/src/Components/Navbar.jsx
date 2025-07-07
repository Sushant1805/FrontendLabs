import React from "react"

const Navbar = ()=>{
    return(
        <>
            <div className="navbar glass-effect">
                <p className="logo"><strong>FrontendLabs</strong></p>
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