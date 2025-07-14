import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { Link } from 'react-router-dom';
import { MdOutlineEmail } from 'react-icons/md';
import { TbLockPassword } from 'react-icons/tb';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const LoginForm = () => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!Object.values(loginData).some((val) => val === '')) {
            console.log('Login Submitted', loginData);
            // Add login logic here
        }else{
            setmainError('Please enter valid Credentials')
        }
    };

    return (
        <main className={styles.registerForm}>
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
                            onChange={handleChange}
                            name="email"
                            className={styles.inputText}
                            id="login-email"
                            type="text"
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
            </form>
        </main>
    );
};

export default LoginForm;
