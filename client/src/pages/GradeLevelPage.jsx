import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/style/GradeLevelPage.css';
import renel_logo from "../assets/images/renel_logo.png";
import RenelNavbar from "../components/Navbar.jsx";

const GradeLevelPage = () => {
    const { gradeId } = useParams();
    const navigate = useNavigate();
    const [gradeInfo, setGradeInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [studentID, setStudentID] = useState('');
    const [studentDOB, setStudentDOB] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchGradeInfo = async () => {
            try {
                const response = await axios.get(`http://172.20.10.3:4000/grades/${gradeId}`);
                const grade = response.data.grade;
                setGradeInfo(grade);
                const sortedStudents = grade.students.sort((a, b) => a.name.localeCompare(b.name));
                setStudents(sortedStudents);
            } catch (error) {
                console.error('There was an error fetching the grade data!', error);
            }
        };
        fetchGradeInfo();
    }, [gradeId]);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://172.20.10.3:4000/grades/${gradeId}/addStudent`, {
                name: studentName,
                student_id: studentID,
                student_dob: studentDOB,
                g1_name: guardianName,
                g1_phone: guardianPhoneNumber
            });
            setStudents([...students, response.data].sort((a, b) => a.name.localeCompare(b.name)));
            setStudentName('');
            setStudentID('');
            setStudentDOB('');
            setGuardianName('');
            setGuardianPhoneNumber('');
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('There was an error adding the student!', error);
        }
    };

    const handleDeleteStudent = async (e) => {
        e.preventDefault();
        if (window.confirm(`Are you sure you want to delete the student ${selectedStudent}?`)) {
            try {
                await axios.post(`http://172.20.10.3:4000/grades/${gradeId}/deleteStudent`, {
                    studentName: selectedStudent
                });
                setStudents(students.filter(student => student.name !== selectedStudent).sort((a, b) => a.name.localeCompare(b.name)));
                setSelectedStudent('');
                setIsDeleteModalOpen(false);
                alert('Student Deleted!');
            } catch (error) {
                console.error('There was an error deleting the student!', error);
            }
        }
    };

    const handleStudentClick = (studentId) => {
        navigate(`/students/${studentId}`);
    };

    return (
        <div className="grade-level-page">
            <header className="header">
                <RenelNavbar />
            </header>
            <div className="class-info">
                <h1>{gradeInfo ? gradeInfo.className : 'Loading...'}</h1>
                <p>{gradeInfo ? gradeInfo.teacherName : ''}</p>
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
                        <button onClick={() => setAction('attendance')}>Attendance</button>
                        <button onClick={() => setIsAddModalOpen(true)}>Add Student</button>
                        <button onClick={() => setIsDeleteModalOpen(true)}>Delete Student</button>
                    </div>
                </div>
            </div>

            {/* Add Student Modal */}
            {isAddModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsAddModalOpen(false)}>&times;</span>
                        <h2>Add Student</h2>
                        <form onSubmit={handleAddStudent}>
                            <label>
                                Student Name:
                                <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                            </label>
                            <label>
                                Student ID:
                                <input type="text" value={studentID} onChange={(e) => setStudentID(e.target.value)} />
                            </label>
                            <label>
                                Student DOB:
                                <input type="date" value={studentDOB} onChange={(e) => setStudentDOB(e.target.value)} />
                            </label>
                            <label>
                                Guardian Name:
                                <input type="text" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
                            </label>
                            <label>
                                Guardian Phone:
                                <input type="text" value={guardianPhoneNumber} onChange={(e) => setGuardianPhoneNumber(e.target.value)} />
                            </label>
                            <button type="submit">Add</button>
                            <button type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Student Modal */}
            {isDeleteModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsDeleteModalOpen(false)}>&times;</span>
                        <h2>Delete Student</h2>
                        <form onSubmit={handleDeleteStudent}>
                            <label>
                                Select Student:
                                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                                    <option value="">--Select a student--</option>
                                    {students.map(student => (
                                        <option key={student._id} value={student.name}>
                                            {student.name}
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
    );
};

export default GradeLevelPage;
