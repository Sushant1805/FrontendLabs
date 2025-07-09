import React from 'react'

const HeroSection = () => {
  return (
    <>  
        <div className='hero-section hero-section-animated'>
            <h1 className='hero-heading'><span>A New Way to Learn <span className='hero-frontend-text'>Frontend!</span></span> <span>Learn by Solving. Not Scrolling.</span></h1>
          
            <p className='hero-paragraph'>Skip the endless tutorials. Master React, JavaScript, and real UI logic through challenge-driven learning that forces you to think, build, and grow.</p>
            <div className="hero-buttons">
                <button className="button">Get Started</button>
                <button className="button button-purple">See Challenges</button>
            </div>
        </div>
        
    </>
  )
}

export default HeroSection