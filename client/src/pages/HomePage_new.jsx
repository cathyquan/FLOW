import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/style/HomePage_new.css';
import '../assets/style/Popup.css';
import Navbar from "../components/Navbar.jsx";

function HomePage_new() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [schoolId, setSchoolId] = useState(id || null);
    const [schoolName, setSchoolName] = useState(null);
    const [schoolAddress, setSchoolAddress] = useState(null);
    const [schoolPhone, setSchoolPhone] = useState(null);
    const [schoolEmail, setSchoolEmail] = useState(null);
    const [editedSchoolAddress, setEditedSchoolAddress] = useState('');
    const [editedSchoolPhone, setEditedSchoolPhone] = useState('');
    const [editedSchoolEmail, setEditedSchoolEmail] = useState('');
    const [shepInfo, setShepInfo] = useState(null);
    const [gccInfo, setGccInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddGradePopup, setShowAddGradePopup] = useState(false);
    const [showDeleteGradePopup, setShowDeleteGradePopup] = useState(false);
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [showDeleteMemberPopup, setShowDeleteMemberPopup] = useState(false);
    const [showEditInfoPopup, setShowEditInfoPopup] = useState(false);
    const [gradeNumber, setGradeNumber] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [grades, setGrades] = useState([]);
    const [members, setMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');
    const [memberToDelete, setMemberToDelete] = useState('');
    const [totalAbsences, setTotalAbsences] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (schoolId) {
                    response = await axios.get(`http://localhost:4000/schools/${schoolId}`);
                    const absencesResponse = await axios.get(`http://localhost:4000/attendance/school/${schoolId}/past-month`);
                    setTotalAbsences(absencesResponse.data.length);
                } else {
                    response = await axios.get('http://localhost:4000/profile', { withCredentials: true });
                    const { school, schoolId } = response.data;
                    setSchoolId(schoolId);
                    setSchoolName(school.schoolName);
                    setSchoolAddress(school.address || '8827 Goldenwood Lake Ct, Boynton Beach FL, 33473');
                    setSchoolPhone(school.phone || '5619005802');
                    setSchoolEmail(school.email || 'cathy.t.quan@gmail.com');
                    setShepInfo(school.SHEP);
                    setGccInfo(school.GCC);
                    setGrades(school.Classes.sort((a, b) => a.className.localeCompare(b.className)));
                    const absencesResponse = await axios.get(`http://localhost:4000/attendance/school/${schoolId}/past-month`);
                    setTotalAbsences(absencesResponse.data.length);
                }
                if (response.data.school) {
                    const school = response.data.school;
                    setSchoolName(school.schoolName);
                    setSchoolAddress(school.address || '8827 Goldenwood Lake Ct, Boynton Beach FL, 33473');
                    setSchoolPhone(school.phone || '5619005802');
                    setSchoolEmail(school.email || 'cathy.t.quan@gmail.com');
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
    }, [schoolId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleAddGrade = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4000/schools/${schoolId}/addClass`, {
                className: gradeNumber,
                teacherName,
                teacherEmail
            });
            setGrades([...grades, response.data].sort((a, b) => a.className.localeCompare(b.className)));
            setShowAddGradePopup(false);
            setGradeNumber('');
            setTeacherName('');
            setTeacherEmail('');
        } catch (error) {
            console.error('There was an error adding the grade!', error);
        }
    };

    const handleDeleteGrade = async (e) => {
        e.preventDefault();
        if (window.confirm(`Are you sure you want to delete the grade ${selectedGrade}?`)) {
            try {
                await axios.delete(`http://localhost:4000/schools/${schoolId}/deleteClass`, {
                    data: {className: selectedGrade}
                });
                setGrades(grades.filter(grade => grade.className !== selectedGrade).sort((a, b) => a.className.localeCompare(b.className)));
                setShowDeleteGradePopup(false);
            } catch (error) {
                console.error('There was an error deleting the grade!', error);
            }
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            if ((newMemberRole === 'SHEP' && shepInfo) || (newMemberRole === 'GCC' && gccInfo)) {
                alert(`A ${newMemberRole} already exists for this school.`);
                return;
            }

            const response = await axios.post(`http://localhost:4000/register`, {
                name: newMemberName,
                role: newMemberRole,
                email: newMemberEmail.toLowerCase(),
                phone: newMemberPhone,
                password: newMemberName,
                school: schoolId
            });

            setMembers([...members, response.data]);

            if (newMemberRole === 'SHEP') {
                setShepInfo(response.data);
            } else if (newMemberRole === 'GCC') {
                setGccInfo(response.data);
            }

            setShowAddMemberPopup(false);
            setNewMemberName('');
            setNewMemberRole('');
            setNewMemberEmail('');
            setNewMemberPhone('');
        } catch (error) {
            console.error('There was an error adding the member!', error);
        }
        if (error.response && error.response.data && error.response.data.error) {
            alert(error.response.data.error);
        } else {
            alert('There was an error adding the member. Please try again.');
        }
    };

    const handleDeleteMember = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm(`Are you sure you want to delete the member ${memberToDelete}? This action cannot be undone.`);
        if (!confirmed) {
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:4000/deleteMember`, {
                data: {name: memberToDelete, school: schoolId}
            });

            if (response.data.message === 'Member deleted successfully.') {
                setMembers(members.filter(member => member.name !== memberToDelete));

                if (shepInfo && shepInfo.name === memberToDelete) {
                    setShepInfo(null);
                } else if (gccInfo && gccInfo.name === memberToDelete) {
                    setGccInfo(null);
                }
                if (user.name === memberToDelete) {
                    setUser(null);  // Clear the user context
                    navigate('/login');  // Redirect to login page
                }

                setShowDeleteMemberPopup(false);
                setMemberToDelete('');
            } else {
                console.error(response.data.error);
            }
        } catch (error) {
            console.error('There was an error deleting the member!', error);
        }
    };

    const handleClosePopup = () => {
        if (showEditInfoPopup && (
            editedSchoolAddress !== schoolAddress ||
            editedSchoolPhone !== schoolPhone ||
            editedSchoolEmail !== schoolEmail)) {
            if (window.confirm('Are you sure you want to exit? Your changes will not be saved.')) {
                setShowAddGradePopup(false);
                setShowDeleteGradePopup(false);
                setShowAddMemberPopup(false);
                setShowDeleteMemberPopup(false);
                setShowEditInfoPopup(false);
            }
        } else {
            setShowAddGradePopup(false);
            setShowDeleteGradePopup(false);
            setShowAddMemberPopup(false);
            setShowDeleteMemberPopup(false);
            setShowEditInfoPopup(false);
        }
    };

    const handleGradeClick = (gradeId) => {
        navigate(`/grades/${gradeId}`);
    };

    const handleEditInfo = () => {
        setEditedSchoolAddress(schoolAddress);
        setEditedSchoolPhone(schoolPhone);
        setEditedSchoolEmail(schoolEmail);
        setShowEditInfoPopup(true);
    };

    const handleSaveInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:4000/schools/${schoolId}/updateInfo`, {
                address: editedSchoolAddress,
                phone: editedSchoolPhone,
                email: editedSchoolEmail
            });
            setSchoolAddress(response.data.address);
            setSchoolPhone(response.data.phone);
            setSchoolEmail(response.data.email);
            setShowEditInfoPopup(false);
        } catch (error) {
            console.error('There was an error updating the school info!', error);
        }
    };

    return (
        <div className="shepgcc-home-page">
            <header className="header">
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <Navbar/>
            </header>
            <div className="school-name">
                <h1>{schoolName}</h1>
                <h2>Total Absences in Past Month: {totalAbsences}</h2>
            </div>
            <div className="main-content">
                <div className="school-info">
                    <div className="school-info-container">
                        <div className="basic-school-info">
                            <p>{schoolAddress}</p>
                            <p>{schoolEmail}</p>
                            <p>{schoolPhone}</p>
                            <button onClick={handleEditInfo}>Edit Information</button>
                        </div>
                        <div className='shep-gcc-container'>
                            <div className="shep-gcc-contact-info">
                                {gccInfo ? (
                                    <div className="contact-card">
                                        <div>
                                            <h2>GCC</h2>
                                            <h3>{gccInfo.name}</h3>
                                            <p>{gccInfo.email}</p>
                                            <p>{gccInfo.phone}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>No GCC</div>
                                )}
                                {shepInfo ? (
                                    <div className="contact-card">
                                        <div>
                                            <h2>SHEP</h2>
                                            <h3>{shepInfo.name}</h3>
                                            <p>{shepInfo.email}</p>
                                            <p>{shepInfo.phone}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>No SHEP</div>
                                )}
                            </div>
                            <div className="buttons">
                                <button onClick={() => setShowAddMemberPopup(true)}>Add Member</button>
                                <button onClick={() => setShowDeleteMemberPopup(true)}>Delete Member</button>
                            </div>
                        </div>
                        <div className='grade-buttons'>
                            <button onClick={() => setShowAddGradePopup(true)}>Add Class</button>
                            <button onClick={() => setShowDeleteGradePopup(true)}>Delete Class</button>
                        </div>
                        <div className='absences-info'>
                        </div>
                    </div>
                </div>
                <div className="grade-list">
                    {grades.map(grade => (
                        <button key={grade._id} onClick={() => handleGradeClick(grade._id)}>{grade.className}</button>
                    ))}
                </div>
            </div>

            {showAddGradePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Add Class</h2>
                        <form onSubmit={handleAddGrade}>
                            <label>
                                Class Name:
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
                        <h2>Delete Class</h2>
                        <form onSubmit={handleDeleteGrade}>
                            <label>
                                Select Class:
                                <select
                                    value={selectedGrade}
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                    required
                                >
                                    <option value="">Select Class</option>
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
                            <label>
                                Member Email:
                                <input
                                    type="email"
                                    value={newMemberEmail}
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Member Phone Number:
                                <input
                                    type="text"
                                    value={newMemberPhone}
                                    onChange={(e) => setNewMemberPhone(e.target.value)}
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
                                    {shepInfo && <option value={shepInfo.name}>SHEP - {shepInfo.name}</option>}
                                    {gccInfo && <option value={gccInfo.name}>GCC - {gccInfo.name}</option>}
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

            {showEditInfoPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Edit School Information</h2>
                        <form onSubmit={handleSaveInfo}>
                            <label>
                                Address:
                                <input
                                    type="text"
                                    value={editedSchoolAddress}
                                    onChange={(e) => setEditedSchoolAddress(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Phone Number:
                                <input
                                    type="text"
                                    value={editedSchoolPhone}
                                    onChange={(e) => setEditedSchoolPhone(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={editedSchoolEmail}
                                    onChange={(e) => setEditedSchoolEmail(e.target.value)}
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
        </div>
    );
}

export default HomePage_new;