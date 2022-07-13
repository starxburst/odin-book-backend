const express = require('express');
const router = express.Router();
const User = require('../model/user');
const {registerValidation, loginValidation} = require('../model/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../routes/verifyToken');



router.post('/register', async (req, res) => {

    //VALIDATE USER DATA
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //CHECK IF USER EXISTS
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
        return res.status(400).send('Email already exists');
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token);
        res.json({ token: token, user: user });
    } catch (err) {
        res.status(400).send(err);
    }
});

//router.post('login')
router.post('/login', async (req, res) => {
    //VALIDATE USER DATA
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    //CHECK IF THE EMAIL EXISTS
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Email is not found');
    }
    //CHECK IF PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Email or password is incorrect');
    }

    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token);
    res.json({ token: token, user: user });
});

//POST update user profile picture
router.post('/:userId/profileimage', verifyToken);

module.exports = router;