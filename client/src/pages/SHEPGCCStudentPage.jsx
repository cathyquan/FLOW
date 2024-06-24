import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../assets/style/SHEPGCCStudentPage.css';
import '../assets/style/Popup.css';
import Navbar from "../components/Navbar.jsx";
import CalendarComponent from "../components/Calendar.jsx";

function SHEPGCCStudentPage() {
    const { studentId } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [studentInfo, setStudentInfo] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/students/${studentId}`);
                const studentData = response.data;

                const mappedStudentInfo = {
                    ...studentData,
                    dob: new Date(studentData.dob).toISOString().split('T')[0],
                    guardians: [
                        { name: studentData.g1_name, phone: studentData.g1_phone }
                    ].filter(Boolean)
                };

                setStudentInfo(mappedStudentInfo);
            } catch (error) {
                console.error('There was an error fetching the student data!', error);
            }
        };

        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/attendance/student/${studentId}`);
                setAttendanceData(response.data);
            } catch (error) {
                console.error('There was an error fetching the attendance data!', error);
            }
        };

        fetchStudentInfo();
        fetchAttendanceData();
    }, [studentId]);

    const initialStudentInfo = studentInfo ? JSON.stringify(studentInfo) : '';

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
        setStudentInfo(JSON.parse(initialStudentInfo));
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
                guardians: [...prevInfo.guardians, { name: '', phone: '' }]
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowPopup(false);
        setUnsavedChanges(false);

        const updatedStudentInfo = {
            name: studentInfo.name,
            student_id: studentInfo.student_id,
            dob: studentInfo.dob,
            g1_name: studentInfo.guardians[0]?.name || '',
            g1_phone: studentInfo.guardians[0]?.phone || '',
        };

        try {
            const response = await axios.put(`http://localhost:4000/students/${studentId}`, updatedStudentInfo);
            console.log('Student info updated:', response.data);
        } catch (error) {
            console.error('There was an error updating the student info!', error);
        }
    };

    const totalAbsences = attendanceData.length;

    if (!studentInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <Navbar />
            <main className="main">
                <h1>{studentInfo.name}</h1>
                <div className="container">
                    <div className="info-container">
                        <div className="info-card">
                            <div className="student-details">
                                <h1><strong>Student ID:</strong> {studentInfo.student_id}</h1>
                                <p><strong>Class:</strong> {studentInfo.class.className}</p>
                                <p><strong>Date of Birth:</strong> {studentInfo.dob}</p>
                                {studentInfo.guardians.map((guardian, index) => (
                                    <div key={index}>
                                        <br />
                                        <h3>Guardian: {guardian.name}</h3>
                                        <p>Phone Number: {guardian.phone}</p>
                                    </div>
                                ))}
                                <br />
                                <h2><strong>Total Absences: {totalAbsences}</strong></h2>
                            </div>
                        </div>
                        <div className="student-buttons">
                            <button onClick={handleEditProfileClick}>Edit Student</button>
                        </div>
                    </div>

                    <div className="calendar-container">
                        <div className="calendar">
                            <CalendarComponent attendanceData={attendanceData} studentName={studentInfo.name} />
                        </div>
                    </div>
                </div>

                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup">
                            <h2>Edit Student Information</h2>
                            <form onSubmit={handleSubmit}>
                                <label>Student Name:</label>
                                <input type="text" name="name" value={studentInfo.name} onChange={handleInputChange} />
                                <label>Student ID:</label>
                                <input type="text" name="student_id" value={studentInfo.student_id} onChange={handleInputChange} />
                                <label>Date of Birth:</label>
                                <input type="date" name="dob" value={studentInfo.dob} onChange={handleInputChange} />
                                {studentInfo.guardians.map((guardian, index) => (
                                    <div key={index}>
                                        <label>Guardian Name:</label>
                                        <input type="text" value={guardian.name} onChange={(e) => handleGuardianChange(index, 'name', e.target.value)} />
                                        <label>Phone Number:</label>
                                        <input type="text" value={guardian.phone} onChange={(e) => handleGuardianChange(index, 'phone', e.target.value)} />
                                    </div>
                                ))}
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
