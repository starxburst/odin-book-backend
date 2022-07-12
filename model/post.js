const mongoose = require('mongoose');
const { format } = require('date-fns');

const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        /*required: true*/
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024
    },
    timestamp: {
        type: Date,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Post', postSchema);