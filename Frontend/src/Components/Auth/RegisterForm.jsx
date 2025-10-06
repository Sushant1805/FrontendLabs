import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { BiUser } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { HiOutlineEye } from "react-icons/hi";
import { HiOutlineEyeOff } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { setShowRegister } from './modalSlice';
import { useDispatch } from 'react-redux';

const RegisterForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [mainError, setmainError] = useState('')
    const [isPasswordVisible, setisPasswordVisible] = useState(false)
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const validateInputs = (e) => {
        switch (e.target.name) {
            case 'name':
                return ((e.target.value.length === 0 || e.target.value === '') && 'Please Enter your name');
            case 'email':
                return (!(e.target.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)) ? 'Please Enter Correct Email Address' : '')
            case 'password':
                return (!(e.target.value.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
                )) ? "Weak password: add letter, number & symbol." : ''
                )

        }
    }
    const handleChange = (e) => {
        setUserData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })

        setErrors((prev) => {
            return {
                ...prev,
                [e.target.name]: validateInputs(e)
            }
        })

    }
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!Object.values(userData).some(val => val === '')) {
            console.log("Form Submitted", userData);
            axios.post('http://localhost:5000/api/auth/register',userData)
            .then((res)=>{
                console.log(res)
                navigate('/login');         
            })
            .catch(err=>console.log(err))
            setUserData({
                name: '',
                email: '',
                password: ''
            })
        } else {
            setmainError('Please enter Valid Details!')
        }

    }
    return (
        <div className={styles.mainRegisterDiv}>

        
        <main className={styles.registerForm}>
            <IoMdClose onClick={()=>dispatch(setShowRegister(false))} className={styles.closeButton}/>
            <header>
                <h1>Create your Account</h1>
                <h2 className={styles.registerSubheading}>
                    Enter your details to start using FrontendLabs
                </h2>
            </header>

            <form onSubmit={handleSubmit} className={styles.registerFormFields}>
                <div className={styles.inputCell}>
                    <label className={styles.labels} htmlFor="register-name">
                        Name <span className={styles.inputRequired}>*</span>
                    </label>
                    <div className={styles.inputGroup}>
                        <BiUser className={styles.inputIcon} />
                        <input
                            value={userData.name}
                            onChange={handleChange}
                            name="name"
                            className={styles.inputText}
                            id="register-name"
                            type="text"
                            placeholder="Enter your name"
                        />
                    </div>
                    <p className={styles.errorMsg}>{errors.name}</p>
                </div>
                <div className={styles.inputCell}>
                    <label className={styles.labels} htmlFor="register-email">
                        Email <span className={styles.inputRequired}>*</span>
                    </label>
                    <div className={styles.inputGroup}>
                        <MdOutlineEmail className={styles.inputIcon} />
                        <input
                            value={userData.email}
                            onChange={handleChange}
                            name="email"
                            className={styles.inputText}
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>
                    <p className={styles.errorMsg}>{errors.email}</p>
                </div>
                <div className={styles.inputCell}>
                    <label className={styles.labels} htmlFor="register-password">
                        Password <span className={styles.inputRequired}>*</span>
                    </label>
                    <div className={styles.inputGroup}>
                        <TbLockPassword className={styles.inputIcon} />
                        <input
                            value={userData.password}
                            onChange={handleChange}
                            name="password"
                            className={styles.inputText}
                            id="register-password"
                            type={!isPasswordVisible ? "password" : "text"}
                            placeholder="Enter your password"
                        />
                        {!isPasswordVisible ? <HiOutlineEye className={styles.eyeOff} onClick={() => setisPasswordVisible(true)} /> : <HiOutlineEyeOff className={styles.eyeOff} onClick={() => setisPasswordVisible(false)} />
                        }
                    </div>
                    <p className={styles.errorMsg}>{errors.password}</p>
                </div>
                {mainError && <p className={styles.mainErrorMsg}>{mainError}</p>}
                <button type="submit" className="button button-primary authbuttons">Sign Up</button>
                <h4 className={styles.alreadyText}>
                    Already have an account?
                    <Link to="/login">
                        <span className={styles.already}> Sign In</span>
                    </Link>
                </h4>
                                <button
                                    type="button"
                                    onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                                    style={{
                                        marginTop: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                        background: '#181818',
                                        color: '#fff',
                                        border: '1px solid #444',
                                        borderRadius: '2rem',
                                        padding: '0.5rem 1.5rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                    className="google-auth-btn"
                                >
                                    <FcGoogle style={{ width: '28px', height: '28px', marginRight: '16px', background: '#fff', borderRadius: '50%', padding: '2px' }} />
                                    Continue with Google
                                </button>
            </form>
        </main>
        </div>
    );
};

export default RegisterForm;
