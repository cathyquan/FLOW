const mongoose = require("mongoose");
const {Schema} = mongoose;

const studentSchema = new Schema({
    name: String,
    g1_name: String,
    g1_email: String,
    g2_name: String,
    g2_email: String,
    g3_name: String,
    g3_email: String,
    school: { type: Schema.Types.ObjectId, ref: 'School'},
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
});

const studentModel = mongoose.model('Student', studentSchema);

module.exports = studentModel;