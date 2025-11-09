import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, login } from '../../Components/Auth/authSlice';
import { FiUser, FiMail, FiEdit3, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { TbLockPassword } from 'react-icons/tb';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import axios from 'axios';
import api, { endpoint } from '../../utils/apiClient';
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
            const response = await api.put('/api/auth/update-profile', updateData);

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
            await api.post('/api/auth/logout');
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
                        <FiArrowLeft />
                        <span>Back</span>
                    </button>
                </div>

                {!isEditing && (
                    <div className={styles.profileHero}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarCircle}>
                                <FiUser className={styles.avatarIcon} />
                            </div>
                            <div className={styles.userMeta}>
                                <h1 className={styles.userName}>{userData?.name}</h1>
                                <p className={styles.userEmail}>{userData?.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.profileContent}>
                    {!isEditing ? (
                        // View Mode
                        <div className={styles.viewMode}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoCard}>
                                    <div className={styles.cardHeader}>
                                        <FiUser className={styles.cardIcon} />
                                        <span className={styles.cardTitle}>Personal Information</span>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Full Name</span>
                                            <span className={styles.infoValue}>{userData?.name}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Email Address</span>
                                            <span className={styles.infoValue}>{userData?.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.actionButtons}>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className={`${styles.actionBtn} ${styles.editBtn}`}
                                >
                                    <FiEdit3 />
                                    <span>Edit Profile</span>
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className={`${styles.actionBtn} ${styles.logoutBtn}`}
                                >
                                    <FiLogOut />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Edit Mode
                        <div className={styles.editMode}>
                            <div className={styles.editHeader}>
                                <h2>Edit Profile</h2>
                                <p>Update your personal information</p>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.editForm}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Full Name</label>
                                    <div className={styles.inputWrapper}>
                                        <FiUser className={styles.inputIcon} />
                                        <input
                                            name="name"
                                            type="text"
                                            value={profileData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className={styles.modernInput}
                                        />
                                    </div>
                                    {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>New Password <span className={styles.optional}>(optional)</span></label>
                                    <div className={styles.inputWrapper}>
                                        <TbLockPassword className={styles.inputIcon} />
                                        <input
                                            name="password"
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            value={profileData.password}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            className={styles.modernInput}
                                        />
                                        <button
                                            type="button"
                                            className={styles.eyeButton}
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        >
                                            {isPasswordVisible ? (
                                                <HiOutlineEyeOff className={styles.eyeIcon} />
                                            ) : (
                                                <HiOutlineEye className={styles.eyeIcon} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
                                </div>

                                {mainError && <div className={styles.alertError}>{mainError}</div>}
                                {successMessage && <div className={styles.alertSuccess}>{successMessage}</div>}

                                <div className={styles.formActions}>
                                    <button 
                                        type="button" 
                                        onClick={handleCancel}
                                        className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className={`${styles.actionBtn} ${styles.saveBtn}`}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
