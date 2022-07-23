const router = require('express').Router();
const user = require('../model/user');
const verifyToken = require('../routes/verifyToken');
const postController = require('../controllers/postController');

//Get request to get all posts
router.get('/', verifyToken, postController.getAllPosts);

//Get request to get user posts
router.get('/:userId', verifyToken, postController.getUserPosts);

//POST request to create a new post
router.post('/create', verifyToken, postController.createPost);

//POST request to create a new comment
router.post('/:postId/comment', verifyToken, postController.createComment);

//PUT request to like a post
router.put('/:postId/like', verifyToken, postController.likePost);

//PUT request to unlike a post
router.put('/:postId/unlike', verifyToken, postController.unlikePost);

module.exports = router;