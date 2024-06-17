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
    const [action, setAction] = useState('');
    const [studentName, setStudentName] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');

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
        fetchGradeInfo();
    }, [gradeId]);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4000/grades/${gradeId}/addStudent`, {
                name: studentName,
                g1_name: guardianName,
                g1_phone: guardianPhoneNumber
            });
            setStudents([...students, response.data].sort((a, b) => a.name.localeCompare(b.name)));
            setStudentName('');
            setGuardianName('');
            setGuardianPhoneNumber('');
        } catch (error) {
            console.error('There was an error adding the student!', error);
        }
    };

    const handleDeleteStudent = async (e) => {
        e.preventDefault();
        if (window.confirm(`Are you sure you want to delete the student ${selectedStudent}?`)) {
            try {
                await axios.post(`http://localhost:4000/grades/${gradeId}/deleteStudent`, {
                    studentName: selectedStudent
                });
                setStudents(students.filter(student => student.name !== selectedStudent).sort((a, b) => a.name.localeCompare(b.name)));
                setSelectedStudent('');
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
                        <button onClick={() => setAction('add')}>Add Student</button>
                        <button onClick={() => setAction('delete')}>Delete Student</button>
                    </div>
                    {action === 'add' && (
                        <div className="form">
                            <form onSubmit={handleAddStudent}>
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
                                <button type="submit">Add Student</button>
                            </form>
                        </div>
                    )}
                    {action === 'delete' && (
                        <div className="form">
                            <form onSubmit={handleDeleteStudent}>
                                <select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                >
                                    <option value="">Select a student</option>
                                    {students.map((student, index) => (
                                        <option key={student._id} value={student.name}>
                                            {student.name}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit">Delete Student</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GradeLevelPage;
