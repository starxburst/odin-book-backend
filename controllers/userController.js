const User = require('../model/user');
const { check, body, validationResult } = require("express-validator");
const Avatar = require('../model/avatar');
const fs = require('fs');

//POST update user profile picture
exports.updateProfilePicture = async (req, res) => {
    body("imageFile")
    .custom((value, { req }) => {
        if (!req.file) {
            throw new Error("No file was uploaded");
        } else if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
            throw new Error("Only jpeg and png images are allowed");
        }
    }).withMessage("Only jpeg and png images are allowed");

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    if (!req.file) {
        return res.status(400).json({ message: "No file was uploaded" });
    }

    try {
        const avatar = new Avatar({
            user: req.user._id,
            name: req.file.filename,
            img: {
                data: fs.readFileSync("uploads/" + req.file.filename),
                contentType: req.file.mimetype
            }
        });

        const savedAvatar = await avatar.save();
        const relUser = await User.findById(req.user._id);
        relUser.avatar = savedAvatar._id;
        await relUser.save();
        return res.status(200).json({ message: "Profile picture updated successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    } finally {
        fs.unlinkSync("uploads/" + req.file.filename);
    }    
}

//Get user profile picture
exports.getProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.avatar) {
            return res.status(404).json({ message: "No profile picture found" });
        }
        const avatar = await Avatar.findById(user.avatar);
        if (!avatar) {
            return res.status(404).json({ message: "No profile picture found" });
        }
        return res.status(200).json({ avatar: avatar });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}