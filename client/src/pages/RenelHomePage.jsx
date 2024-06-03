import React, { useState, useEffect } from 'react';
import axios from 'axios';
import renel_logo from '../assets/images/renel_logo.png';
import '../assets/style/RenelHomePage.css';
import RenelNavbar from '../components/RenelNavbar.jsx';
import {Link} from "react-router-dom";

function RenelHomePage() {
    const [schoolName, setSchoolName] = useState('');
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [action, setAction] = useState('');

    useEffect(() => {
        // Fetch the list of schools for the dropdown
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
        axios.post('http://localhost:4000/addSchool', {
            schoolName
        }).then(response => {
            console.log(response.data);
            alert('school added!');
            setSchoolName('');
        }).catch(error => {
            console.error("there was an error!", error);
            alert('school not added!');
        });
    };

    const handleEditSchool = () => {
        axios.put('/api/editSchool', {
            schoolName
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const handleDeleteSchool = () => {
        axios.delete('http://localhost:4000/deleteSchool', {
            data: { schoolName: selectedSchool }
        }).then(response => {
            console.log(response.data);
            alert('School deleted!');
            // Optionally, refresh the list of schools here
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

    return (
        <div className="renel-home-page">
            <header className="header">
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <div className="logo-container">
                    <img src={renel_logo} alt="Renel Ghana Foundation Logo" className="logo"/>
                </div>
                <div className="nav-div">
                    <RenelNavbar/>
                </div>
            </header>
            {/* this is the main content of the page */}
            <main className="main-content">
                <section className="most-urgent">
                    <h1>Most Urgent</h1>

                    <p><Link to="/home" className="school-link">School A</Link></p>
                    <p><Link to="/home" className="school-link">School A</Link></p>
                    <p><Link to="/home" className="school-link">School A</Link></p>
                    <p><Link to="/home" className="school-link">School A</Link></p>
                    <p><Link to="/home" className="school-link">School A</Link></p>
                    <p><Link to="/home" className="school-link">School A</Link></p>
                    <p><Link to="/home" className="school-link">School A</Link></p>


                </section>
                <section className="all-schools">
                    <div className="search-container">
                        <link rel="stylesheet"
                              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                        <input type="text" placeholder="Search for a School" className="search-input"/>
                        <button type="submit" className="search-button"><i className="fa fa-search"/></button>
                    </div>
                    <div className="school-list">
                        {/*<h1>All Schools</h1>*/}
                        <button><Link to="/home">School A</Link></button>
                        <button><Link to="/home">School B</Link></button>
                        <button><Link to="/home">School C</Link></button>
                        <button><Link to="/home">School D</Link></button>
                        <button><Link to="/home">School E</Link></button>
                        <button><Link to="/home">School F</Link></button>
                        <button><Link to="/home">School G</Link></button>
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
                                <button type="submit" onClick={handleAddSchool}>Submit</button>
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
                                    {schools.map(school => (
                                        <option key={school.id} value={school.schoolName}>
                                            {school.schoolName}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" onClick={handleDeleteSchool}>Submit</button>
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
