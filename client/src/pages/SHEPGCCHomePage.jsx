import React from 'react';
import '../assets/style/SHEPGCCHomePage.css';
import renel_logo from '../assets/images/renel-gh-logo.jpg';
import gcc from '../assets/images/ama-kofi-profile.png';
import shep from '../assets/images/akosua-mensah-profile.png';

function SHEPGCCHomePage() {
    return (
        <div className="App">
            <header className="header">
                <div className="logo-container">
                    <img src={renel_logo} alt="Renel Ghana Foundation Logo" className="logo" />
                </div>
                <div className="navbar">
                    <nav className="nav">
                        <a href="#">Home</a>
                    </nav>
                    <div className="icons">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c86b39" className="size-6">
                            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c86b39" className="size-6">
                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c86b39" className="size-6">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                        </svg>
                        <span>Logout</span>
                    </div>
                </div>
            </header>
            <main className="main">
                <section className="school-info">
                    <h1>School A</h1>
                    <div className="info-grade-container">
                        <div className="info-container">
                            <div className="contact-info">
                                <div className="contact-card">
                                    <img src={gcc} alt="Akosua Mensah" />
                                    <div>
                                        <h2>GCC</h2>
                                        <h3>Akosua Mensah</h3>
                                        <br></br>
                                        <p>+233 00-000-0000</p>
                                        <p>randomemail@gmail.com</p>
                                    </div>
                                </div>
                                <br></br>
                                <div className="contact-card">
                                    <img src={shep} alt="Ama Kofi" />
                                    <div>
                                        <h2>SHEP</h2>
                                        <h3>Ama Kofi</h3>
                                        <br></br>
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
                                    <button>Add Grade</button><br></br>
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
