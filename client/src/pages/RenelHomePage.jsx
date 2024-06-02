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
        axios.get('/api/getSchools')
            .then(response => {
                setSchools(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleAddSchool = () => {
        axios.post('/api/addSchool', {
            schoolName
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(error);
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
        axios.delete('/api/deleteSchool', {
            data: { schoolName: selectedSchool }
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    return (
        <div className="renel-home-page">
            {/* this is the logo at the top of the page */}
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
            <main className="main-content-div">
                <section className="most-urgent-div">
                    <h1>Most Urgent</h1>
                    <button><Link to="/home">School A</Link></button>
                    <button><Link to="/home">School A</Link></button>
                    <button><Link to="/home">School A</Link></button>
                    <button><Link to="/home">School A</Link></button>
                    <button><Link to="/home">School A</Link></button>
                    <button><Link to="/home">School A</Link></button>
                    <button><Link to="/home">School A</Link></button>
                </section>
                <section className="all-schools-div">
                    <p>hello</p>
                </section>
                <section className="manage-schools-div">
                    <button onClick={() => setAction('add')}>Add School</button>
                    <button onClick={() => setAction('edit')}>Edit School</button>
                    <button onClick={() => setAction('delete')}>Delete School</button>

                    {action === 'add' && (
                        <div>
                            <input
                                type="text"
                                placeholder="School Name"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                            />
                            <button onClick={handleAddSchool}>Submit</button>
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

                            <button onClick={handleEditSchool}>Submit</button>
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
                                    <option key={school.id} value={school.name}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleDeleteSchool}>Submit</button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default RenelHomePage;
