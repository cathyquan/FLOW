const mongoose = require("mongoose");
const {Schema} = mongoose;

const schoolSchema = new Schema({
    schoolName: {type:String, unique:true, required:true},
});

const schoolModel = mongoose.model('School', schoolSchema);

module.exports = schoolModel;