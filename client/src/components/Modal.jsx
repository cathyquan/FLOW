import React from 'react';
import '../assets/style/Modal.css';

const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2><strong>Sender:</strong> {message.sender}</h2>
                <h2><strong>Subject:</strong> {message.subject}</h2>
                <p><strong>Date:</strong> {message.date}</p>
                <br></br>
                <p>{message.fullMessage}</p>
            </div>
        </div>
    );
};

export default Modal;