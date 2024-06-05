import React, { useState } from 'react';
import '../assets/style/SHEPGCCStudentPage.css';
import '../graphics/calendar.js';
import Navbar from "../components/Navbar.jsx";

function SHEPGCCStudentPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [studentInfo, setStudentInfo] = useState({
        id: '######',
        grade: 1,
        dob: '02/20/2003',
        guardians: [
            {
                name: 'Sanethia Thomas (Mother)',
                phone: '+233 (00)-000-0000',
                email: 'randomemail@gmail.com'
            },
            {
                name: 'Robert Havor (Father)',
                phone: '+233 (00)-000-0000',
                email: 'randomemail@gmail.com'
            }
        ],
        attendanceRate: 70
    });

    const initialStudentInfo = JSON.stringify(studentInfo);

    const handleEditProfileClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        if (unsavedChanges) {
            setShowConfirmClose(true);
        } else {
            setShowPopup(false);
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmClose(false);
        setShowPopup(false);
        setStudentInfo(JSON.parse(initialStudentInfo)); // Revert to initial state
        setUnsavedChanges(false);
    };

    const handleCancelClose = () => {
        setShowConfirmClose(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudentInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
        setUnsavedChanges(true);
    };

    const handleGuardianChange = (index, field, value) => {
        const updatedGuardians = [...studentInfo.guardians];
        updatedGuardians[index][field] = value;
        setStudentInfo((prevInfo) => ({
            ...prevInfo,
            guardians: updatedGuardians,
        }));
        setUnsavedChanges(true);
    };

    const handleAddGuardian = () => {
        if (studentInfo.guardians.length < 3) {
            setStudentInfo((prevInfo) => ({
                ...prevInfo,
                guardians: [...prevInfo.guardians, { name: '', phone: '', email: '' }]
            }));
            setUnsavedChanges(true);
        }
    };

    const handleRemoveGuardian = (index) => {
        const updatedGuardians = studentInfo.guardians.filter((_, i) => i !== index);
        setStudentInfo((prevInfo) => ({
            ...prevInfo,
            guardians: updatedGuardians,
        }));
        setUnsavedChanges(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowPopup(false);
        setUnsavedChanges(false);
    };

    return (
        <div className="App">
            <header className="header">
                <Navbar />
            </header>
            <main className="main">
                <section className="student-info">
                    <h1>Rafid Chowdhury</h1>
                    <div className="info-container">
                        <div className="info-card">
                            <div className="student-details">
                                <h1><strong>Student ID:</strong> {studentInfo.id}</h1>
                                <p><strong>Grade:</strong> {studentInfo.grade}</p>
                                <p><strong>Date of Birth:</strong> {studentInfo.dob}</p>
                                {studentInfo.guardians.map((guardian, index) => (
                                    <div key={index}>
                                        <br></br>
                                        <h3>Guardian: {guardian.name}</h3>
                                        <p>Phone Number: {guardian.phone}</p>
                                        <p>Email Address: {guardian.email}</p>
                                    </div>
                                ))}
                                <br></br>
                                <h2><strong>Attendance Rate: 70%</strong></h2>
                            </div>
                        </div>
                        <div classname="student-details-right-side">
                            <div className="student-buttons">
                                <button onClick={handleEditProfileClick}>Edit Student</button>
                                <button>Delete Student</button>
                            </div>
                        </div>
                    </div>
                    <div class="calendar"></div>
                    <script src="script.js"></script>
                </section>
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup">
                            <h2>Edit Student Information</h2>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Student ID:
                                    <input type="text" name="id" value={studentInfo.id} readOnly />
                                </label>
                                <label>
                                    Grade:
                                    <input 
                                        type="text" 
                                        name="grade" 
                                        value={studentInfo.grade} 
                                        onChange={handleInputChange} 
                                    />
                                </label>
                                <label>
                                    Date of Birth:
                                    <input 
                                        type="text" 
                                        name="dob" 
                                        value={studentInfo.dob} 
                                        onChange={handleInputChange} 
                                    />
                                </label>
                                {studentInfo.guardians.map((guardian, index) => (
                                    <div key={index}>
                                        <label>
                                            Guardian Name:
                                            <input 
                                                type="text" 
                                                value={guardian.name} 
                                                onChange={(e) => handleGuardianChange(index, 'name', e.target.value)} 
                                            />
                                        </label>
                                        <label>
                                            Phone Number:
                                            <input 
                                                type="text" 
                                                value={guardian.phone} 
                                                onChange={(e) => handleGuardianChange(index, 'phone', e.target.value)} 
                                            />
                                        </label>
                                        <label>
                                            Email Address:
                                            <input 
                                                type="email" 
                                                value={guardian.email} 
                                                onChange={(e) => handleGuardianChange(index, 'email', e.target.value)} 
                                            />
                                        </label>
                                        <button type="button" onClick={() => handleRemoveGuardian(index)}>Remove Guardian</button>
                                    </div>
                                ))}
                                {studentInfo.guardians.length < 3 && (
                                    <button type="button" onClick={handleAddGuardian}>Add Guardian</button>
                                )}
                                <div className="popup-buttons">
                                    <button type="button" onClick={handleClosePopup}>Close</button>
                                    <button type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showConfirmClose && (
                    <div className="popup-overlay">
                        <div className="popup">
                            <h2>Unsaved Changes</h2>
                            <p>Are you sure you want to close? Your changes will not be saved.</p>
                            <div className="popup-buttons">
                                <button onClick={handleConfirmClose}>Yes, Close</button>
                                <button onClick={handleCancelClose}>No, Go Back</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default SHEPGCCStudentPage;
