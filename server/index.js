const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User.js");
const School = require("./models/Schools.js");
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
    const{email, password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSecret, {}, (err, token) =>{
                if(err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        }
        else{
            res.status(422).json('pass not ok');
        }
    }
    else{
        res.json('not found');
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
                    { path: 'GCC', select: 'name email phone' }
                ]
            });
            const { email, id, userType, school, name, phone } = user;
            res.json({ email, id, userType, school, name, phone });
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
    console.log('add school endpoint hit');
    const {schoolName} = req.body;
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

app.delete('/deleteSchool', async (req, res) => {
    const {schoolName} = req.body;
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

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});