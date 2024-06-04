import React, { useState } from 'react';
import axios from 'axios';
import '../assets/style/GradeLevelPage.css';
import renel_logo from "../assets/images/renel_logo.png";
import RenelNavbar from "../components/Navbar.jsx";
import {Link} from "react-router-dom";

const GradeLevelPage = () => {
    const [students, setStudents] = useState([
        "Rafid Chowdhury", "Juan Carlos Plate", "Sophia Shah",
        "Cathy Quan", "Sammy Garcia", "Aryaan Verma",
        "Chelsea Nguyen", "Kate Schwitz", "Eli Johnson",
        "Billy Jesser", "Lucas Baraya", "Endrit Berberi",
        "Hayden Russell", "Patrick Kallenbach", "William Zhu",
        "Luis Ferrer", "Pieter Alley", "Rebecca Weinstein"
    ]);
    const [action, setAction] = useState('');
    const [studentName, setStudentName] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');

    const handleAddStudent = () => {
        axios.post('/api/addStudent', {
            studentName,
            guardianName,
            guardianPhoneNumber
        })
        .then(response => {
            setStudents([...students, studentName]);
            setStudentName('');
            setGuardianName('');
            setGuardianPhoneNumber('');
        })
        .catch(error => {
            console.error('There was an error adding the student!', error);
        });
    };

    const handleDeleteStudent = () => {
        axios.post('/api/deleteStudent', {
            studentName: selectedStudent
        })
        .then(response => {
            setStudents(students.filter(student => student !== selectedStudent));
            setSelectedStudent('');
        })
        .catch(error => {
            console.error('There was an error deleting the student!', error);
        });
    };

    return (
        <div className="grade-level-page">
            <header className="header">
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <div className="logo-container">
                    <img src={renel_logo} alt="Renel Ghana Foundation Logo" className="logo"/>
                </div>
                <div className="nav-div">
                    <RenelNavbar/>
                </div>
            </header>
            <div className="class-info">
                <h1>1st Grade</h1>
                <p>Mouray Hutchinson</p>
            </div>
            <div className="content">

                <div className="student-list">
                    {students.map((student, index) => (
                        <button key={index}>{student}</button>
                    ))}
                </div>
                <div className="sidebar">
                    <div className="chart">
                        {/* Insert your chart component here */}
                    </div>
                    <div className="buttons">
                        <button onClick={() => setAction('attendance')}>Attendance</button>
                        <button onClick={() => setAction('add')}>Add Student</button>
                        <button onClick={() => setAction('delete')}>Delete Student</button>
                    </div>
                    {action === 'add' && (
                        <div className="form">
                            <input
                                type="text"
                                placeholder="Student Name"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Guardian Name"
                                value={guardianName}
                                onChange={(e) => setGuardianName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Guardian Phone Number"
                                value={guardianPhoneNumber}
                                onChange={(e) => setGuardianPhoneNumber(e.target.value)}
                            />
                            <button onClick={handleAddStudent}>Submit</button>
                        </div>
                    )}
                    {action === 'delete' && (
                        <div className="form">
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                            >
                                <option value="">Select a student</option>
                                {students.map((student, index) => (
                                    <option key={index} value={student}>
                                        {student}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleDeleteStudent}>Submit</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GradeLevelPage;
