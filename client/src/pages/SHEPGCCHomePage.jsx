import React from 'react';
import '../assets/style/SHEPGCCHomePage.css';
import renel_logo from '../assets/images/renel-gh-logo.jpg';
import gcc from '../assets/images/ama-kofi-profile.png';
import shep from '../assets/images/akosua-mensah-profile.png';
import SHEPGCCNavbar from "../components/SHEPGCCNavbar.jsx";

function SHEPGCCHomePage() {
    return (
        <div className="App">
            <header className="header">
                <div className="logo-container">
                    <img src={renel_logo} alt="Renel Ghana Foundation Logo" className="logo"/>
                </div>
                <div className="navbar">
                    <SHEPGCCNavbar/>
                </div>
            </header>
            <main className="main">
                <section className="school-info">
                    <h1>School A</h1>
                    <div className="info-grade-container">
                        <div className="info-container">
                            <div className="contact-info">
                                <div className="contact-card">
                                    <img src={gcc} alt="Akosua Mensah"/>
                                    <div>
                                        <h2>GCC</h2>
                                        <h3>Akosua Mensah</h3>
                                        <p>+233 00-000-0000</p>
                                        <p>randomemail@gmail.com</p>
                                    </div>
                                </div>
                                <br></br>
                                <div className="contact-card">
                                    <img src={shep} alt="Ama Kofi"/>
                                    <div>
                                        <h2>SHEP</h2>
                                        <h3>Ama Kofi</h3>
                                        <p>+233 00-000-0000</p>
                                        <p>randomemail@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chart-container">
                                <div className="chart">
                                    {/* Chart will go here */}
                                </div>
                                <div className="buttons">
                                    <button>Add Grade</button>
                                    <br></br>
                                    <button>Delete Grade</button>
                                </div>
                            </div>
                        </div>
                        <div className="grade-list">
                            <button>1st Grade</button>
                            <button>2nd Grade</button>
                            <button>3rd Grade</button>
                            <button>4th Grade</button>
                            <button>5th Grade</button>
                            <button>6th Grade</button>
                            <button>7th Grade</button>
                            <button>8th Grade</button>
                            <button>9th Grade</button>
                            <button>10th Grade</button>
                            <button>11th Grade</button>
                            <button>12th Grade</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default SHEPGCCHomePage;
