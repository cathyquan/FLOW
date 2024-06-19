const mongoose = require("mongoose");
const {Schema} = mongoose;

const messageSchema = new Schema({
    subject: String,
    body: String,
    date: Date,
    school: { type: Schema.Types.ObjectId, ref: 'School'},
    sender: String,
});

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;