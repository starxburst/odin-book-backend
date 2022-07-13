const router = require('express').Router();
const user = require('../model/user');
const verifyToken = require('../routes/verifyToken');
const postController = require('../controllers/postController');

//Handle all posts on GET
router.get('/', verifyToken, postController.getAllPosts);

//POST request to create a new post
router.post('/create', verifyToken, postController.createPost);

//POST request to create a new comment
router.post('/:postId/comment', verifyToken, postController.createComment);

module.exports = router;