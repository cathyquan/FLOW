import React from 'react';
import SHEPGCCNavbar from "../components/SHEPGCCNavbar.jsx";

import '../assets/style/SHEPGCCHomePage.css';

import renel_logo from '../assets/images/renel-gh-logo.jpg';

function SHEPGCCInboxPage() {
    return(
        <div>
            <div className="App">
                <header className="header">
                    <div className="logo-container">
                        <img src={renel_logo} alt="Renel Ghana Foundation Logo" className="logo"/>
                    </div>
                    <div className="nav-div">
                        <SHEPGCCNavbar/>
                    </div>
                </header>
            </div>
            <div>
                <h2>INBOX PAGE</h2>
            </div>
        </div>
    )
}

export default SHEPGCCInboxPage;