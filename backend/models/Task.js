// backend/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
    dateTime: {
        type: Date,
        required: true, 
    },
    duration: {
        type: Number, 
        required: true,
    },
    location: {
        type: String,
    },
    // --- NEW PRIORITY FIELD ---
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Very Important'], // Only these values allowed
        default: 'Medium',
    },
    isRecurring: {
        type: Boolean,
        default: false, 
    },
    emailReminder: {
        type: Boolean,
        default: false, 
    },
    isCompleted: {
        type: Boolean,
        default: false, 
    },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);