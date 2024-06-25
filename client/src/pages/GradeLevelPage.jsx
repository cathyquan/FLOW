import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/style/GradeLevelPage.css';
import '../assets/style/Popup.css';
import RenelNavbar from "../components/Navbar.jsx";

const GradeLevelPage = () => {
    const { gradeId } = useParams();
    const navigate = useNavigate();
    const [gradeInfo, setGradeInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [totalAbsences, setTotalAbsences] = useState(0);
    const [studentName, setStudentName] = useState('');
    const [studentID, setStudentID] = useState('');
    const [studentDOB, setStudentDOB] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    const handleCloseDeletePopup = () => {
        setIsDeletePopupVisible(false);
    };

    useEffect(() => {
        const fetchGradeInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/grades/${gradeId}`);
                const grade = response.data.grade;
                setGradeInfo(grade);
                const sortedStudents = grade.students.sort((a, b) => a.name.localeCompare(b.name));
                setStudents(sortedStudents);
            } catch (error) {
                console.error('There was an error fetching the grade data!', error);
            }
        };

        const fetchTotalAbsences = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/attendance/grade/${gradeId}/totalAbsences`);
                setTotalAbsences(response.data.totalAbsences);
            } catch (error) {
                console.error('There was an error fetching the total absences!', error);
            }
        };

        fetchGradeInfo();
        fetchTotalAbsences();
    }, [gradeId]);

    const handleShowAddStudentPopup = () => {
        setIsPopupVisible(true);
    };

    const handleSaveStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4000/grades/${gradeId}/addStudent`, {
                name: studentName,
                student_id: studentID,
                dob: studentDOB,
                g1_name: guardianName,
                g1_phone: guardianPhoneNumber
            });
            setStudents([...students, response.data].sort((a, b) => a.name.localeCompare(b.name)));
            setStudentName('');
            setStudentID('');
            setStudentDOB('');
            setGuardianName('');
            setGuardianPhoneNumber('');
            setIsPopupVisible(false);
        } catch (error) {
            console.error('There was an error adding the student!', error);
        }
    };

    const handleShowDeleteStudentPopup = () => {
        setIsDeletePopupVisible(true);
    };

    const handleDeleteStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:4000/grades/${gradeId}/deleteStudent`, {
                studentName: selectedStudent
            });
            setStudents(students.filter(student => student.name !== selectedStudent).sort((a, b) => a.name.localeCompare(b.name)));
            setSelectedStudent('');
            setIsDeletePopupVisible(false);
            alert('Student Deleted!');
        } catch (error) {
            console.error('There was an error deleting the student!', error);
        }
    };

    const handleStudentClick = (studentId) => {
        navigate(`/students/${studentId}`);
    };

    const handleAttendanceClick = () => {
        navigate(`/grades/${gradeId}/attendance`);
    };

    return (
        <div className="grade-level-page">
            <header className="header">
                <RenelNavbar />
            </header>
            <div className="class-info">
                <h1>{gradeInfo ? gradeInfo.className : 'Loading...'}</h1>
                <p>{gradeInfo ? gradeInfo.teacherName : ''}</p>
                <p>Total Absences: {totalAbsences}</p>
            </div>
            <div className="content">
                <div className="student-list">
                    {students.map((student, index) => (
                        <button key={index} onClick={() => handleStudentClick(student._id)}>{student.name}</button>
                    ))}
                </div>
                <div className="sidebar">
                    <div className="chart">
                        {/* Insert your chart component here */}
                    </div>
                    <div className="buttons">
                        <button onClick={handleAttendanceClick}>Attendance</button>
                        <button onClick={handleShowAddStudentPopup} className="add-student-button">Add Student</button>
                        {isPopupVisible && (
                            <div className="popup-overlay">
                                <div className="popup">
                                    <h2>Add New Student</h2>
                                    <form onSubmit={handleSaveStudent}>
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            placeholder="Student Name"
                                            value={studentName}
                                            onChange={(e) => setStudentName(e.target.value)}
                                            required
                                        />
                                        <label>Student ID</label>
                                        <input
                                            type="text"
                                            placeholder="Student ID"
                                            value={studentID}
                                            onChange={(e) => setStudentID(e.target.value)}
                                            required
                                        />
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            value={studentDOB}
                                            onChange={(e) => setStudentDOB(e.target.value)}
                                            required
                                        />
                                        <label>Guardian Name</label>
                                        <input
                                            type="text"
                                            placeholder="Guardian Name"
                                            value={guardianName}
                                            onChange={(e) => setGuardianName(e.target.value)}
                                            required
                                        />
                                        <label>Guardian Phone Number</label>
                                        <input
                                            type="text"
                                            placeholder="Guardian Phone Number"
                                            value={guardianPhoneNumber}
                                            onChange={(e) => setGuardianPhoneNumber(e.target.value)}
                                            required
                                        />
                                        <div className="popup-buttons">
                                            <button type="button" onClick={handleClosePopup}>Close</button>
                                            <button type="submit">Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        <button onClick={handleShowDeleteStudentPopup}>Delete Student</button>
                        {isDeletePopupVisible && (
                            <div className="popup-overlay">
                                <div className="popup">
                                    <h2>Delete Student</h2>
                                    <form onSubmit={handleDeleteStudent}>
                                        <label>Select Student</label>
                                        <select
                                            value={selectedStudent}
                                            onChange={(e) => setSelectedStudent(e.target.value)}
                                        >
                                            <option value="" disabled>Select a student</option>
                                            {students.map((student, index) => (
                                                <option key={index} value={student.name}>{student.name}</option>
                                            ))}
                                        </select>
                                        <div className="popup-buttons">
                                            <button type="button" onClick={handleCloseDeletePopup}>Close</button>
                                            <button type="submit">Delete</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradeLevelPage;
