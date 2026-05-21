const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;