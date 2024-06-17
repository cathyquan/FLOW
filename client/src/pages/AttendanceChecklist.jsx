import React, { useState } from 'react';
import RenelNavbar from "../components/Navbar.jsx";

function AttendanceTracker() {
    const [students, setStudents] = useState([
        { id: 1, name: 'Student 1', present: false },
        { id: 2, name: 'Student 2', present: false },
        { id: 3, name: 'Student 3', present: false },
        // Add more students as needed
    ]);

    const handleToggleAttendance = (id) => {
        setStudents(
            students.map(student =>
                student.id === id ? { ...student, present: !student.present } : student
            )
        );
    };

    return (
        <div>
            <header className="header">
                <RenelNavbar/>
            </header>
            <h1>Attendance Tracker</h1>
            <table>
                <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Present</th>
                </tr>
                </thead>
                <tbody>
                {students.map(student => (
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>
                            <input
                                type="checkbox"
                                checked={student.present}
                                onChange={() => handleToggleAttendance(student.id)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AttendanceTracker;
