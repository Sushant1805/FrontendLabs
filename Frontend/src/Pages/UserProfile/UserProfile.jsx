import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, login } from '../../Components/Auth/authSlice';
import { FiUser, FiMail, FiEdit3, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { TbLockPassword } from 'react-icons/tb';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import axios from 'axios';
import styles from './UserProfile.module.css';

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.user);
    
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [mainError, setMainError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
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
            setIsEditing(false);
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (error) {
            console.error("Profile Update Failed:", error.response?.data?.msg || error.message);
            setMainError(error.response?.data?.msg || "Profile update failed. Try again.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );
            dispatch(logout());
            navigate('/');
        } catch (err) {
            console.error("Logout failed", err);
            alert("Logout failed");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileData({
            name: userData?.name || '',
            password: '',
        });
        setErrors({ name: '', password: '' });
        setMainError('');
        setSuccessMessage('');
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <button 
                        onClick={() => navigate(-1)} 
                        className={styles.backButton}
                    >
                        <FiArrowLeft /> Back
                    </button>
                    <h1>User Profile</h1>
                </div>

                <div className={styles.profileContent}>
                    {!isEditing ? (
                        // View Mode
                        <div className={styles.viewMode}>
                            <div className={styles.userInfo}>
                                <div className={styles.infoItem}>
                                    <FiUser className={styles.infoIcon} />
                                    <div>
                                        <label>Full Name</label>
                                        <p>{userData?.name}</p>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <FiMail className={styles.infoIcon} />
                                    <div>
                                        <label>Email</label>
                                        <p>{userData?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.actionButtons}>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className={`${styles.actionBtn} ${styles.editBtn}`}
                                >
                                    <FiEdit3 /> Edit Profile
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className={`${styles.actionBtn} ${styles.logoutBtn}`}
                                >
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Edit Mode
                        <form onSubmit={handleSubmit} className={styles.editForm}>
                            <div className={styles.inputGroup}>
                                <label>Full Name</label>
                                <div className={styles.inputWrapper}>
                                    <FiUser className={styles.inputIcon} />
                                    <input
                                        name="name"
                                        type="text"
                                        value={profileData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>New Password (optional)</label>
                                <div className={styles.inputWrapper}>
                                    <TbLockPassword className={styles.inputIcon} />
                                    <input
                                        name="password"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        value={profileData.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                    />
                                    {isPasswordVisible ? (
                                        <HiOutlineEyeOff
                                            className={styles.eyeIcon}
                                            onClick={() => setIsPasswordVisible(false)}
                                        />
                                    ) : (
                                        <HiOutlineEye
                                            className={styles.eyeIcon}
                                            onClick={() => setIsPasswordVisible(true)}
                                        />
                                    )}
                                </div>
                                {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
                            </div>

                            {mainError && <p className={styles.mainErrorMsg}>{mainError}</p>}
                            {successMessage && <p className={styles.successMsg}>{successMessage}</p>}

                            <div className={styles.formButtons}>
                                <button type="submit" className={`${styles.actionBtn} ${styles.saveBtn}`}>
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
