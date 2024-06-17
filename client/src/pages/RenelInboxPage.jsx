import React, { useState, useRef, useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import Modal from '../components/Modal.jsx';
import '../assets/style/RenelInboxPage.css'; // Ensure this path is correct

function RenelInboxPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [leftWidth, setLeftWidth] = useState(() => {
        // Retrieve the stored value from localStorage or use a default value
        const savedWidth = localStorage.getItem('leftWidth');
        return savedWidth ? parseFloat(savedWidth) : 50;
    });
    const dividerRef = useRef(null);

    const messages = [
        {
            date: 'June 17, 2024',
            from: 'School A',
            subject: 'Menstrual Products Needed',
            fullMessage: 'We have three girls who have been missing class for the past three to five days. We\'ve contacted their parents and found that they\'re in need of supplies. Please send some if possible!'
        },
        {
            date: 'June 4, 2024',
            from: 'School B',
            subject: 'New SHEP Hiree',
            fullMessage: 'We have a new SHEP coming in to replace the current one. Her name is Chelsea Nguyen and her contact information is as follows: email - contact@gmail.com, number - (233)000000000'
        },
        {
            date: 'May 30, 2024',
            from: 'School C',
            subject: 'It\'s Cathy\'s birthday today!!',
            fullMessage: 'happy birthday to cathy woot woot go crazy go stupid'
        },
        {
            date: 'May 24, 2024',
            from: 'School D',
            subject: 'hella girls on their period',
            fullMessage: 'send more products plz we need pads and tampons'
        },
        {
            date: 'May 20, 2024',
            from: 'School E',
            subject: 'last message',
            fullMessage: 'last message last message last message last message last message last message last message last message last message'
        },
        {
            date: 'February 20, 2024',
            from: 'School F',
            subject: 'It\'s Rafid\'s birthday today!!',
            fullMessage: 'happy birthday to rafid woot woot go crazy go stupid'
        },
        {
            date: 'April 8, 2024',
            from: 'School G',
            subject: 'It\'s Chelsea\'s birthday today!!',
            fullMessage: 'happy birthday to chelsea woot woot go crazy go stupid'
        },
        // Add more messages here
    ];

    const openModal = (message) => {
        setSelectedMessage(message);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedMessage(null);
    };

    const getPreview = (fullMessage) => {
        return fullMessage.length > 110 ? fullMessage.substring(0, 110) + '...' : fullMessage;
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const newLeftWidth = (e.clientX / window.innerWidth) * 100;
        if (newLeftWidth > 20 && newLeftWidth < 80) { // Set min and max limits for resizing
            setLeftWidth(newLeftWidth);
            localStorage.setItem('leftWidth', newLeftWidth); // Save the width immediately
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        const divider = dividerRef.current;
        if (divider) {
            divider.addEventListener('mousedown', handleMouseDown);
        }
        return () => {
            if (divider) {
                divider.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, []);

    return (
        <div className="inbox-page">
            <header className="header">
                <Navbar />
            </header>
            <div className="main-content">
                <div className="message-list" style={{ width: `${100 - leftWidth}%` }}>
                    <div className="message-list-header">
                        <input type="text" placeholder="Search Messages" className="search-input" />
                    </div>
                    <div className="messages">
                        {messages.map((message, i) => (
                            <div className="message-item" key={i} onClick={() => openModal(message)}>
                                <h1><span className="message-from">{message.from}</span></h1>
                                <h2><span className="message-subject">{message.subject}</span></h2>
                                <h3><span className="message-date">{message.date}</span></h3>
                                <span className="message-preview">{getPreview(message.fullMessage)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedMessage && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    message={selectedMessage}
                />
            )}
        </div>
    );
}

export default RenelInboxPage;