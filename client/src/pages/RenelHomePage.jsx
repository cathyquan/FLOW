import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/style/RenelHomePage.css';
import '../assets/style/Popup.css';
import RenelNavbar from '../components/Navbar.jsx';
import { Link } from "react-router-dom";

function RenelHomePage() {
    const [schoolName, setSchoolName] = useState('');
    const [schoolLocation, setSchoolLocation] = useState('');
    const [schoolEmail, setSchoolEmail] = useState('');
    const [schoolPhone, setSchoolPhone] = useState('');
    const [schools, setSchools] = useState([]);
    const [mostUrgentSchools, setMostUrgentSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isMostUrgentExpanded, setIsMostUrgentExpanded] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        axios.get('http://localhost:4000/getSchools')
            .then(response => {
                setSchools(response.data);
            })
            .catch(error => {
                console.error(error);
            });

        axios.get('http://localhost:4000/admin/schools-with-most-absences')
            .then(response => {
                setMostUrgentSchools(response.data);
            })
            .catch(error => {
                console.error(error);
            });

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 1200) {
                setIsMostUrgentExpanded(false);
            } else {
                setIsMostUrgentExpanded(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAddSchool = (ev) => {
        ev.preventDefault();
        axios.post('http://localhost:4000/addSchool', { schoolName, schoolLocation, schoolEmail, schoolPhone })
            .then(response => {
                alert('School added!');
                setSchoolName('');
                setSchoolLocation('');
                setIsAddPopupOpen(false);
                axios.get('http://localhost:4000/getSchools')
                    .then(response => {
                        setSchools(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }).catch(error => {
                console.error("There was an error!", error);
                alert('School not added!');
            });
    };

    const handleDeleteSchool = (ev) => {
        ev.preventDefault();
        if (window.confirm(`Are you sure you want to delete the school ${selectedSchool}?`)) {
            axios.delete('http://localhost:4000/deleteSchool', { data: { schoolName: selectedSchool } })
                .then(response => {
                    alert('School deleted!');
                    setSelectedSchool('');
                    setIsDeletePopupOpen(false);
                    axios.get('http://localhost:4000/getSchools')
                        .then(response => {
                            setSchools(response.data);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }).catch(error => {
                    console.error("There was an error!", error);
                    alert('School not deleted!');
                });
        }
    };

    const filteredSchools = schools
        .filter(school => school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const toggleMostUrgent = () => {
        if (windowWidth < 1200) {
            setIsMostUrgentExpanded(!isMostUrgentExpanded);
        }
    };

    return (
        <div className="renel-home-page">
            <header className="header">
                <RenelNavbar />
            </header>
            <main className="main-content">
                <section className={`most-urgent ${isMostUrgentExpanded ? 'expanded' : 'collapsed'}`}>
                    <h1 onClick={toggleMostUrgent} className="collapsible-header">
                        Most Urgent {windowWidth < 1200 && <button>{isMostUrgentExpanded ? '-' : '+'}</button>}
                    </h1>
                    <div className="most-urgent-content">
                        {mostUrgentSchools.map(({ school, absences }, index) => (
                            <p key={index}>
                                <Link to={`/school/${school._id}`} className="school-link">
                                    {school.schoolName}: {absences} absences
                                </Link>
                            </p>
                        ))}
                    </div>
                </section>
                <section className="all-schools">
                    <div className="buttons-and-search">
                        <div className="search-container">
                            <link rel="stylesheet"
                                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                            <input
                                type="text"
                                placeholder="Search for a School"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="search-button"><i className="fa fa-search" /></button>
                        </div>
                        <div className="buttons">
                            <button onClick={() => setIsAddPopupOpen(true)}>Add School</button>
                            <button onClick={() => setIsDeletePopupOpen(true)}>Delete School</button>
                        </div>
                    </div>
                    {isAddPopupOpen && (
                        <div className="popup-overlay">
                            <div className="popup">
                                <span className="close" onClick={() => setIsAddPopupOpen(false)}>&times;</span>
                                <h2>Add School</h2>
                                <form onSubmit={handleAddSchool}>
                                    <label>
                                        School Name:
                                        <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                                    </label>
                                    <label>
                                        School Address:
                                        <input type="text" value={schoolLocation} onChange={(e) => setSchoolLocation(e.target.value)} />
                                    </label>

                                    <label>
                                        School Email:
                                        <input type="text" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} />
                                    </label>
                                    <label>
                                        School Phone:
                                        <input type="text" value={schoolPhone} onChange={(e) => setSchoolPhone(e.target.value)} />
                                    </label>
                                    <div className="form-buttons">
                                        <button type="button" onClick={() => setIsAddPopupOpen(false)}>Cancel</button>
                                        <button type="submit">Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {isDeletePopupOpen && (
                        <div className="popup-overlay">
                            <div className="popup">
                                <span className="close" onClick={() => setIsDeletePopupOpen(false)}>&times;</span>
                                <h2>Delete School</h2>
                                <form onSubmit={handleDeleteSchool}>
                                    <label>
                                        Select School:
                                        <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
                                            <option value="">Select a school</option>
                                            {schools.map(school => (
                                                <option key={school._id} value={school.schoolName}>
                                                    {school.schoolName}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <div className="popup-buttons">
                                        <button type="button" onClick={() => setIsDeletePopupOpen(false)}>Cancel</button>
                                        <button type="submit">Delete</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="school-list">
                        {filteredSchools.map((school, index) => (
                            <Link to={`/school/${school._id}`} key={index}><button>
                                {school.schoolName}
                            </button> </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default RenelHomePage;
