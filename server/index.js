const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User.js");
const School = require("./models/Schools.js");
const Class = require("./models/Classes.js");
const Student = require("./models/Students.js");
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
    origin: 'http://172.20.10.3:5173',
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
});


app.post('/register', async (req, res) => {
    const { email, password, role, school, name, phone } = req.body;

    // Check if the userType already exists for the school
    const existingUser = await User.findOne({ school, role });
    if (existingUser) {
        return res.status(400).json({ error: `${userType} already exists for this school.` });
    }

    const userDoc = await User.create({
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
        userType: role,
        school,
        name,
        phone,
    });

    // Update the school's SHEP or GCC field
    const schoolDoc = await School.findById(school);
    if (role === 'SHEP') {
        schoolDoc.SHEP = userDoc._id;
    } else if (role === 'GCC') {
        schoolDoc.GCC = userDoc._id;
    }
    await schoolDoc.save();

    res.json(userDoc);
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
            const { email, id, userType, name, phone } = user;
            res.json({ email, id, userType, name, phone});
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
    const schoolDoc = await School.create({
        schoolName,
    })
    res.json(schoolDoc);
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

        await Class.findByIdAndDelete(classToDelete._id);
        school.Classes.pull(classToDelete._id);
        await school.save();
        res.json({ message: 'Class deleted successfully' });
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
        const schoolDoc = await School.findOneAndDelete({ schoolName: schoolName });
        if (schoolDoc) {
            res.json({ message: 'School deleted successfully', school: schoolDoc });
        } else {
            res.status(404).json({ message: 'School not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting school' });
    }
});

app.post('/classes/:classId/addStudent', async (req, res) => {
    const { classId } = req.params;
    const { name, g1_name, g1_email, g2_name, g2_email, g3_name, g3_email, schoolId } = req.body;

    try {
        const newStudent = await Student.create({
            name,
            g1_name,
            g1_email,
            g2_name,
            g2_email,
            g3_name,
            g3_email,
            school: schoolId,
            class: classId
        });

        const classDoc = await Class.findById(classId);
        classDoc.students.push(newStudent._id);
        await classDoc.save();

        res.json(newStudent);
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

        await Student.findByIdAndDelete(studentToDelete._id);
        classDoc.students.pull(studentToDelete._id);
        await classDoc.save();
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting student' });
    }
});

app.get('/students/:id', async (req, res) => {
    //console.log('got student endpoint');
    const { id } = req.params;
    try {
        const student = await Student.findById(id);
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


app.listen(4000, () => {
    console.log('Server running on http://172.20.10.3:4000');
});
