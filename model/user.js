const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 6,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);