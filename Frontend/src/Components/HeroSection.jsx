import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setShowLogin } from './Auth/modalSlice';
const HeroSection = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated)
  const dispatch = useDispatch();
  return (
    <>  
        <div className='hero-section hero-section-animated'>
            <h1 className='hero-heading'><span>A New Way to Learn <span className='hero-frontend-text'>Frontend!</span></span> <span>Learn by Solving. Not Scrolling.</span></h1>
          
            <p className='hero-paragraph'>Skip the endless tutorials. Master React, JavaScript, and real UI logic through challenge-driven learning that forces you to think, build, and grow.</p>
            <div className="hero-buttons">
                <button className="button button-white" onClick={()=>isLoggedIn? navigate('/problems') : dispatch(setShowLogin(true))}>Get Started</button>
                <button className="button button-primary" onClick={()=>navigate('/problems')}>See Challenges</button>
            </div>
        </div>
        
    </>
  )
}

export default HeroSection