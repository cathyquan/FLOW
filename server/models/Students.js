const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
    name: String,
    student_id: String, // Ensure this field exists
    dob: Date, // Ensure this field exists
    g1_name: String,
    g1_phone: String,
    school: { type: Schema.Types.ObjectId, ref: 'School' },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
});

const studentModel = mongoose.model('Student', studentSchema);

module.exports = studentModel;
