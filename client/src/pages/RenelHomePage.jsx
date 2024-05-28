import React from 'react';
import renel_logo from '../assets/images/renel_logo.png';
import '../assets/style/RenelHomePage.css';
import RenelNavBar from '../components/RenelNavbar.jsx';
// import {FaHome} from "react-icons/fa";
// import { FaHome, FaEnvelope, FaUser, FaSignOutAlt } from 'react-icons/fa';

function RenelHomePage() {

    return (
        <div className="renel-home-page">
            {/* this is the logo at the top of the page */}
            <div className="logo-div">
                <img src={renel_logo} alt="Renel Logo" className="responsive-image"/>
            </div>

            {/* this is the navigation bar */}
            <div className="nav-div">
                <RenelNavBar/>
            </div>

            {/* this is the main content of the page */}
            <div className="main-content-div">
                <div className="most-urgent">

                </div>
                <div className="all-schools-div">

                </div>
                <div className="manage-schools-div">

                </div>
                {/*<h1>Welcome to Renel's Home Page</h1>*/}
                {/*<p>This is a sample home page for Renel</p>*/}
            </div>
        </div>
    );
}

export default RenelHomePage;
