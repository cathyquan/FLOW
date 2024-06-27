import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar.jsx";
import { useParams } from 'react-router-dom';
import '../assets/style/AttendanceChecklist.css';

const AttendanceChecker = () => {
  const { gradeId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [classInfo, setClassInfo] = useState({});

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/grades/${gradeId}`);
        const grade = response.data.grade;
        setStudents(grade.students);
        setClassInfo({
          className: grade.className,
          teacherName: grade.teacherName,
          teacherEmail: grade.teacherEmail,
        });
        fetchAttendanceForDate(grade.students, selectedDate);
      } catch (error) {
        console.error('Error fetching class information:', error);
      }
    };

    fetchClassInfo();
  }, [gradeId, selectedDate]);

  const fetchAttendanceForDate = async (studentsList, date) => {
    try {
      const response = await axios.get(`http://localhost:4000/attendance/grade/${gradeId}/date/${date}`);
      const absences = response.data;

      const attendanceList = studentsList.map(student => {
        const absenceRecord = absences.find(absence => absence.student === student._id);
        return {
          student: student._id,
          status: absenceRecord ? absenceRecord.status : 'Present'
        };
      });

      setAttendance(attendanceList);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      resetAttendance(studentsList); // Reset to default if error occurs
    }
  };

  const resetAttendance = (studentsList) => {
    setAttendance(studentsList.map(student => ({
      student: student._id,
      status: 'Present' // Default status
    })));
  };

  const handleChange = (index, event) => {
    const newAttendance = [...attendance];
    newAttendance[index].status = event.target.value;
    setAttendance(newAttendance);
  };

  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleDateChange = (event) => {
    const storageDate = event.target.value;
    setSelectedDate(storageDate);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post('http://localhost:4000/attendance/save', {
        date: selectedDate,
        attendance
      });
      alert('Attendance records saved successfully.');
    } catch (error) {
      console.error('Error saving attendance records:', error);
    }
  };

  const handleResetAttendance = () => {
    fetchAttendanceForDate(students, selectedDate); // Reset attendance when reset button is clicked
  };

  return (
    <div className="attendance-container">
      <header className="header">
        <Navbar />
      </header>
      <div className="main">
        <div className="grade-info">
          <button className="page-title" onClick={handlePopupToggle}>{classInfo.className}</button>
          {isPopupOpen && (
            <div className="popup-overlay">
              <div className="popup">
                <h2>Class Information</h2>
                <p><strong>Teacher:</strong> {classInfo.teacherName}</p>
                <p><strong>Email:</strong> {classInfo.teacherEmail}</p>
                <div className="popup-buttons">
                  <button onClick={handlePopupToggle}>Close</button>
                </div>
              </div>
            </div>
          )}
          <div className="date-picker-container">
            <input
              type="date"
              className="date-picker"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="attendance-checklist">
          <div className="students-list-container">
            <div className="students-list">
              {students.map((student, index) => (
                <div key={student._id} className="student">
                  {student.name}
                  <select
                    className="attendance-select"
                    value={attendance[index]?.status || 'Present'}
                    onChange={(event) => handleChange(index, event)}
                    style={{
                      backgroundColor: attendance[index]?.status === 'Present' ? '#d4edda' : '#f8d7da',
                      color: attendance[index]?.status === 'Present' ? '#155724' : '#721c24'
                    }}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent-Menstrual">Absent - Lack of Access to Menstrual Products</option>
                    <option value="Absent-Other">Absent - Other</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="button-b">
          <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>
          <button className="reset-button" onClick={handleResetAttendance}>Reset Attendance</button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChecker;
