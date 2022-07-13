const User = require('../model/user');
const { check, body, validationResult } = require("express-validator");

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

    await upload

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    if (!req.file) {
        return res.status(400).json({ message: "No file was uploaded" });
    }

    
}