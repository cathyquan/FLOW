const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    email: {type:String, unique:true},
    password: String,
    userType: String,
    school: { type: Schema.Types.ObjectId, ref: 'School'},
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;