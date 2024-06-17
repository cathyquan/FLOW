const mongoose = require("mongoose");
const {Schema} = mongoose;

const studentSchema = new Schema({
    name: String,
    g1_name: String,
    g1_phne: String,
    g2_name: String,
    g2_phone: String,
    g3_name: String,
    g3_phone: String,
    school: { type: Schema.Types.ObjectId, ref: 'School'},
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
});

const studentModel = mongoose.model('Student', studentSchema);

module.exports = studentModel;