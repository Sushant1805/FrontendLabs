import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import HeroBackground from '../Components/HeroBackground'
import Features from './Features'
import Footer from '../Components/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setShowLogin, setRedirectAfterLogin } from '../Components/Auth/modalSlice'
import Register from './Register'
import Login from './Login'
import './HomePage.css'

const HomePage = () => {
  const RegisterModal = useSelector((state) => state.modal.showRegisterModal)
  const LoginModal = useSelector((state) => state.modal.showLoginModal)
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      {/* Page 1: Hero Section */}
      <div className='landing-page'>
        <HeroBackground />
        <div className='landing-foreground'>
          <Navbar />
          {RegisterModal && <Register />}
          {LoginModal && <Login />}
          <HeroSection />
        </div>
      </div>

      {/* Page 2: Features Section */}
      <Features />

      {/* Page 3: Call to Action Section */}
      <div className='cta-page'>
        <div className='cta-container'>
          <h1 className='cta-heading' data-aos="fade-up" data-aos-duration="1000">
            Ready to Start Your Journey?
          </h1>
          <p className='cta-subheading' data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            Join thousands of developers who are already mastering frontend development with FrontendLabs
          </p>
          
          <div className='cta-stats comparison-cards two-cards' data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
            <div className='comparison-card feature-card'>
              <div className='card-head'>
                <h4>FrontendLabs</h4>
                <span className='badge winner'>Recommended</span>
              </div>
              <ul className='feature-list'>
                <li>AI Assistant <span className='feature-icon success'>✅</span></li>
                <li>Curated Challenges <span className='feature-icon success'>✅</span></li>
                <li>Interactive Editor <span className='feature-icon success'>✅</span></li>
                <li>Detailed Editorials <span className='feature-icon success'>✅</span></li>
                <li>Community Support <span className='feature-icon success'>✅</span></li>
              </ul>
            </div>

            <div className='comparison-card feature-card other-card'>
              <div className='card-head'>
                <h4>Other Platforms</h4>
                <span className='badge muted'>Typical</span>
              </div>
              <ul className='feature-list'>
                <li>AI Assistant <span className='feature-icon fail'>❌</span></li>
                <li>Curated Challenges <span className='feature-icon fail'>❌</span></li>
                <li>Interactive Editor <span className='feature-icon success'>✅</span></li>
                <li>Detailed Editorials <span className='feature-icon fail'>❌</span></li>
                <li>Community Support <span className='feature-icon fail'>❌</span></li>
              </ul>
            </div>
          </div>

          <div className='cta-buttons' data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
            <button className="button button-white" onClick={()=>isLoggedIn? navigate('/problems') : dispatch(setShowLogin(true))}>Get Started</button>
            <button className="button button-primary" onClick={()=>{
              if(isLoggedIn) {
                navigate('/problems');
              } else {
                dispatch(setRedirectAfterLogin('/problems'));
                dispatch(setShowLogin(true));
              }
            }}>See Challenges</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  )
}

export default HomePage 