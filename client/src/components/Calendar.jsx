import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, Button } from 'react-bootstrap';
import '../assets/style/Calendar.css'; // Custom styles for the calendar

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const attendance = {
    '2024-05-01': 'present',
    '2024-05-02': 'absent',
    '2024-05-03': 'present',
    // Add more dates as needed
  };
  const student = { name: 'Student Name' }; // Replace with actual student data

  const onChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const getTileClass = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (attendance[dateString] === 'present') {
        return 'react-calendar__tile--bg-success';
      } else if (attendance[dateString] === 'absent') {
        return 'react-calendar__tile--bg-danger';
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
      <Modal className="attendance-modal" show={showModal} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Attendance for {selectedDate?.toDateString()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDate && (
            <p>
              {attendance[selectedDate.toISOString().split('T')[0]] === 'present'
                ? `${student.name} was present on this day.`
                : `${student.name} was absent on this day.`}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
