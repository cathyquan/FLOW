import React, { useState, useEffect, useRef } from 'react';
import Navbar from "../components/Navbar.jsx";
import Modal from '../components/Modal.jsx';
import '../assets/style/RenelInboxPage.css'; // Ensure this path is correct
import axios from 'axios';

function RenelInboxPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [leftWidth, setLeftWidth] = useState(() => {
        const savedWidth = localStorage.getItem('leftWidth');
        return savedWidth ? parseFloat(savedWidth) : 50;
    });
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const dividerRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:4000/admin/messages');
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, []);

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
                    {loadingMessages ? (
                        <p>Loading messages...</p>
                    ) : (
                        <div className="messages">
                            {messages.map((message, i) => (
                                <div className="message-item" key={i} onClick={() => openModal(message)}>
                                    <h1><span className="message-from">{message.school.schoolName}</span></h1>
                                    <h2><span className="message-subject">{message.subject}</span></h2>
                                    <h3><span className="message-date">{new Date(message.date).toLocaleDateString()}</span></h3>
                                    <span className="message-preview">{getPreview(message.body)}</span>
                                </div>
                            ))}
                        </div>
                    )}
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
