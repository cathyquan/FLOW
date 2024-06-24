import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import '../assets/style/SHEPGCCProfilePage.css';
import Navbar from "../components/Navbar.jsx";

function SHEPGCCProfilePage() {
    const [showPopup, setShowPopup] = useState(false);
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [position, setPosition] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');

    const [tempPosition, setTempPosition] = useState('');
    const [tempName, setTempName] = useState('');
    const [tempPhone, setTempPhone] = useState('');
    const [tempEmail, setTempEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordStep, setPasswordStep] = useState(1);

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:4000/info', { withCredentials: true })
            .then(response => {
                const { email, name, userType: position, phone, id } = response.data;
                setPosition(position);
                setName(name);
                setPhone(phone);
                setEmail(email);
                setUserId(id);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }, []);

    const handleEditProfileClick = () => {
        setTempPosition(position);
        setTempName(name);
        setTempPhone(phone);
        setTempEmail(email);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        if (tempPosition !== position || tempName !== name || tempPhone !== phone || tempEmail !== email) {
            if (window.confirm("Are you sure you want to close? Your changes will not be saved.")) {
                setShowPopup(false);
            }
        } else {
            setShowPopup(false);
        }
    };

    const handleCloseChangePasswordPopup = () => {
        setShowChangePasswordPopup(false);
        setPasswordStep(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4000/updateProfile', {
            email: tempEmail,
            name: tempName,
            phone: tempPhone,
            position: tempPosition,
        }, { withCredentials: true })
            .then(response => {
                setPosition(tempPosition);
                setName(tempName);
                setPhone(tempPhone);
                setEmail(tempEmail);
                setShowPopup(false);
            })
            .catch(error => {
                console.error('Error updating profile:', error);
            });
    };

    const handleCheckCurrentPassword = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4000/checkPassword', { currentPassword }, { withCredentials: true })
            .then(response => {
                if (response.data.success) {
                    setPasswordStep(2);
                } else {
                    alert('Current password is incorrect.');
                }
            })
            .catch(error => {
                console.error('Error checking password:', error);
            });
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        axios.post('http://localhost:4000/changePassword', { newPassword }, { withCredentials: true })
            .then(response => {
                if (response.data.success) {
                    setShowChangePasswordPopup(false);
                    setPasswordStep(1);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                } else {
                    alert('Error changing password.');
                }
            })
            .catch(error => {
                console.error('Error changing password:', error);
            });
    };

    const handleDeleteProfile = async () => {
        if (position === 'admin') {
            alert('You cannot delete the admin account.');
            return;
        }

        const confirmed = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
        if (!confirmed) {
            return;
        }

        try {
            const response = await axios.delete('http://localhost:4000/deleteProfile', {
                data: { userId },
                withCredentials: true
            });

            if (response.data.message === 'User deleted successfully.') {
                setUser(null);  // Clear the user context
                navigate('/login');  // Redirect to login page
            } else {
                console.error(response.data.error);
            }
        } catch (error) {
            console.error('There was an error deleting the profile!', error);
        }
    };

    return (
        <div className="App">
            <header className="header">
                <Navbar />
            </header>
            <main className="main">
                <section className="profile-info">
                    <h1>Profile</h1>
                    <div className="profile-container">
                        <div className="profile-card">
                            <div className="profile-details">
                                <p><strong>Position:</strong> {position}</p>
                                <p><strong>Name:</strong> {name}</p>
                                <p><strong>Phone Number:</strong> {phone}</p>
                                <p><strong>Email Address:</strong> {email}</p>
                                <div className="profile-buttons">
                                    <button onClick={handleEditProfileClick}>Edit Profile</button>
                                    <button onClick={handleDeleteProfile}>Delete Profile</button>
                                    <button onClick={() => setShowChangePasswordPopup(true)}>Change Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup">
                            <h2>Edit Profile</h2>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Position:
                                    <input
                                        type="text"
                                        name="position"
                                        value={tempPosition}
                                        onChange={(e) => setTempPosition(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Phone Number:
                                    <input
                                        type="text"
                                        name="phone"
                                        value={tempPhone}
                                        onChange={(e) => setTempPhone(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Email Address:
                                    <input
                                        type="email"
                                        name="email"
                                        value={tempEmail}
                                        onChange={(e) => setTempEmail(e.target.value)}
                                    />
                                </label>
                                <div className="popup-buttons">
                                    <button type="button" onClick={handleClosePopup}>Close</button>
                                    <button type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showChangePasswordPopup && (
                    <div className="popup-overlay">
                        <div className="popup">
                            <h2>Change Password</h2>
                            {passwordStep === 1 ? (
                                <form onSubmit={handleCheckCurrentPassword}>
                                    <label>
                                        Current Password:
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <div className="popup-buttons">
                                        <button type="button" onClick={handleCloseChangePasswordPopup}>Close</button>
                                        <button type="submit">Next</button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleChangePassword}>
                                    <label>
                                        New Password:
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Confirm New Password:
                                        <input
                                            type="password"
                                            name="confirmNewPassword"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <div className="popup-buttons">
                                        <button type="button" onClick={handleCloseChangePasswordPopup}>Close</button>
                                        <button type="submit">Save</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default SHEPGCCProfilePage;