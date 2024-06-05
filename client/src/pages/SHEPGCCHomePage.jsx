import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../assets/style/SHEPGCCHomePage.css';
import gcc from '../assets/images/ama-kofi-profile.png';
import shep from '../assets/images/akosua-mensah-profile.png';
import Navbar from "../components/Navbar.jsx";

function SHEPGCCHomePage() {
    const { id } = useParams(); // Extract the school ID from the URL, if available
    const navigate = useNavigate(); // Initialize useNavigate
    const [schoolName, setSchoolName] = useState('');
    const [shepInfo, setShepInfo] = useState(null);
    const [gccInfo, setGccInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddGradePopup, setShowAddGradePopup] = useState(false);
    const [showDeleteGradePopup, setShowDeleteGradePopup] = useState(false);
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [showDeleteMemberPopup, setShowDeleteMemberPopup] = useState(false);
    const [gradeNumber, setGradeNumber] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [grades, setGrades] = useState([]);
    const [members, setMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('');
    const [memberToDelete, setMemberToDelete] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (id) {
                    response = await axios.get(`http://localhost:4000/schools/${id}`);
                } else {
                    response = await axios.get('http://localhost:4000/profile', { withCredentials: true });
                }
                const school = response.data.school;
                if (school) {
                    setSchoolName(school.schoolName);
                    setShepInfo(school.SHEP);
                    setGccInfo(school.GCC);
                    setGrades(school.Classes.sort((a, b) => a.className.localeCompare(b.className)));
                    setMembers(school.Members || []);
                }
                setLoading(false);
            } catch (error) {
                console.error('There was an error fetching the school data!', error);
                setError('There was an error fetching the school data!');
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleAddGrade = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4000/schools/${id}/addClass`, {
                className: gradeNumber,
                teacherName,
                teacherEmail
            });
            setGrades([...grades, response.data].sort((a, b) => a.className.localeCompare(b.className)));
            setShowAddGradePopup(false);
            // Clear the input fields
            setGradeNumber('');
            setTeacherName('');
            setTeacherEmail('');
        } catch (error) {
            console.error('There was an error adding the grade!', error);
        }
    };

    const handleDeleteGrade = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:4000/schools/${id}/deleteClass`, {
                data: { className: selectedGrade }
            });
            setGrades(grades.filter(grade => grade.className !== selectedGrade).sort((a, b) => a.className.localeCompare(b.className))); // Update and sort grades
            setShowDeleteGradePopup(false);
        } catch (error) {
            console.error('There was an error deleting the grade!', error);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4000/schools/${id}/addMember`, {
                name: newMemberName,
                role: newMemberRole
            });
            setMembers([...members, response.data]);
            setShowAddMemberPopup(false); // Close the popup
            setNewMemberName('');
            setNewMemberRole('');
        } catch (error) {
            console.error('There was an error adding the member!', error);
        }
    };

    const handleDeleteMember = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:4000/schools/${id}/deleteMember`, {
                data: { name: memberToDelete }
            });
            setMembers(members.filter(member => member.name !== memberToDelete));
            setShowDeleteMemberPopup(false);
            setMemberToDelete('');
        } catch (error) {
            console.error('There was an error deleting the member!', error);
        }
    };

    const handleClosePopup = () => {
        setShowAddGradePopup(false);
        setShowDeleteGradePopup(false);
        setShowAddMemberPopup(false);
        setShowDeleteMemberPopup(false);
    };

    const handleGradeClick = (gradeId) => {
        navigate(`/grades/${gradeId}`); // Navigate to the specific grade page
    };

    return (
        <div className="shepgcc-home-page">
            <header className="header">
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <Navbar/>
            </header>
            <main className="main">
                <section className="school-info">
                    <h1>{schoolName}</h1>
                    <div className="info-grade-container">
                        <div className="info-container">
                            <div className="contact-info">
                                {gccInfo ? (
                                    <div className="contact-card">
                                        <img src={gcc} alt="GCC"/>
                                        <div>
                                            <h2>GCC</h2>
                                            <h3>{gccInfo.name}</h3>
                                            <p>{gccInfo.phone}</p>
                                            <p>{gccInfo.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>No GCC</div>
                                )}
                                <br/>
                                {shepInfo ? (
                                    <div className="contact-card">
                                        <img src={shep} alt="SHEP"/>
                                        <div>
                                            <h2>SHEP</h2>
                                            <h3>{shepInfo.name}</h3>
                                            <p>{shepInfo.phone}</p>
                                            <p>{shepInfo.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>No SHEP</div>
                                )}
                            </div>
                            <div className="chart-container">
                                <div className="chart">
                                    <body>
                                        <div className="piechart"></div>
                                    </body>
                                </div>
                                <div className="buttons">
                                    <button onClick={() => setShowAddMemberPopup(true)}>Add Member</button>
                                    <br></br>
                                    <button onClick={() => setShowDeleteMemberPopup(true)}>Delete Member</button>
                                    <br></br>
                                    <button onClick={() => setShowAddGradePopup(true)}>Add Grade</button>
                                    <br></br>
                                    <button onClick={() => setShowDeleteGradePopup(true)}>Delete Grade</button>
                                </div>
                            </div>
                        </div>
                        <div className="grade-list">
                            {grades.map(grade => (
                                <button key={grade._id} onClick={() => handleGradeClick(grade._id)}>{grade.className}</button> // Update button
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {showAddGradePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Add Grade</h2>
                        <form onSubmit={handleAddGrade}>
                            <label>
                                Grade Number:
                                <input
                                    type="text"
                                    value={gradeNumber}
                                    onChange={(e) => setGradeNumber(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Teacher Name:
                                <input
                                    type="text"
                                    value={teacherName}
                                    onChange={(e) => setTeacherName(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Teacher Email:
                                <input 
                                    type="email" 
                                    value={teacherEmail} 
                                    onChange={(e) => setTeacherEmail(e.target.value)} 
                                    required 
                                />
                            </label>
                            <div className="popup-buttons">
                                <button type="button" onClick={handleClosePopup}>Close</button>
                                <button type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteGradePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Delete Grade</h2>
                        <form onSubmit={handleDeleteGrade}>
                            <label>
                                Select Grade:
                                <select
                                    value={selectedGrade}
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                    required
                                >
                                    <option value="">Select Grade</option>
                                    {grades.map(grade => (
                                        <option key={grade._id} value={grade.className}>{grade.className}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="popup-buttons">
                                <button type="button" onClick={handleClosePopup}>Close</button>
                                <button type="submit">Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAddMemberPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Add Member</h2>
                        <form onSubmit={handleAddMember}>
                            <label>
                                Member Name:
                                <input
                                    type="text"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Member Role:
                                <select
                                    value={newMemberRole}
                                    onChange={(e) => setNewMemberRole(e.target.value)}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="SHEP">SHEP</option>
                                    <option value="GCC">GCC</option>
                                </select>
                            </label>
                            <div className="popup-buttons">
                                <button type="button" onClick={handleClosePopup}>Close</button>
                                <button type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteMemberPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Delete Member</h2>
                        <form onSubmit={handleDeleteMember}>
                            <label>
                                Select Member:
                                <select
                                    value={memberToDelete}
                                    onChange={(e) => setMemberToDelete(e.target.value)}
                                    required
                                >
                                    <option value="">Select Member</option>
                                    {members.map(member => (
                                        <option key={member._id} value={member.name}>{member.name}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="popup-buttons">
                                <button type="button" onClick={handleClosePopup}>Close</button>
                                <button type="submit">Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SHEPGCCHomePage;