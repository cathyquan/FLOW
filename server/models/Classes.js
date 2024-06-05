const mongoose = require("mongoose");
const {Schema} = mongoose;

const classSchema = new Schema({
    className: String,
    teacherName: String,
    teacherEmail: String,
    school: { type: Schema.Types.ObjectId, ref: 'School'},
});

const classModel = mongoose.model('Class', classSchema);

module.exports = classModel;