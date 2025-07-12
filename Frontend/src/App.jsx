import React, {useEffect} from 'react'
import LandingPage from './Pages/LandingPage'
import Features from './Pages/Features'
import Lenis from '@studio-freight/lenis';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Routes,Route} from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'




const App = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
    });

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
    <Routes>
      <Route path='/' element={
        <>
            <LandingPage/>
            <Features/>
        </>
      }/>

      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>

    </Routes>
    
    </>
  )
}

export default App