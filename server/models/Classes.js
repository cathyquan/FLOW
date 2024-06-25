const mongoose = require("mongoose");
const { Schema } = mongoose;

const classSchema = new Schema({
    className: String,
    teacherName: String,
    teacherEmail: String,
    school: { type: Schema.Types.ObjectId, ref: 'School' },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
});

classSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const classId = this._id;

    // Get all students of the class
    const students = await mongoose.model('Student').find({ class: classId });

    // Delete all students
    for (const studentDoc of students) {
        await studentDoc.deleteOne();
    }

    next();
});

const classModel = mongoose.model('Class', classSchema);

module.exports = classModel;
