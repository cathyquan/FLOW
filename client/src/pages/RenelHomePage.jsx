import React, { useState, useEffect } from 'react';
import axios from 'axios';
import renel_logo from '../assets/images/renel_logo.png';
import '../assets/style/RenelHomePage.css';
import RenelNavbar from '../components/Navbar.jsx';
import { Link } from "react-router-dom";

function RenelHomePage() {
    const [schoolName, setSchoolName] = useState('');
    const [schoolLocation, setSchoolLocation] = useState('');
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [action, setAction] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        axios.get('http://172.20.10.3:4000/getSchools')
            .then(response => {
                setSchools(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleAddSchool = (ev) => {
        ev.preventDefault();
        axios.post('http://172.20.10.3:4000/addSchool', { schoolName, schoolLocation })
            .then(response => {
                console.log(response.data);
                alert('School added!');
                setSchoolName('');
                setSchoolLocation('');
                setIsAddModalOpen(false);
                axios.get('http://172.20.10.3:4000/getSchools')
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
            axios.delete('http://172.20.10.3:4000/deleteSchool', { data: { schoolName: selectedSchool } })
                .then(response => {
                    console.log(response.data);
                    alert('School deleted!');
                    setSelectedSchool('');
                    setIsDeleteModalOpen(false);
                    axios.get('http://172.20.10.3:4000/getSchools')
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

    return (
        <div className="renel-home-page">
            <header className="header">
                <RenelNavbar />
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
                    <div className="school-list">
                        {filteredSchools.map((school, index) => (
                            <Link to={`/school/${school._id}`} key={index}><button>
                                {school.schoolName}
                            </button> </Link>
                        ))}
                    </div>
                </section>
                <section className="manage-schools">
                    <div className="info">
                        {isAddModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close" onClick={() => setIsAddModalOpen(false)}>&times;</span>
                                    <h2>Add School</h2>
                                    <form onSubmit={handleAddSchool}>
                                        <label>
                                            School Name:
                                            <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                                        </label>
                                        <label>
                                            School Location:
                                            <input type="text" value={schoolLocation} onChange={(e) => setSchoolLocation(e.target.value)} />
                                        </label>
                                        <button type="submit">Add</button>
                                        <button type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        )}
                        {isDeleteModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close" onClick={() => setIsDeleteModalOpen(false)}>&times;</span>
                                    <h2>Delete School</h2>
                                    <form onSubmit={handleDeleteSchool}>
                                        <label>
                                            Select School:
                                            <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
                                                <option value="">--Select a school--</option>
                                                {schools.map(school => (
                                                    <option key={school._id} value={school.schoolName}>
                                                        {school.schoolName}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <button type="submit">Delete</button>
                                        <button type="button" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="buttons">
                        <button onClick={() => setIsAddModalOpen(true)}>Add School</button>
                        <button onClick={() => setIsDeleteModalOpen(true)}>Delete School</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default RenelHomePage;
