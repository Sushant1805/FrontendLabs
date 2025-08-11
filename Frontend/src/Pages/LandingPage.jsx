import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import HeroBackground from '../Components/HeroBackground'
import { useSelector } from 'react-redux'
import Register from './Register'
import Login from './Login'
import { useNavigate } from 'react-router-dom'


const LandingPage = () => {
  const RegisterModal = useSelector((state)=>state.modal.showRegisterModal)
  const LoginModal = useSelector((state)=>state.modal.showLoginModal)
  
  
  return (
    <div className='landing-page' style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background goes here, behind */}
      <HeroBackground />

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        {RegisterModal && <Register/>}
        {LoginModal && <Login/>}

        <HeroSection />
      </div>
    </div>
  )
}

export default LandingPage
