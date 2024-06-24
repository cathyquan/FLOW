import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../assets/style/SHEPGCCHomePage.css';
import renel_logo from '../assets/images/renel-gh-logo.jpg';
import gcc from '../assets/images/ama-kofi-profile.png';
import shep from '../assets/images/akosua-mensah-profile.png';
import Navbar from "../components/Navbar.jsx";

function SchoolHomePage() {
    const { id } = useParams(); // Extract the school ID from the URL, if available
    const [schoolName, setSchoolName] = useState('');
    const [shepInfo, setShepInfo] = useState(null);
    const [gccInfo, setGccInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (id) {
                    response = await axios.get(`http://localhost:4000/schools/${id}`);
                } else {
                    response = await axios.get('http://localhost:4000/profile', { withCredentials: true });
                }
                const school = response.data.school;
                if (school) {
                    setSchoolName(school.schoolName);
                    setShepInfo(school.SHEP);
                    setGccInfo(school.GCC);
                }
                setLoading(false);
            } catch (error) {
                console.error('There was an error fetching the school data!', error);
                setError('There was an error fetching the school data!');
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="shepgcc-home-page">
            <header className="header">
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <div className="logo-container">
                    <img src={renel_logo} alt="Renel Ghana Foundation Logo" className="logo"/>
                </div>
                <div className="nav-div">
                    <Navbar/>
                </div>
            </header>
            <main className="main">
                <section className="school-info">
                    <h1>{schoolName}</h1>
                    <div className="info-grade-container">
                        <div className="info-container">
                            <div className="contact-info">
                                {gccInfo ? (
                                    <div className="contact-card">
                                        <img src={gcc} alt="GCC"/>
                                        <div>
                                            <h2>GCC</h2>
                                            <h3>{gccInfo.name}</h3>
                                            <p>{gccInfo.phone}</p>
                                            <p>{gccInfo.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>No GCC information available</div>
                                )}
                                <br/>
                                {shepInfo ? (
                                    <div className="contact-card">
                                        <img src={shep} alt="SHEP"/>
                                        <div>
                                            <h2>SHEP</h2>
                                            <h3>{shepInfo.name}</h3>
                                            <p>{shepInfo.phone}</p>
                                            <p>{shepInfo.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>No SHEP information available</div>
                                )}
                            </div>
                            <div className="chart-container">
                                <div className="chart">
                                    <body>
                                        <div className="piechart"></div>
                                    </body>
                                </div>
                                <div className="buttons">
                                    <button>Add Grade</button>
                                    <br/>
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

export default SchoolHomePage;
