import React from 'react';
import '../assets/style/Modal.css';

const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) {
        return null;
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(new Date(message.date));

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2><strong>Sender:</strong> {message.sender}</h2>
                <h2><strong>Subject:</strong> {message.subject}</h2>
                <p><strong>Date:</strong> {formattedDate}</p>
                <br></br>
                <p>{message.body}</p>
            </div>
        </div>
    );
};

export default Modal;