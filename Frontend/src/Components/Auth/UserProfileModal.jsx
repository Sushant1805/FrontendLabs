import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { MdOutlineEmail } from 'react-icons/md';
import { TbLockPassword } from 'react-icons/tb';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { FiUser, FiX } from 'react-icons/fi';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './authSlice';

const UserProfileModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.user);
    
    const [mainError, setMainError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        password: '',
    });
    const [profileData, setProfileData] = useState({
        name: userData?.name || '',
        password: '',
    });

    const validateInputs = (e) => {
        switch (e.target.name) {
            case 'name':
                return e.target.value.trim().length < 2
                    ? 'Name must be at least 2 characters'
                    : '';
            case 'password':
                return e.target.value !== '' && e.target.value.length < 6
                    ? 'Password must be at least 6 characters'
                    : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        setProfileData((prev) => ({
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
        setMainError('');
        setSuccessMessage('');

        // Check for validation errors
        const validationErrors = Object.values(errors).some(error => error !== '');
        if (validationErrors) {
            setMainError('Please fix the errors above');
            return;
        }

        // Prepare update data (only include changed fields)
        const updateData = {};
        if (profileData.name !== userData.name) updateData.name = profileData.name;
        if (profileData.password.trim() !== '') updateData.password = profileData.password;

        if (Object.keys(updateData).length === 0) {
            setMainError('No changes detected');
            return;
        }

        try {
            const response = await axios.put(
                'http://localhost:5000/api/auth/update-profile',
                updateData,
                {
                    withCredentials: true,
                }
            );

            console.log("Profile Updated:", response.data);
            
            // Update Redux state with new user data
            dispatch(login(response.data.user));
            
            setSuccessMessage('Profile updated successfully!');
            setProfileData(prev => ({ ...prev, password: '' })); // Clear password field
            
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 2000);

        } catch (error) {
            console.error("Profile Update Failed:", error.response?.data?.msg || error.message);
            setMainError(error.response?.data?.msg || "Profile update failed. Try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1100,
            display : "flex",
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center'
        
        }}>
            <div style={{ 
                backgroundColor: '#151516', 
                borderRadius: '20px', 
                padding: '2rem',
                position: 'relative',
                maxWidth: '400px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                display : "flex",
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center'
            }}>
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#999'
                    }}
                >
                    <FiX />
                </button>

                <div className={styles.registerForm} style={{ height: 'auto', backgroundColor: 'transparent',display : "flex",
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center' }}>
                    <header>
                        <h1>Edit Profile</h1>
                        <h2 className={styles.registerSubheading}>
                            Update your account information
                        </h2>
                    </header>

                    <form className={styles.registerFormFields} onSubmit={handleSubmit}>
                        <div className={styles.inputCell}>
                            <label className={styles.labels}>Full Name</label>
                            <div className={styles.inputGroup}>
                                <FiUser className={styles.inputIcon} />
                                <input
                                    name="name"
                                    type="text"
                                    value={profileData.name}
                                    onChange={handleChange}
                                    className={styles.inputText}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.name && <span className={styles.inputRequired}>{errors.name}</span>}
                        </div>

                        <div className={styles.inputCell}>
                            <label className={styles.labels}>Email Address</label>
                            <div className={styles.inputGroup}>
                                <MdOutlineEmail className={styles.inputIcon} />
                                <input
                                    name="email"
                                    type="email"
                                    value={userData?.email || ''}
                                    className={styles.inputText}
                                    placeholder="Enter your email"
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                />
                            </div>
                            <span style={{ fontSize: 'small', color: '#666' }}>Email cannot be changed</span>
                        </div>

                        <div className={styles.inputCell}>
                            <label className={styles.labels}>New Password (optional)</label>
                            <div className={styles.inputGroup}>
                                <TbLockPassword className={styles.inputIcon} />
                                <input
                                    name="password"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={profileData.password}
                                    onChange={handleChange}
                                    className={styles.inputText}
                                    placeholder="Enter new password"
                                />
                                {isPasswordVisible ? (
                                    <HiOutlineEyeOff
                                        className={styles.eyeOff}
                                        onClick={() => setIsPasswordVisible(false)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <HiOutlineEye
                                        className={styles.eyeOff}
                                        onClick={() => setIsPasswordVisible(true)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}
                            </div>
                            {errors.password && <span className={styles.inputRequired}>{errors.password}</span>}
                        </div>

                        {mainError && <span className={styles.inputRequired}>{mainError}</span>}
                        {successMessage && <span style={{ color: 'green', fontSize: 'small' }}>{successMessage}</span>}

                        <button type="submit" className="button button-primary">
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
