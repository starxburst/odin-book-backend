const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

const avatarSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('Avatar', avatarSchema);