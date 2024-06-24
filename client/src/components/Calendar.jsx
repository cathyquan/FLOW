import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../assets/style/Calendar.css'; // Custom styles for the calendar
import '../assets/style/AttendanceChecklist.css'; // Assuming this file contains the popup styles

const CalendarComponent = ({ attendanceData, studentName }) => {
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const onChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday (0) or Saturday (6)
  };

  const getTileClass = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      const dateString = date.toISOString().split('T')[0];
      const attendanceRecord = attendanceData.find(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === dateString;
      });

      // Only process past dates and exclude weekends
      if (date < today && !isWeekend(date)) {
        if (attendanceRecord) {
          return 'react-calendar__tile--bg-danger'; // Assume all stored records are absences
        } else {
          return 'react-calendar__tile--bg-success'; // If no record, assume present
        }
      }
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={getTileClass}
      />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <span className="close" onClick={handleClose}>&times;</span>
            <h2>Attendance Details</h2>
            <p>Date: {selectedDate?.toLocaleDateString()}</p>
            <p>
              {attendanceData.find(record => {
                const recordDate = new Date(record.date).toISOString().split('T')[0];
                return recordDate === selectedDate.toISOString().split('T')[0];
              })?.status
                ? `${studentName} was absent on this day.`
                : `${studentName} was present on this day.`}
            </p>
            <div className="popup-buttons">
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
