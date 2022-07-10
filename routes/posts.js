const router = require('express').Router();
const user = require('../model/user');
const verifyToken = require('../routes/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await user.find({_id: req.user});
        res.send(users);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;