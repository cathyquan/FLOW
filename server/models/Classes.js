const mongoose = require("mongoose");
const {Schema} = mongoose;

const classSchema = new Schema({
    className: String,
});

const classModel = mongoose.model('Class', classSchema);

module.exports = classModel;