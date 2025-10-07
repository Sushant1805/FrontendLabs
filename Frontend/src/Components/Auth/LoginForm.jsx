import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { MdOutlineEmail } from 'react-icons/md';
import { TbLockPassword } from 'react-icons/tb';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {login} from './authSlice'
import { IoMdClose } from "react-icons/io";
import { setShowLogin, setRedirectAfterLogin } from './modalSlice';

const LoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const redirectAfterLogin = useSelector((state) => state.modal.redirectAfterLogin);
    const [mainError, setmainError] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const validateInputs = (e) => {
        switch (e.target.name) {
            case 'email':
                return !e.target.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
                    ? 'Please Enter Correct Email Address'
                    : '';
            case 'password':
                return e.target.value.trim() === ''
                    ? 'Please enter your password'
                    : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        setLoginData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        setErrors((prev) => ({
            ...prev,
            [e.target.name]: validateInputs(e),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setmainError('');

        const hasEmptyField = Object.values(loginData).some((val) => val === '');
        if (hasEmptyField) {
            setmainError('Please enter valid Credentials');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                loginData,
                {
                    withCredentials: true, // ⬅️ Send cookie from server
                }
            );

            console.log("Login Successful:", response.data);

            // Fetch user profile after login
            const res = await fetch("http://localhost:5000/api/auth/user-profile", {
                method: "GET",
                credentials: "include", // <- VERY IMPORTANT to include cookies
            });

            const data = await res.json();
            console.log("User Data:", data.user); // <== Should see { user: { ... } }
            dispatch(login(data.user))

            // Reset login form
            setLoginData({
                email: '',
                password: '',
            });
            dispatch(setShowLogin(false));

            // Handle redirect after login
            if (redirectAfterLogin) {
                navigate(redirectAfterLogin);
                dispatch(setRedirectAfterLogin(null)); // Clear the redirect
            }
        } catch (error) {
            console.error("Login Failed:", error.response?.data?.msg || error.message);
            setmainError(error.response?.data?.msg || "Login failed. Try again.");
        }
    };


    return (
        <div className={styles.mainRegisterDiv}>
        <main className={styles.registerForm}>
            <IoMdClose onClick={()=>dispatch(setShowLogin(false))} className={styles.closeButton}/>
            <header>
                <h1>Welcome Back</h1>
                <h2 className={styles.registerSubheading}>
                    Enter your credentials to log in
                </h2>
            </header>
            <form onSubmit={handleSubmit} className={styles.registerFormFields}>
                <div className={styles.inputCell}>
                    <label className={styles.labels} htmlFor="login-email">
                        Email <span className={styles.inputRequired}>*</span>
                    </label>
                    <div className={styles.inputGroup}>
                        <MdOutlineEmail className={styles.inputIcon} />
                        <input
                            value={loginData.email}
                            onChange={handleChange}
                            name="email"
                            className={styles.inputText}
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>
                    <p className={styles.errorMsg}>{errors.email}</p>
                </div>
                <div className={styles.inputCell}>
                    <label className={styles.labels} htmlFor="login-password">
                        Password <span className={styles.inputRequired}>*</span>
                    </label>
                    <div className={styles.inputGroup}>
                        <TbLockPassword className={styles.inputIcon} />
                        <input
                            value={loginData.password}
                            onChange={handleChange}
                            name="password"
                            className={styles.inputText}
                            id="login-password"
                            type={!isPasswordVisible ? 'password' : 'text'}
                            placeholder="Enter your password"
                        />
                        {!isPasswordVisible ? (
                            <HiOutlineEye
                                className={styles.eyeOff}
                                onClick={() => setIsPasswordVisible(true)}
                            />
                        ) : (
                            <HiOutlineEyeOff
                                className={styles.eyeOff}
                                onClick={() => setIsPasswordVisible(false)}
                            />
                        )}
                    </div>
                    <p className={styles.errorMsg}>{errors.password}</p>
                </div>
                {mainError && <p className={styles.mainErrorMsg}>{mainError}</p>}
                <button type="submit" className="button button-primary authbuttons">
                    Log In
                </button>
                <h4 className={styles.alreadyText}>
                    Don't have an account?
                    <Link to="/register">
                        <span className={styles.already}> Sign Up</span>
                    </Link>
                </h4>
                                <button
                                    type="button"
                                    onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                                    className={styles.googleAuthBtn}
                                >
                                    <FcGoogle className={styles.googleIcon} />
                                    Continue with Google
                                </button>
            </form>
        </main>
        </div>
    );
};

export default LoginForm;
