import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/SHEPGCCProfilePage.css';
import renel_logo from '../assets/images/renel-gh-logo.jpg';
import profile_pic from '../assets/images/ama-kofi-profile.png';
import Navbar from "../components/Navbar.jsx";

function SHEPGCCProfilePage() {
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [tempPosition, setTempPosition] = useState('');
    const [tempName, setTempName] = useState('');
    const [tempPhone, setTempPhone] = useState('');
    const [tempEmail, setTempEmail] = useState('');

    useEffect(() => {
        axios.get('http://localhost:4000/profile', { withCredentials: true })
            .then(response => {
                const { email, name, userType: position, phone } = response.data;
                setPosition(position);
                setName(name);
                setPhone(phone);
                setEmail(email);
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
                                    <button>Delete Profile</button>
                                </div>
                            </div>
                            <div className="profile-image">
                                <img src={profile_pic} alt="Profile" />
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
            </main>
        </div>
    );
}

export default SHEPGCCProfilePage;
