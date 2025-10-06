import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import HeroBackground from '../Components/HeroBackground'
import { useSelector } from 'react-redux'
import Register from './Register'
import Login from './Login'


const LandingPage = () => {
  const RegisterModal = useSelector((state)=>state.modal.showRegisterModal)
  const LoginModal = useSelector((state)=>state.modal.showLoginModal)
  
  
  return (
    <div className='landing-page'>
      <HeroBackground />
      <div className='landing-foreground'>
        <Navbar />
        {RegisterModal && <Register/>}
        {LoginModal && <Login/>}
        <HeroSection />
      </div>
    </div>
  )
}

export default LandingPage
