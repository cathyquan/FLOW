import React, { useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import '../assets/style/AttendanceChecklist.css';

const students = [
    'Rafid Chowdhury', 'Juan Carlos Plate', 'Sophie Shah',
    'Cathy Quan', 'Sammy Garcia', 'Aryaan Verma',
    'Chelsea Nguyen', 'Kate Schwitz', 'Eli Johnson',
    'Billy Jesser', 'Lucas Baraya', 'Endrit Berberi',
    'Hayden Russell', 'Patrick Kallenbach', 'William Zhu',
    'Luis Ferrer', 'Pieter Alley', 'Rebecca Weinstein',
    'Chelsea Nguyen', 'Kate Schwitz', 'Eli Johnson',
    'Billy Jesser', 'Lucas Baraya', 'Endrit Berberi',
    'Hayden Russell', 'Patrick Kallenbach', 'William Zhu',
    'Luis Ferrer', 'Pieter Alley', 'Rebecca Weinstein'
];

const AttendanceChecker = () => {
    const [attendance, setAttendance] = useState(students.map(() => "present"));
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (index, event) => {
        const newAttendance = [...attendance];
        newAttendance[index] = event.target.value;
        setAttendance(newAttendance);
    };

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="attendance-container">
            <header className="header">
                <Navbar />
            </header>
            <div className="main">
                <div className="grade-info">
                    <button className="grade-button" onClick={handleModalToggle}>1st Grade</button>
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={handleModalToggle}>&times;</span>
                                <p><strong>Teacher:</strong> Mouray Hutchinson</p>
                                <p><strong>Email:</strong> mouray@gmail.com</p>
                            </div>
                        </div>
                    )}
                    <div className="date-picker-container">
                        <input type="date" className="date-picker" defaultValue="2024-05-24" />
                    </div>
                </div>
                <div className="attendance-checklist">
                    <div className="students-list-container">
                        <div className="students-list">
                            {students.map((student, index) => (
                                <div key={index} className="student">
                                    {student}
                                    <select
                                        className="attendance-select"
                                        value={attendance[index]}
                                        onChange={(event) => handleChange(index, event)}
                                        style={{
                                            backgroundColor: attendance[index] === 'present' ? '#d4edda' : '#f8d7da',
                                            color: attendance[index] === 'present' ? '#155724' : '#721c24'
                                        }}
                                    >
                                        <option value="present">Present</option>
                                        <option value="absent-menstrual">Absent - Lack of Menstrual Products</option>
                                        <option value="absent-resources">Absent - Lack of Learning Resources</option>
                                        <option value="absent-transportation">Absent - Lack of Transportation</option>
                                        <option value="absent-other">Absent - Other</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='buttons'>
                    <button className="save-button">Save Changes</button>
                    <button className="default-button">Reset Attendance</button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceChecker;
