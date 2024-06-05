import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../assets/style/SHEPGCCHomePage.css';
import gcc from '../assets/images/ama-kofi-profile.png';
import shep from '../assets/images/akosua-mensah-profile.png';
import Navbar from "../components/Navbar.jsx";

function SHEPGCCHomePage() {
    const { id } = useParams(); // Extract the school ID from the URL, if available
    const [schoolName, setSchoolName] = useState('');
    const [shepInfo, setShepInfo] = useState(null);
    const [gccInfo, setGccInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddGradePopup, setShowAddGradePopup] = useState(false);
    const [showDeleteGradePopup, setShowDeleteGradePopup] = useState(false);
    const [gradeNumber, setGradeNumber] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');

    const grades = ["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"];

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

    const handleAddGrade = (e) => {
        e.preventDefault();
        // Implement form submission logic here, e.g., making an API call to save the grade information
        console.log("Grade Number:", gradeNumber);
        console.log("Teacher Name:", teacherName);
        console.log("Teacher Email:", teacherEmail);
        setShowAddGradePopup(false);
    };

    const handleDeleteGrade = (e) => {
        e.preventDefault();
        // Implement form submission logic here, e.g., making an API call to delete the selected grade
        console.log("Selected Grade to Delete:", selectedGrade);
        setShowDeleteGradePopup(false);
    };

    const handleClosePopup = () => {
        setShowAddGradePopup(false);
        setShowDeleteGradePopup(false);
    };

    return (
        <div className="shepgcc-home-page">
            <header className="header">
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <Navbar/>
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
                                    <div>No GCC</div>
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
                                    <div>No SHEP</div>
                                )}
                            </div>
                            <div className="chart-container">
                                <div className="chart">
                                    <body>
                                        <div className="piechart"></div>
                                    </body>
                                </div>
                                <div className="buttons">
                                    <button onClick={() => setShowAddGradePopup(true)}>Add Grade</button>
                                    <br></br>
                                    <button onClick={() => setShowDeleteGradePopup(true)}>Delete Grade</button>
                                </div>
                            </div>
                        </div>
                        <div className="grade-list">
                            {grades.map(grade => (
                                <button key={grade}>{grade}</button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {showAddGradePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Add Grade</h2>
                        <form onSubmit={handleAddGrade}>
                            <label>
                                Grade Number:
                                <input 
                                    type="text" 
                                    value={gradeNumber} 
                                    onChange={(e) => setGradeNumber(e.target.value)} 
                                    required 
                                />
                            </label>
                            <label>
                                Teacher Name:
                                <input 
                                    type="text" 
                                    value={teacherName} 
                                    onChange={(e) => setTeacherName(e.target.value)} 
                                    required 
                                />
                            </label>
                            <label>
                                Teacher Email:
                                <input 
                                    type="email" 
                                    value={teacherEmail} 
                                    onChange={(e) => setTeacherEmail(e.target.value)} 
                                    required 
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

            {showDeleteGradePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Delete Grade</h2>
                        <form onSubmit={handleDeleteGrade}>
                            <label>
                                Select Grade:
                                <select 
                                    value={selectedGrade} 
                                    onChange={(e) => setSelectedGrade(e.target.value)} 
                                    required
                                >
                                    <option value="">Select Grade</option>
                                    {grades.map(grade => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="popup-buttons">
                                <button type="button" onClick={handleClosePopup}>Close</button>
                                <button type="submit">Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SHEPGCCHomePage;
