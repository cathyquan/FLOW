const mongoose = require("mongoose");
const { Schema } = mongoose;

const schoolSchema = new Schema({
    schoolName: { type: String, unique: true, required: true },
    address: String,
    email: String,
    phone: String,
    SHEP: { type: Schema.Types.ObjectId, ref: 'User' },
    GCC: { type: Schema.Types.ObjectId, ref: 'User' },
    Classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    Messages: [{ type: Schema.Types.ObjectId, ref: 'Message', default: [] }],
});

schoolSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const schoolId = this._id;

    // Delete related users
    await mongoose.model('User').deleteMany({ school: schoolId });

    // Delete related messages
    await mongoose.model('Message').deleteMany({ school: schoolId });

    // Get all classes of the school
    const classes = await mongoose.model('Class').find({ school: schoolId });

    for (const classDoc of classes) {
        await classDoc.deleteOne();
    }

    next();
});

const schoolModel = mongoose.model('School', schoolSchema);

module.exports = schoolModel;
