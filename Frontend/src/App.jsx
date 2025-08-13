import React, {useEffect} from 'react'
import HomePage from './Pages/HomePage'
import Lenis from '@studio-freight/lenis';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Routes,Route} from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import { useDispatch } from 'react-redux'
import {loadUser} from '../src/Components/Auth/authThunk'
import Problems from './Pages/Problems/Problem';
import CodingScreen from './Pages/CodingScreen/CodingScreen';



const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])
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
      <Route path='/' element={<HomePage/>}/>
      <Route path='/problems' element={<Problems/>}/>
      <Route path='/codingScreen/:id' element={<CodingScreen/>}/>
     

    </Routes>
    
    </>
  )
}

export default App