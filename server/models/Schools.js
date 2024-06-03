const mongoose = require("mongoose");
const {Schema} = mongoose;

const schoolSchema = new Schema({
    schoolName: {type:String, unique:true, required:true},
    SHEP: {type: Schema.Types.ObjectId, ref: 'User'},
    GCC: {type: Schema.Types.ObjectId, ref: 'User'},
    Classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
});

const schoolModel = mongoose.model('School', schoolSchema);

module.exports = schoolModel;