const mongoose = require('mongoose');
const {Schema} = mongoose;


const attendanceSchema = new Schema({
  date: { type: Date, required: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Absent-Menstrual', 'Absent-Resources', 'Absent-Transportation'], required: true }
});

const attendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = attendanceModel;