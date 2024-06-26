import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';
import '../assets/style/Navbar.css';
import renel_logo from '../assets/images/renel-gh-logo.jpg';

function Navbar() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [toHome, setToHome] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4000/logout');
            setUser(null);
            setToHome(true);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (toHome) {
        navigate('/');
    }

    return (
        <div className="template">
            <div className="logo-container">
                <img src={renel_logo} alt="Renel Ghana Foundation Logo" className="logo"/>
            </div>
            <div className="navbar">
                <div className="icons-left">
                    <Link to="/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c86b39" className="size-6">
                        <path
                            d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"/>
                        <path
                            d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"/>
                    </svg></Link>
                    <Link to="/inbox"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c86b39" className="size-6">
                        <path
                            d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"/>
                        <path
                            d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"/>
                    </svg></Link>
                    <Link to="/profile"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c86b39" className="size-6">
                        <path fillRule="evenodd"
                            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                            clipRule="evenodd"/>
                    </svg></Link>
                </div>
                <div className="icons-right">
                    <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
