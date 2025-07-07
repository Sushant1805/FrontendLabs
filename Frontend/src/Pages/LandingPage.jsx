import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import HeroBackground from '../Components/HeroBackground'

const LandingPage = () => {
  return (
    <div className='landing-page' style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background goes here, behind */}
      <HeroBackground />

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        <HeroSection />
      </div>
    </div>
    
  )
}

export default LandingPage
