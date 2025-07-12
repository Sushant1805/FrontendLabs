import React from 'react';
import styles from './RegisterForm.module.css';
import { Link } from 'react-router-dom';
import { BiUser } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

const RegisterForm = () => {
    return (
        <main className={styles.registerForm}>
            <header>
                <h1>Create your Account</h1>
                <h2 className={styles.registerSubheading}>
                    Enter your details to start using FrontendLabs
                </h2>
            </header>

            <form className={styles.registerFormFields}>
                <div className={styles.inputCell}>
                    <label className={styles.labels} htmlFor="register-email">
                        Name <span className={styles.inputRequired}>*</span>
                    </label>
                    <div className={styles.inputGroup}>
                        <BiUser className={styles.inputIcon} />
                        <input
                            className={styles.inputText}
                            id="register-name"
                            type="text"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>

            <div className={styles.inputCell}>
                <label className={styles.labels} htmlFor="register-email">
                    Email <span className={styles.inputRequired}>*</span>
                </label>
                <div className={styles.inputGroup}>
                    <MdOutlineEmail className={styles.inputIcon} />
                    <input
                        className={styles.inputText}
                        id="register-email"
                        type="text"
                        placeholder="Enter your email"
                    />
                </div>
</div>
<div className={styles.inputCell}>
                <label className={styles.labels} htmlFor="register-password">
                    Password <span className={styles.inputRequired}>*</span>
                </label>
                <div className={styles.inputGroup}>
                    <TbLockPassword className={styles.inputIcon} />
                    <input
                        className={styles.inputText}
                        id="register-password"
                        type="text"
                        placeholder="Enter your password"
                    />
                </div>
</div>
                <button className="button button-primary authbuttons">Sign Up</button>

                <h4 className={styles.alreadyText}>
                    Already have an account?
                    <Link to="/login">
                        <span className={styles.already}> Sign In</span>
                    </Link>
                </h4>
            </form>
        </main>
    );
};

export default RegisterForm;
