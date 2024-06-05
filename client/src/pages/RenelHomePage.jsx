import React, { useState, useEffect } from 'react';
import axios from 'axios';
import renel_logo from '../assets/images/renel_logo.png';
import '../assets/style/RenelHomePage.css';
import RenelNavbar from '../components/Navbar.jsx';
import { Link } from "react-router-dom";

function RenelHomePage() {
    const [schoolName, setSchoolName] = useState('');
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [action, setAction] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:4000/getSchools')
            .then(response => {
                setSchools(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleAddSchool = (ev) => {
        ev.preventDefault();
        axios.post('http://localhost:4000/addSchool', { schoolName })
            .then(response => {
                console.log(response.data);
                alert('School added!');
                setSchoolName('');
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

    const handleEditSchool = () => {
        axios.put('/api/editSchool', { schoolName })
            .then(response => {
                console.log(response.data);
            }).catch(error => {
                console.error(error);
            });
    };

    const handleDeleteSchool = () => {
        axios.delete('http://localhost:4000/deleteSchool', { data: { schoolName: selectedSchool } })
            .then(response => {
                console.log(response.data);
                alert('School deleted!');
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
    };

    const filteredSchools = schools
        .filter(school => school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    const sortedSchools = [...schools].sort((a, b) => a.schoolName.localeCompare(b.schoolName));

    return (
        <div className="renel-home-page">
            <header className="header">
                <RenelNavbar/>
            </header>
            <main className="main-content">
                <section className="most-urgent">
                    <h1>Most Urgent</h1>
                    {filteredSchools.slice(0, 7).map((school, index) => (
                        <p key={index}>
                            <Link to={`/school/${school.id}`} className="school-link">{school.schoolName}</Link>
                        </p>
                    ))}
                </section>
                <section className="all-schools">
                    <div className="search-container">
                        <link rel="stylesheet"
                              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                        <input 
                            type="text" 
                            placeholder="Search for a School" 
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="search-button"><i className="fa fa-search"/></button>
                    </div>
                    <div className="school-list">
                        {filteredSchools.map((school, index) => (
                            <Link to={`/school/${school._id}`}><button key={index}>
                                {school.schoolName}
                            </button> </Link>
                        ))}
                    </div>
                </section>
                <section className="manage-schools">
                    <div className="info">
                        {action === 'add' && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="School Name"
                                    value={schoolName}
                                    onChange={(e) => setSchoolName(e.target.value)}
                                />
                                <button type="submit" onClick={handleAddSchool}>Add School</button>
                            </div>
                        )}

                        {action === 'edit' && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="School Name"
                                    value={schoolName}
                                    onChange={(e) => setSchoolName(e.target.value)}
                                />
                                <button type="submit" onClick={handleEditSchool}>Submit</button>
                            </div>
                        )}

                        {action === 'delete' && (
                            <div>
                                <select
                                    value={selectedSchool}
                                    onChange={(e) => setSelectedSchool(e.target.value)}
                                >
                                    <option value="">Select a school</option>
                                    {sortedSchools.map(school => (
                                        <option key={school.id} value={school.schoolName}>
                                            {school.schoolName}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" onClick={handleDeleteSchool}>Delete School</button>
                            </div>
                        )}
                    </div>
                    <div className="buttons">
                        <button onClick={() => setAction('add')}>Add School</button>
                        <button onClick={() => setAction('edit')}>Edit School</button>
                        <button onClick={() => setAction('delete')}>Delete School</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default RenelHomePage;