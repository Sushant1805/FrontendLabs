import React, {useEffect} from 'react'
import LandingPage from './Pages/LandingPage'
import Features from './Pages/Features'
import Lenis from '@studio-freight/lenis';




const App = () => {
  useEffect(() => {
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
  }, []);

  return (
    <>
    
    <LandingPage/>
    <Features/>
    </>
  )
}

export default App