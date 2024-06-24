const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User.js");
const School = require("./models/Schools.js");
const Class = require("./models/Classes.js");
const Student = require("./models/Students.js");
const Message = require("./models/Messages.js");
const Attendance = require("./models/Attendance.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const bcryptSalt = bcrypt.genSaltSync(6);
const jwtSecret = 'aewd8tueqwioadvjs902';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }

    /*try {
        const userDoc = await User.create({
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            userType: 'admin',
            phone: '233245520682',
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }*/
});


app.post('/register', async (req, res) => {
    const { email, password, role, school, name, phone } = req.body;

    try {
        // Convert email to lowercase to ensure consistency
        const lowercaseEmail = email.toLowerCase();

        // Check if a user with the same email already exists
        const existingEmailUser = await User.findOne({ email: lowercaseEmail });
        if (existingEmailUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        // Check if the userType already exists for the school
        const existingUser = await User.findOne({ school, userType: role });
        if (existingUser) {
            return res.status(400).json({ error: `${role} already exists for this school.` });
        }

        // Create the new user
        const userDoc = await User.create({
            email: lowercaseEmail,
            password: bcrypt.hashSync(password, bcryptSalt),
            userType: role,
            school,
            name,
            phone,
        });

        // Update the school's SHEP or GCC field
        const schoolDoc = await School.findById(school);
        if (!schoolDoc) {
            return res.status(404).json({ error: 'School not found.' });
        }

        if (role === 'SHEP') {
            schoolDoc.SHEP = userDoc._id;
        } else if (role === 'GCC') {
            schoolDoc.GCC = userDoc._id;
        }

        await schoolDoc.save();

        res.json(userDoc);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.delete('/deleteMember', async (req, res) => {
    const { name, school } = req.body;

    try {
        const userDoc = await User.findOneAndDelete({ name, school });

        if (!userDoc) {
            return res.status(404).json({ error: 'Member not found.' });
        }

        const schoolDoc = await School.findById(school);
        if (userDoc.userType === 'SHEP') {
            schoolDoc.SHEP = null;
        } else if (userDoc.userType === 'GCC') {
            schoolDoc.GCC = null;
        }
        await schoolDoc.save();

        res.json({ message: 'Member deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'There was an error deleting the member.' });
    }
});

// Endpoint to delete a user by their ID
app.delete('/deleteProfile', async (req, res) => {
    const { userId } = req.body;
    try {
        const userDoc = await User.findByIdAndDelete(userId);

        if (!userDoc) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const schoolDoc = await School.findById(userDoc.school);
        if (schoolDoc) {
            if (userDoc.userType === 'SHEP') {
                schoolDoc.SHEP = null;
            } else if (userDoc.userType === 'GCC') {
                schoolDoc.GCC = null;
            }
            await schoolDoc.save();
        }

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


app.post('/logout', async (req, res) => {
    res.cookie('token', '').json(true);
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const user = await User.findById(userData.id).populate({
                path: 'school',
                populate: [
                    { path: 'SHEP', select: 'name email phone' },
                    { path: 'GCC', select: 'name email phone' },
                    { 
                        path: 'Classes',
                        select: 'className teacherName',
                        populate: {
                            path: 'students', 
                        }
                    }
                ]
            });
            const { email, id, userType, school, name, phone } = user;
            res.json({ email, id, userType, school, name, phone, schoolId: school._id });
        });
    } else {
        res.json(null);
    }
});

app.get('/info', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const user = await User.findById(userData.id);
            if (user) {
                const { email, id, userType, name, phone } = user;
                res.json({ email, id, userType, name, phone });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        });
    } else {
        res.json(null);
    }
});

app.post('/updateProfile', async (req, res) => {
    const { email, name, phone, position } = req.body;
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const user = await User.findById(userData.id);
            user.email = email;
            user.name = name;
            user.phone = phone;
            user.userType = position;
            await user.save();
            res.json(user);
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/addSchool', async (req, res) => {
    const { schoolName } = req.body;

    // Check if schoolName is provided
    if (!schoolName) {
        return res.status(400).json({ message: 'School name is required' });
    }

    try {
        // Check for duplicate schoolName
        const existingSchool = await School.findOne({ schoolName: schoolName });
        if (existingSchool) {
            return res.status(409).json({ message: 'School name already exists' }); // 409 Conflict
        }

        // Create the new school
        const schoolDoc = await School.create({
            schoolName,
        });
        res.json(schoolDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating school' });
    }
});


app.get('/getSchools', async (req, res) => {
    try {
        const schools = await School.find({}, { schoolName: 1 }); // Fetching only the school names
        res.json(schools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching schools' });
    }
});

app.get('/schools/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const school = await School.findById(id).populate('SHEP').populate('GCC').populate('Classes');
        if (school) {
            res.json({ school });
        } else {
            res.status(404).json({ message: 'School not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching school details' });
    }
});

app.post('/schools/:id/addClass', async (req, res) => {
    const { id } = req.params;
    const { className, teacherName, teacherEmail } = req.body;

    try {
        const newClass = await Class.create({ className, teacherName, teacherEmail, school: id });
        const school = await School.findById(id);
        school.Classes.push(newClass._id);
        await school.save();
        res.json(newClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding class' });
    }
});

app.delete('/schools/:id/deleteClass', async (req, res) => {
    const { id } = req.params;
    const { className } = req.body;

    try {
        const school = await School.findById(id).populate('Classes');
        const classToDelete = school.Classes.find(cls => cls.className === className);

        if (!classToDelete) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const classDoc = await Class.findById(classToDelete._id);
        if (classDoc) {
            await classDoc.deleteOne();
            school.Classes.pull(classToDelete._id);
            await school.save();
            res.json({ message: 'Class deleted successfully' });
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting class' });
    }
});


app.get('/grades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const grade = await Class.findById(id).populate('students');
        if (grade) {
            res.json({ grade });
        } else {
            res.status(404).json({ message: 'Grade not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching grade details' });
    }
});

app.delete('/deleteSchool', async (req, res) => {
    const { schoolName } = req.body;
    try {
        const schoolDoc = await School.findOne({ schoolName: schoolName });
        if (schoolDoc) {
            await schoolDoc.deleteOne();
            res.json({ message: 'School deleted successfully', school: schoolDoc });
        } else {
            res.status(404).json({ message: 'School not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting school' });
    }
});


app.post('/grades/:id/addStudent', async (req, res) => {
    const { id } = req.params;
    const { name, student_id, dob, g1_name, g1_phone } = req.body;

    try {
        const student = await Student.create({ name, student_id, dob, g1_name, g1_phone, class: id });
        const classDoc = await Class.findById(id);
        classDoc.students.push(student._id);
        await classDoc.save();
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding student' });
    }
});


// Add a student to a class
app.post('/grades/:id/addStudent', async (req, res) => {
    const { id } = req.params;
    const { name, g1_name, g1_phone } = req.body;

    try {
        const student = await Student.create({ name, g1_name, g1_phone, class: id });
        const classDoc = await Class.findById(id);
        classDoc.students.push(student._id);
        await classDoc.save();
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding student' });
    }
});

// Delete a student from a class
app.post('/grades/:id/deleteStudent', async (req, res) => {
    const { id } = req.params;
    const { studentName } = req.body;

    try {
        const classDoc = await Class.findById(id).populate('students');
        const studentToDelete = classDoc.students.find(student => student.name === studentName);

        if (!studentToDelete) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentDoc = await Student.findById(studentToDelete._id);
        if (studentDoc) {
            await studentDoc.deleteOne();
            classDoc.students.pull(studentToDelete._id);
            await classDoc.save();
            res.json({ message: 'Student deleted successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting student' });
    }
});


app.get('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id).populate('class', 'className'); // Populate class information
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching student details' });
    }
});

app.post('/changePassword', async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const user = await User.findById(userData.id);
            user.password = bcrypt.hashSync(newPassword, bcryptSalt);
            await user.save();
            res.json({ success: true });
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});

app.post('/checkPassword', async (req, res) => {
    const { currentPassword } = req.body;
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const user = await User.findById(userData.id);
            const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
            if (isPasswordCorrect) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).populate('school');
        if (user) {
            res.json(user.school);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

app.get('/messages/:userID', async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await User.findById(userID);
        if (user) {
            const school = await School.findById(user.school).populate('Messages');
            const messages = school ? school.Messages : [];
            res.json(messages);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

app.post('/:userID/sendMessage', async (req, res) => {
    const { userID } = req.params;
    const { subject, body } = req.body;
    try {
        const user = await User.findById(userID);
        if(user)
        id = user.school;
        const school = await School.findById(id);
        const newMessage = await Message.create({
            subject,
            body,
            date: new Date(),
            school: id,
            sender: school.schoolName,
        });
        school.Messages.push(newMessage._id);
        await school.save();
        res.json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message' });
    }
});

app.get('/admin/messages', async (req, res) => {
    const limit = 50;
    try {
        const messages = await Message.find().sort({ date: -1 }).limit(limit).populate('school', 'schoolName');
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});
app.post('/attendance/save', async (req, res) => {
    const { date, attendance } = req.body;

    try {
        // Clear existing attendance records for the given date and students in the attendance array
        const studentIds = attendance.map(att => att.student);
        await Attendance.deleteMany({ date, student: { $in: studentIds } });

        // Create new attendance records for the given date
        const newRecords = attendance
            .filter(att => att.status !== 'Present') // Only process absences
            .map(att => ({
                date,
                student: att.student,
                status: att.status
            }));

        await Attendance.insertMany(newRecords);

        res.status(200).json({ message: 'Attendance records saved successfully.' });
    } catch (error) {
        console.error('Error saving attendance:', error);
        res.status(500).json({ message: 'Error saving attendance records.' });
    }
});


app.get('/attendance/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const attendanceRecords = await Attendance.find({ student: studentId });
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ message: 'Error fetching attendance data.' });
    }
});

app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, student_id, dob, g1_name, g1_phone } = req.body;

    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.name = name;
        student.student_id = student_id;
        student.dob = new Date(dob);
        student.g1_name = g1_name;
        student.g1_phone = g1_phone;

        await student.save();

        res.json(student);
    } catch (error) {
        console.error('Error updating student information:', error);
        res.status(500).json({ message: 'Error updating student information' });
    }
});


app.get('/attendance/school/:schoolId/past-month', async (req, res) => {
    const { schoolId } = req.params;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
        const school = await School.findById(schoolId).populate({
            path: 'Classes',
            populate: {
                path: 'students',
                select: '_id'
            }
        });

        const studentIds = school.Classes.flatMap(cls => cls.students.map(student => student._id));

        const absences = await Attendance.find({
            student: { $in: studentIds },
            date: { $gte: oneMonthAgo }
        });

        res.status(200).json(absences);
    } catch (error) {
        console.error('Error fetching past month\'s absences:', error);
        res.status(500).json({ message: 'Error fetching past month\'s absences.' });
    }
});

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
