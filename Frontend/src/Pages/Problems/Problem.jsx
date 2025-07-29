import React from 'react'
import Navbar from '../../Components/Navbar'
import StaticBackground from './Components/StaticBackground'
import { useSelector } from 'react-redux'
import Register from '../Register'
import Login from '../Login'
import styles from './Problems.module.css'
import data from './data'
import ProblemsCard from './Components/ProblemsCard'
import { PiSortAscendingLight } from "react-icons/pi";
const Problems = () => {
    const RegisterModal = useSelector((state) => state.modal.showRegisterModal)
    const LoginModal = useSelector((state) => state.modal.showLoginModal)
    const problem = data[0];
    console.log(problem)
   

    return (
        <div className={styles.problemsPage}>
            {/* Background goes here, behind */}
            <StaticBackground />

            {/* Foreground content */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                <Navbar />
                {RegisterModal && <Register />}
                {LoginModal && <Login />}

                {/* Problems Content */}
                <div className={styles.problemsContent}>
                    <div className={styles.problemsContainer}>
                        <header style={{ color: 'var(--primary-color)' }}>
                            <h1>Problems</h1>
                        </header>
                        <div
                            className={styles.problemsWrapper}
                            onWheel={(e) => {
                                // Ensure the scroll happens on the wrapper
                                e.currentTarget.scrollTop += e.deltaY;
                            }}
                        >
                            {
                                data.map((item, index) => {
                                    return (
                                        <ProblemsCard problem={item} index={index}/>
                                    )
                                })

                                
                            }
                        </div>
                    </div>
                    <div className={styles.filtersContainer}>
                        <header>
                            <h1>Filters</h1>
                        </header>
                        <section className={styles.filtersSection}>
                            <div className={styles.filterSearch}>
                                <h3 className={styles.filterText}>Search Problem: </h3>
                                <input className={styles.filterSearchInput} type="text" name="problemName" id="" placeholder='Enter Problem Name'/>
                            </div>

                            <div className={styles.filterSortBy}>
                                <div className={styles.filterSortByHeader}>
                                    <h3 className={styles.filterText}>Sort By</h3>
                                    <PiSortAscendingLight/>
                                </div>
                                <div className={styles.filterSortByOptions}>
                                    <div className={styles.filterSortByDificulty}>
                                        <h3 className={styles.filterText}>Dificulty</h3>
                                    <select name="" id="">
                                            <option>{"Easy -> Hard"}</option>
                                            <option>{"Hard -> Easy"}</option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Problems
