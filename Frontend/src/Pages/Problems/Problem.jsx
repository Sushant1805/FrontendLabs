import React from 'react'
import Navbar from '../../Components/Navbar'
import StaticBackground from './Components/StaticBackground'
import { useSelector } from 'react-redux'
import Register from '../Register'
import Login from '../Login'
import styles from './Problems.module.css'
import data from './data'
const Problems = () => {
    const RegisterModal = useSelector((state) => state.modal.showRegisterModal)
    const LoginModal = useSelector((state) => state.modal.showLoginModal)

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
                        
                        <table className={styles.problemsTable}>
                            <thead>
                                <tr className={styles.problemsTableHeadings}>
                                    <th>No.</th>
                                    <th>Problem</th>
                                    <th>Dificulty</th>
                                    <th>Status</th>
                                    <th>Solve</th>
                                </tr>
                            </thead>
                            <div className={styles.tableBodyWrapper}>
                            <tbody className={styles.problemTableBody}>
                                {
                                    data.map((item, index) => {
                                        return (
                                            <tr key={index} className={styles.problemTableRows}>
                                                <td style={{width:'5%'}}>{item['No.']}</td>
                                                <td style={{width:'35%'}}>{item.Problem}</td>
                                                <td style={{width:'15%'}}>
                                                    <h1 className={styles.Difficulty}
                                                    style={{
                                                        backgroundColor : item.Difficulty === 'Easy' ? '#D4D925' :
                                                        item.Difficulty === 'Medium' ? '#FF5B00' : '#990000',
                                                    }}>{item.Difficulty}</h1>
                                                </td>
                                                <td 
                                                    style={
                                                        {
                                                            width:'15%',
                                                            color : item.Status === 'Solved' ? '#D4D925' :
                                                            item.Status === 'Attempted' ? '#FF5B00' : '#990000'

                                                        }
                                                    }>
                                                    {item.Status}
                                                    </td>
                                                <td style={{width:'20%'}} ><input  className="button button-primary"type="button" value="Solve" /></td>
                                            </tr>
                                        )
                                    })
                                }


                            </tbody>
                            </div>
                        </table>
                    </div>
                    <div className={styles.filtersContainer}>
                        <header>
                            <h1>Filters</h1>
                        </header>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Problems
