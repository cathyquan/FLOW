const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
    name: String,
    student_id: String,
    dob: Date,
    g1_name: String,
    g1_phone: String,
    school: { type: Schema.Types.ObjectId, ref: 'School' },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
});

studentSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const studentId = this._id;

    // Delete related attendance records
    await mongoose.model('Attendance').deleteMany({ student: studentId });

    next();
});

const studentModel = mongoose.model('Student', studentSchema);

module.exports = studentModel;