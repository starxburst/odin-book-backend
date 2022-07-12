const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const { body, validationResult } = require("express-validator");

//Handle all posts on GET
exports.getAllPosts = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user._id);
        const posts = await Post.find({ author: [req.user._id, ...loggedInUser.friends] })
        .sort({ timestamp: -1 })
        .populate({
            path: "comments",
            model: "Comment",
            populate: {
                path: "user",
                model: "User"
            }
        });
        return res.status(200).json({ posts: posts });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}


//Handle post create on POST
exports.createPost = async (req, res) => {
    body("content", "Content required").trim().isLength({ min: 1 });
    const { content } = req.body;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    try {
        const post = new Post({
            content: content,
            author: req.user._id,
            timestamp: new Date(),
            comments: [],
            likes: []
        });
        const savedPost = await post.save();
        const relPost = await Post.findById(savedPost._id).populate('author', 'name');
        if (relPost) {
            console.log(`Post Created ${relPost}`);
            res.status(201).json({message: "Post created successfully", post: relPost});
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }

}