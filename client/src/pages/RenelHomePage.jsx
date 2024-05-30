import React, { useState, useEffect } from 'react';
import axios from 'axios';
import renel_logo from '../assets/images/renel_logo.png';
import '../assets/style/RenelHomePage.css';
import RenelNavBar from '../components/RenelNavbar.jsx';

function RenelHomePage() {
    const [schoolName, setSchoolName] = useState('');
    const [headmasterName, setHeadmasterName] = useState('');
    const [headmasterEmail, setHeadmasterEmail] = useState('');
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
            schoolName,
            headmasterName,
            headmasterEmail
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const handleEditSchool = () => {
        axios.put('/api/editSchool', {
            schoolName,
            headmasterName,
            headmasterEmail
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
            <div className="logo-div">
                <img src={renel_logo} alt="Renel Logo" className="responsive-image"/>
            </div>

            {/* this is the navigation bar */}
            <div className="nav-div">
                <RenelNavBar/>
            </div>

            {/* this is the main content of the page */}
            <div className="main-content-div">
                <div className="most-urgent-div">
                    <p>hello</p>
                    <button>YELLLO</button>
                </div>
                <div className="all-schools-div">
                    <p>hello</p>
                </div>
                <div className="manage-schools-div">
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
                            <input
                                type="text"
                                placeholder="Headmaster Name"
                                value={headmasterName}
                                onChange={(e) => setHeadmasterName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Headmaster Email"
                                value={headmasterEmail}
                                onChange={(e) => setHeadmasterEmail(e.target.value)}
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
                            <input
                                type="text"
                                placeholder="Headmaster Name"
                                value={headmasterName}
                                onChange={(e) => setHeadmasterName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Headmaster Email"
                                value={headmasterEmail}
                                onChange={(e) => setHeadmasterEmail(e.target.value)}
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
                </div>
            </div>
        </div>
    );
}

export default RenelHomePage;
