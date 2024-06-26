import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from "../components/Navbar.jsx";
import Modal from '../components/Modal.jsx';
import '../assets/style/SHEPGCCInboxPage.css';
import '../assets/style/Divider.css';
import axios from 'axios';
import { UserContext } from '../UserContext';

function SHEPGCCInboxPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [leftWidth, setLeftWidth] = useState(() => {
        const savedWidth = localStorage.getItem('leftWidth');
        return savedWidth ? parseFloat(savedWidth) : 50;
    });
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dividerRef = useRef(null);
    const { user, loading, fetchUser } = useContext(UserContext);

    useEffect(() => {
        const fetchMessages = async () => {
            if (user && user.id) {
                try {
                    setLoadingMessages(true);
                    const response = await axios.get(`http://localhost:4000/messages/${user.id}`);
                    setMessages(response.data || []);
                    setFilteredMessages(response.data || []); // Initially, all messages are shown
                } catch (error) {
                    console.error('Error fetching messages:', error);
                } finally {
                    setLoadingMessages(false);
                }
            } else {
                fetchUser();
            }
        };

        if (!loading && user) {
            fetchMessages();
        }
    }, [user, loading, fetchUser]);

    useEffect(() => {
        const results = messages.filter(message =>
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.body.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMessages(results);
    }, [searchTerm, messages]);

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

    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
    };

    const handleMessageChange = (e) => {
        const newMessage = e.target.value;
        if (newMessage.length <= 250) {
            setMessage(newMessage);
            setCharCount(newMessage.length);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4000/${user.id}/sendMessage`, {
                subject: subject, // Use the actual subject from the input field
                body: message,
            });
            setMessages(prevMessages => [response.data, ...prevMessages]);
            setFilteredMessages(prevMessages => [response.data, ...prevMessages]);
            setSubject('');
            setMessage('');
            setCharCount(0);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="shepgcc-inbox-page">
            <header className="header">
                <Navbar />
            </header>
            <div className="main-content">
                <div className="contact-form" style={{ width: `${leftWidth}%` }}>
                    <h2>Contact RENEL</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Subject"
                            className="subject-input"
                            value={subject}
                            onChange={handleSubjectChange}
                        />
                        <div className="textarea-container">
                            <textarea
                                placeholder="New Message..."
                                className="message-textarea"
                                value={message}
                                onChange={handleMessageChange}
                            ></textarea>
                            <div className="char-count">{charCount}/250</div>
                        </div>
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                </div>
                <div className="divider" ref={dividerRef}></div>
                <div className="message-list" style={{ width: `${100 - leftWidth}%` }}>
                    <div className="message-list-header">
                        <input
                            type="text"
                            placeholder="Search Messages"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {loadingMessages ? (
                        <p>Loading messages...</p>
                    ) : (
                        <div className="messages">
                            {filteredMessages.map((message, i) => (
                                <div className="message-item" key={i} onClick={() => openModal(message)}>
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

export default SHEPGCCInboxPage;
