const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User.js');
const School = require('./models/Schools.js');
const Class = require('./models/Classes.js');
const Student = require('./models/Students.js');
const Message = require('./models/Messages.js');
const Attendance = require('./models/Attendance.js');
require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(6);
const jwtSecret = 'aewd8tueqwioadvjs902';

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

// Test route
app.get('/test', (req, res) => {
    res.json('test ok');
});

// USER AUTHENTICATION AND MANAGEMENT

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body
    const userDoc = await User.findOne({ email: email.toLowerCase() }); // Find the user by email (case-insensitive)
    if (userDoc) { // If user is found
        const passOk = bcrypt.compareSync(password, userDoc.password); // Compare the provided password with the stored hashed password
        if (passOk) { // If password matches
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => { // Create a JWT token
                if (err) throw err; // If there's an error during token creation, throw it
                res.cookie('token', token).json(userDoc); // Set the token as a cookie and return the user document
            });
        } else {
            res.status(422).json('pass not ok'); // If password doesn't match, respond with an error
        }
    } else {
        res.json('not found'); // If user is not found, respond with 'not found'
    }
});

// User registration
// User registration
app.post('/register', async (req, res) => {
    const { email, password, role, school, name, phone } = req.body; // Extract registration details from the request body

    try {
        const lowercaseEmail = email.toLowerCase(); // Convert email to lowercase for consistency
        const sanitizedPassword = password.replace(/\s+/g, ''); // Remove all spaces from the password

        const existingEmailUser = await User.findOne({ email: lowercaseEmail }); // Check if a user with the same email already exists
        if (existingEmailUser) {
            return res.status(400).json({ error: 'Email already exists.' }); // If email exists, respond with an error
        }

        const existingUser = await User.findOne({ school, userType: role }); // Check if the role already exists for the school
        if (existingUser) {
            return res.status(400).json({ error: `${role} already exists for this school.` }); // If role exists, respond with an error
        }

        const userDoc = await User.create({
            email: lowercaseEmail, // Use the lowercase email
            password: bcrypt.hashSync(sanitizedPassword, bcryptSalt), // Hash the sanitized password
            userType: role, // Assign role
            school, // Assign school
            name, // Assign name
            phone, // Assign phone
        });

        const schoolDoc = await School.findById(school); // Find the school by ID
        if (!schoolDoc) {
            return res.status(404).json({ error: 'School not found.' }); // If school is not found, respond with an error
        }

        if (role === 'SHEP') {
            schoolDoc.SHEP = userDoc._id; // If role is SHEP, update the SHEP field in the school document
        } else if (role === 'GCC') {
            schoolDoc.GCC = userDoc._id; // If role is GCC, update the GCC field in the school document
        }

        await schoolDoc.save(); // Save the updated school document
        res.json(userDoc); // Respond with the newly created user document
    } catch (error) {
        console.error('Error registering user:', error); // Log the error
        res.status(500).json({ error: 'Internal server error.' }); // Respond with a generic error message
    }
});

// User logout
app.post('/logout', async (req, res) => {
    res.cookie('token', '').json(true); // Clear the JWT token cookie and respond with true
});

// Get user profile
app.get('/profile', (req, res) => {
    const { token } = req.cookies; // Extract token from cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => { // Verify the token
            if (err) throw err; // If there's an error during verification, throw it
            const user = await User.findById(userData.id).populate({
                path: 'school',
                populate: [
                    { path: 'SHEP', select: 'name email phone' }, // Populate SHEP details
                    { path: 'GCC', select: 'name email phone' }, // Populate GCC details
                    { 
                        path: 'Classes',
                        select: 'className teacherName',
                        populate: {
                            path: 'students', // Populate students in each class
                        }
                    }
                ]
            });
            const { email, id, userType, school, name, phone } = user; // Destructure user details
            res.json({ email, id, userType, school, name, phone, schoolId: school._id }); // Respond with user details and school ID
        });
    } else {
        res.json(null); // If no token, respond with null
    }
});

// Get user info
app.get('/info', (req, res) => {
    const { token } = req.cookies; // Extract token from cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => { // Verify the token
            if (err) throw err; // If there's an error during verification, throw it
            const user = await User.findById(userData.id); // Find user by ID
            if (user) {
                const { email, id, userType, name, phone } = user; // Destructure user details
                res.json({ email, id, userType, name, phone }); // Respond with user details
            } else {
                res.status(404).json({ error: 'User not found' }); // If user not found, respond with an error
            }
        });
    } else {
        res.json(null); // If no token, respond with null
    }
});

// Update user profile
app.post('/updateProfile', async (req, res) => {
    const { email, name, phone, position } = req.body; // Extract updated details from the request body
    const { token } = req.cookies; // Extract token from cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => { // Verify the token
            if (err) throw err; // If there's an error during verification, throw it
            const user = await User.findById(userData.id); // Find user by ID
            user.email = email; // Update email
            user.name = name; // Update name
            user.phone = phone; // Update phone
            user.userType = position; // Update position
            await user.save(); // Save the updated user document
            res.json(user); // Respond with the updated user document
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' }); // If no token, respond with unauthorized
    }
});

// Delete member
app.delete('/deleteMember', async (req, res) => {
    const { name, school } = req.body; // Extract name and school from the request body

    try {
        const userDoc = await User.findOneAndDelete({ name, school }); // Find and delete the user by name and school

        if (!userDoc) {
            return res.status(404).json({ error: 'Member not found.' }); // If user not found, respond with an error
        }

        const schoolDoc = await School.findById(school); // Find the school by ID
        if (userDoc.userType === 'SHEP') {
            schoolDoc.SHEP = null; // If user was SHEP, set SHEP field to null
        } else if (userDoc.userType === 'GCC') {
            schoolDoc.GCC = null; // If user was GCC, set GCC field to null
        }
        await schoolDoc.save(); // Save the updated school document

        res.json({ message: 'Member deleted successfully.' }); // Respond with success message
    } catch (error) {
        res.status(500).json({ error: 'There was an error deleting the member.' }); // If there's an error, respond with a generic error message
    }
});

// Delete user by ID
app.delete('/deleteProfile', async (req, res) => {
    const { userId } = req.body; // Extract user ID from the request body
    try {
        const userDoc = await User.findByIdAndDelete(userId); // Find and delete the user by ID

        if (!userDoc) {
            return res.status(404).json({ error: 'User not found.' }); // If user not found, respond with an error
        }

        const schoolDoc = await School.findById(userDoc.school); // Find the school by user ID
        if (schoolDoc) {
            if (userDoc.userType === 'SHEP') {
                schoolDoc.SHEP = null; // If user was SHEP, set SHEP field to null
            } else if (userDoc.userType === 'GCC') {
                schoolDoc.GCC = null; // If user was GCC, set GCC field to null
            }
            await schoolDoc.save(); // Save the updated school document
        }

        res.json({ message: 'User deleted successfully.' }); // Respond with success message
    } catch (error) {
        console.error('Error deleting user:', error); // Log the error
        res.status(500).json({ error: 'Internal server error.' }); // Respond with a generic error message
    }
});

// PASSWORD MANAGEMENT

// Change password
app.post('/changePassword', async (req, res) => {
    const { newPassword } = req.body; // Extract new password from the request body
    const { token } = req.cookies; // Extract token from cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => { // Verify the token
            if (err) throw err; // If there's an error during verification, throw it
            const user = await User.findById(userData.id); // Find user by ID
            user.password = bcrypt.hashSync(newPassword, bcryptSalt); // Hash the new password and update it
            await user.save(); // Save the updated user document
            res.json({ success: true }); // Respond with success
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' }); // If no token, respond with unauthorized
    }
});

// Check password
app.post('/checkPassword', async (req, res) => {
    const { currentPassword } = req.body; // Extract current password from the request body
    const { token } = req.cookies; // Extract token from cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => { // Verify the token
            if (err) throw err; // If there's an error during verification, throw it
            const user = await User.findById(userData.id); // Find user by ID
            const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password); // Compare provided password with the stored hashed password
            if (isPasswordCorrect) { // If password matches
                res.json({ success: true }); // Respond with success
            } else {
                res.json({ success: false }); // If password doesn't match, respond with failure
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' }); // If no token, respond with unauthorized
    }
});

// SCHOOL MANAGEMENT

// Add school
app.post('/addSchool', async (req, res) => {
    const { schoolName, schoolLocation, schoolEmail, schoolPhone } = req.body; // Extract school details from the request body

    if (!schoolName) {
        return res.status(400).json({ message: 'School name is required' }); // If school name is not provided, respond with an error
    }

    try {
        const existingSchool = await School.findOne({ schoolName: schoolName }); // Check if a school with the same name already exists
        if (existingSchool) {
            return res.status(409).json({ message: 'School name already exists' }); // If school name exists, respond with a conflict error
        }

        const schoolDoc = await School.create({
            schoolName, // Create a new school document
            address: schoolLocation,
            email: schoolEmail,
            phone: schoolPhone,
        });
        res.json(schoolDoc); // Respond with the newly created school document
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error creating school' }); // Respond with a generic error message
    }
});

// Get all schools
app.get('/getSchools', async (req, res) => {
    try {
        const schools = await School.find({}, { schoolName: 1 }); // Fetch all schools, only selecting the school names
        res.json(schools); // Respond with the list of schools
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching schools' }); // Respond with a generic error message
    }
});

// Get school details by ID
app.get('/schools/:id', async (req, res) => {
    const { id } = req.params; // Extract school ID from the request parameters
    try {
        const school = await School.findById(id).populate('SHEP').populate('GCC').populate('Classes'); // Find school by ID and populate related fields
        if (school) {
            res.json({ school }); // If school is found, respond with the school details
        } else {
            res.status(404).json({ message: 'School not found' }); // If school is not found, respond with an error
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching school details' }); // Respond with a generic error message
    }
});

// Update school information
app.put('/schools/:id/updateInfo', async (req, res) => {
    const { id } = req.params; // Extract school ID from the request parameters
    const { address, phone, email } = req.body; // Extract updated school details from the request body

    try {
        const school = await School.findByIdAndUpdate(
            id,
            { address, phone, email }, // Update the school document with new details
            { new: true } // Return the updated document
        );

        if (!school) {
            return res.status(404).json({ message: 'School not found' }); // If school is not found, respond with an error
        }

        res.json(school); // Respond with the updated school document
    } catch (error) {
        console.error('There was an error updating the school info!', error); // Log the error
        res.status(500).json({ message: 'Error updating school info' }); // Respond with a generic error message
    }
});

// Delete school
app.delete('/deleteSchool', async (req, res) => {
    const { schoolName } = req.body; // Extract school name from the request body
    try {
        const schoolDoc = await School.findOne({ schoolName: schoolName }); // Find the school by name
        if (schoolDoc) {
            await schoolDoc.deleteOne(); // Delete the school document
            res.json({ message: 'School deleted successfully', school: schoolDoc }); // Respond with success message and the deleted school document
        } else {
            res.status(404).json({ message: 'School not found' }); // If school is not found, respond with an error
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error deleting school' }); // Respond with a generic error message
    }
});

// CLASS MANAGEMENT

// Add class to school
app.post('/schools/:id/addClass', async (req, res) => {
    const { id } = req.params; // Extract school ID from the request parameters
    const { className, teacherName, teacherEmail } = req.body; // Extract class details from the request body

    try {
        const newClass = await Class.create({ className, teacherName, teacherEmail, school: id }); // Create a new class
        const school = await School.findById(id); // Find the school by ID
        school.Classes.push(newClass._id); // Add the new class to the school's class list
        await school.save(); // Save the updated school document
        res.json(newClass); // Respond with the newly created class
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error adding class' }); // Respond with a generic error message
    }
});

// Delete class from school
app.delete('/schools/:id/deleteClass', async (req, res) => {
    const { id } = req.params; // Extract school ID from the request parameters
    const { className } = req.body; // Extract class name from the request body

    try {
        const school = await School.findById(id).populate('Classes'); // Find the school by ID and populate its classes
        const classToDelete = school.Classes.find(cls => cls.className === className); // Find the class to delete by name

        if (!classToDelete) {
            return res.status(404).json({ message: 'Class not found' }); // If class is not found, respond with an error
        }

        const classDoc = await Class.findById(classToDelete._id); // Find the class document by ID
        if (classDoc) {
            await classDoc.deleteOne(); // Delete the class document
            school.Classes.pull(classToDelete._id); // Remove the class from the school's class list
            await school.save(); // Save the updated school document
            res.json({ message: 'Class deleted successfully' }); // Respond with success message
        } else {
            res.status(404).json({ message: 'Class not found' }); // If class document is not found, respond with an error
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error deleting class' }); // Respond with a generic error message
    }
});

// Get grade details by ID
app.get('/grades/:id', async (req, res) => {
    const { id } = req.params; // Extract grade ID from the request parameters
    try {
        const grade = await Class.findById(id).populate('students'); // Find the grade by ID and populate its students
        if (grade) {
            res.json({ grade }); // If grade is found, respond with the grade details
        } else {
            res.status(404).json({ message: 'Grade not found' }); // If grade is not found, respond with an error
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching grade details' }); // Respond with a generic error message
    }
});

// STUDENT MANAGEMENT

// Add student to class
app.post('/grades/:id/addStudent', async (req, res) => {
    const { id } = req.params; // Extract grade ID from the request parameters
    const { name, student_id, dob, g1_name, g1_phone } = req.body; // Extract student details from the request body

    try {
        const student = await Student.create({ name, student_id, dob, g1_name, g1_phone, class: id }); // Create a new student
        const classDoc = await Class.findById(id); // Find the class by ID
        classDoc.students.push(student._id); // Add the new student to the class's student list
        await classDoc.save(); // Save the updated class document
        res.json(student); // Respond with the newly created student
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error adding student' }); // Respond with a generic error message
    }
});

// Delete student from class
app.post('/grades/:id/deleteStudent', async (req, res) => {
    const { id } = req.params; // Extract grade ID from the request parameters
    const { studentName } = req.body; // Extract student name from the request body

    try {
        const classDoc = await Class.findById(id).populate('students'); // Find the class by ID and populate its students
        const studentToDelete = classDoc.students.find(student => student.name === studentName); // Find the student to delete by name

        if (!studentToDelete) {
            return res.status(404).json({ message: 'Student not found' }); // If student is not found, respond with an error
        }

        const studentDoc = await Student.findById(studentToDelete._id); // Find the student document by ID
        if (studentDoc) {
            await studentDoc.deleteOne(); // Delete the student document
            classDoc.students.pull(studentToDelete._id); // Remove the student from the class's student list
            await classDoc.save(); // Save the updated class document
            res.json({ message: 'Student deleted successfully' }); // Respond with success message
        } else {
            res.status(404).json({ message: 'Student not found' }); // If student document is not found, respond with an error
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error deleting student' }); // Respond with a generic error message
    }
});

// Get student details by ID
app.get('/students/:id', async (req, res) => {
    const { id } = req.params; // Extract student ID from the request parameters
    try {
        const student = await Student.findById(id).populate('class', 'className'); // Find the student by ID and populate class information
        if (student) {
            res.json(student); // If student is found, respond with the student details
        } else {
            res.status(404).json({ message: 'Student not found' }); // If student is not found, respond with an error
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching student details' }); // Respond with a generic error message
    }
});

// Update student information
app.put('/students/:id', async (req, res) => {
    const { id } = req.params; // Extract student ID from the request parameters
    const { name, student_id, dob, g1_name, g1_phone } = req.body; // Extract updated student details from the request body

    try {
        const student = await Student.findById(id); // Find the student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' }); // If student is not found, respond with an error
        }

        student.name = name; // Update student name
        student.student_id = student_id; // Update student ID
        student.dob = new Date(dob); // Update student date of birth
        student.g1_name = g1_name; // Update guardian name
        student.g1_phone = g1_phone; // Update guardian phone number

        await student.save(); // Save the updated student document

        res.json(student); // Respond with the updated student
    } catch (error) {
        console.error('Error updating student information:', error); // Log the error
        res.status(500).json({ message: 'Error updating student information' }); // Respond with a generic error message
    }
});

// ATTENDANCE MANAGEMENT

// Save attendance
app.post('/attendance/save', async (req, res) => {
    const { date, attendance } = req.body; // Extract date and attendance records from request body

    try {
        const studentIds = attendance.map(att => att.student); // Get an array of student IDs from the attendance records
        await Attendance.deleteMany({ date, student: { $in: studentIds } }); // Delete existing attendance records for the given date and students

        const newRecords = attendance
            .filter(att => att.status !== 'Present') // Filter out records where the student is present
            .map(att => ({
                date, // Set the date for the new attendance record
                student: att.student, // Set the student ID for the new attendance record
                status: att.status // Set the status (reason for absence) for the new attendance record
            }));

        await Attendance.insertMany(newRecords); // Insert the new attendance records into the database

        res.status(200).json({ message: 'Attendance records saved successfully.' }); // Respond with success message
    } catch (error) {
        console.error('Error saving attendance:', error); // Log the error
        res.status(500).json({ message: 'Error saving attendance records.' }); // Respond with a generic error message
    }
});

// Get attendance records for a student
app.get('/attendance/student/:studentId', async (req, res) => {
    const { studentId } = req.params; // Extract student ID from request parameters
    try {
        const attendanceRecords = await Attendance.find({ student: studentId }); // Find attendance records for the student
        res.status(200).json(attendanceRecords); // Respond with the attendance records
    } catch (error) {
        console.error('Error fetching attendance data:', error); // Log the error
        res.status(500).json({ message: 'Error fetching attendance data.' }); // Respond with a generic error message
    }
});

// Get past month's absences for a school
app.get('/attendance/school/:schoolId/past-month', async (req, res) => {
    const { schoolId } = req.params; // Extract school ID from request parameters
    const oneMonthAgo = new Date(); // Get the current date
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Set the date to one month ago

    try {
        const school = await School.findById(schoolId).populate({
            path: 'Classes',
            populate: {
                path: 'students',
                select: '_id' // Only select the student IDs
            }
        });

        const studentIds = school.Classes.flatMap(cls => cls.students.map(student => student._id)); // Get an array of student IDs for the school

        const absences = await Attendance.find({
            student: { $in: studentIds }, // Find absences for the students
            date: { $gte: oneMonthAgo } // Only include absences from the past month
        });

        res.status(200).json(absences); // Respond with the absences
    } catch (error) {
        console.error('Error fetching past month\'s absences:', error); // Log the error
        res.status(500).json({ message: 'Error fetching past month\'s absences.' }); // Respond with a generic error message
    }
});

// Get total absences for a grade
app.get('/attendance/grade/:gradeId/totalAbsences', async (req, res) => {
    const { gradeId } = req.params; // Extract grade ID from request parameters
    try {
        const grade = await Class.findById(gradeId).populate('students'); // Find the grade by ID and populate its students
        const studentIds = grade.students.map(student => student._id); // Get an array of student IDs for the grade
        const totalAbsences = await Attendance.countDocuments({
            student: { $in: studentIds } // Count the total number of absences for the students
        });
        res.json({ totalAbsences }); // Respond with the total number of absences
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching total absences' }); // Respond with a generic error message
    }
});

// Get schools with the most absences in the past month
app.get('/admin/schools-with-most-absences', async (req, res) => {
    const oneMonthAgo = new Date(); // Get the current date
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Set the date to one month ago

    try {
        const schools = await School.find().populate({
            path: 'Classes',
            populate: {
                path: 'students',
                select: '_id' // Only select the student IDs
            }
        });

        const schoolAbsenceCounts = await Promise.all(schools.map(async (school) => {
            const studentIds = school.Classes.flatMap(cls => cls.students.map(student => student._id)); // Get an array of student IDs for the school

            const absences = await Attendance.find({
                student: { $in: studentIds }, // Find absences for the students
                date: { $gte: oneMonthAgo } // Only include absences from the past month
            });

            return { school, absences: absences.length }; // Return the school and the number of absences
        }));

        schoolAbsenceCounts.sort((a, b) => b.absences - a.absences); // Sort the schools by the number of absences in descending order
        res.status(200).json(schoolAbsenceCounts.slice(0, 20)); // Respond with the top 20 schools with the most absences
    } catch (error) {
        console.error('Error fetching schools with most absences:', error); // Log the error
        res.status(500).json({ message: 'Error fetching schools with most absences.' }); // Respond with a generic error message
    }
});

// MESSAGING

// Get messages for a user
app.get('/messages/:userID', async (req, res) => {
    const { userID } = req.params; // Extract user ID from request parameters
    try {
        const user = await User.findById(userID); // Find the user by ID
        if (user) {
            const school = await School.findById(user.school).populate('Messages'); // Find the school and populate its messages
            const messages = school ? school.Messages : []; // Get the messages for the school
            res.json(messages); // Respond with the messages
        } else {
            res.status(404).json({ message: 'User not found' }); // If user is not found, respond with an error
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching messages' }); // Respond with a generic error message
    }
});

// Send message from user
app.post('/:userID/sendMessage', async (req, res) => {
    const { userID } = req.params; // Extract user ID from request parameters
    const { subject, body } = req.body; // Extract message subject and body from request body
    try {
        const user = await User.findById(userID); // Find the user by ID
        if (user) {
            const school = await School.findById(user.school); // Find the school by user school ID
            const newMessage = await Message.create({
                subject, // Set the subject for the new message
                body, // Set the body for the new message
                date: new Date(), // Set the current date for the new message
                school: school._id, // Set the school ID for the new message
                sender: school.schoolName, // Set the sender as the school name
            });
            school.Messages.push(newMessage._id); // Add the new message to the school's message list
            await school.save(); // Save the updated school document
            res.json(newMessage); // Respond with the newly created message
        } else {
            res.status(404).json({ message: 'User not found' }); // If user is not found, respond with an error
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error sending message' }); // Respond with a generic error message
    }
});

// Get latest messages for admin
app.get('/admin/messages', async (req, res) => {
    const limit = 50; // Set the limit for the number of messages to retrieve
    try {
        const messages = await Message.find().sort({ date: -1 }).limit(limit).populate('school', 'schoolName'); // Find and sort messages by date in descending order, limiting the number to 50, and populate school names
        res.json(messages); // Respond with the messages
    } catch (error) {
        console.error('Error fetching messages:', error); // Log the error
        res.status(500).json({ message: 'Error fetching messages' }); // Respond with a generic error message
    }
});

// Start server
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
