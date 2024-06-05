import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../assets/style/GradeLevelPage.css';
import renel_logo from "../assets/images/renel_logo.png";
import RenelNavbar from "../components/Navbar.jsx";

const GradeLevelPage = () => {
    const { gradeId } = useParams(); // Get gradeId from the URL
    const [gradeInfo, setGradeInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [action, setAction] = useState('');
    const [studentName, setStudentName] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');

    useEffect(() => {
        // Fetch grade information based on gradeId
        const fetchGradeInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/grades/${gradeId}`);
                const grade = response.data.grade;
                setGradeInfo(grade);
                setStudents(grade.students.map(student => student.name)); // Assuming student has a name field
            } catch (error) {
                console.error('There was an error fetching the grade data!', error);
            }
        };
        fetchGradeInfo();
    }, [gradeId]);

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
                <RenelNavbar />
            </header>
            <div className="class-info">
                <h1>{gradeInfo ? gradeInfo.className : 'Loading...'}</h1>
                <p>{gradeInfo ? gradeInfo.teacherName : ''}</p>
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
