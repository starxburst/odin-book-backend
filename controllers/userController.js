const User = require('../model/user');
const { check, body, validationResult } = require("express-validator");
const Avatar = require('../model/avatar');
const fs = require('fs');
const { param } = require('../routes/auth');

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

//Search for users
exports.searchUsers = async (req, res) => {
    const searchIndex = req.params.searchParam;
    console.log(searchIndex);

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: searchIndex, $options: "i" } },
                { email: { $regex: searchIndex, $options: "i" } }
            ]
        })
        .select('name')
        .populate('avatar');
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({ users: users });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

//Auto Login
exports.autoLogin = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        .populate('avatar');
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        return res.status(200).json({ user: user });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

//Get user info
exports.getUserInfo = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        const user = await User.findById(userId)
        .select('name avatar friends friendRequests')
        .populate('avatar')
        .populate({
            path: 'friends',
            model: 'User',
            populate: {
                path: 'avatar',
                model: 'Avatar'
            }})
        .populate({
            path: 'friendRequests',
            model: 'User',
            populate: {
                path: 'avatar',
                model: 'Avatar'
            }});
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        return res.status(200).json({ user: user });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

//Send friend request
exports.sendFriendRequest = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        if (user.friendRequests.includes(req.user._id)) {
            return res.status(400).json({ message: "You have already sent a friend request to this user" });
        }
        if (user.friends.includes(req.user._id)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }
        user.friendRequests.push(req.user._id);
        await user.save();
        return res.status(200).json({ message: "Friend request sent successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }

}

//Accept friend request
exports.acceptFriendRequest = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        const user = await User.findById(userId);
        const relUser = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        if (!relUser.friendRequests.includes(user._id)) {
            return res.status(400).json({ message: "This user don't have sent you a request!" });
        }
        if (user.friends.includes(req.user._id)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }
        relUser.friends.push(userId);
        relUser.friendRequests.splice(relUser.friendRequests.indexOf(userId), 1);
        await relUser.save();

        user.friends.push(req.user._id);
        await user.save();
        return res.status(200).json({ message: "Friend request accepted successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

//Reject friend request
exports.rejectFriendRequest = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        const user = await User.findById(userId);
        const relUser = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        if (!relUser.friendRequests.includes(user._id)) {
            return res.status(400).json({ message: "This user don't have sent you a request!" });
        }
        if (user.friends.includes(req.user._id)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        relUser.friendRequests.splice(relUser.friendRequests.indexOf(userId), 1);
        await relUser.save();
        return res.status(200).json({ message: "Friend request rejected successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

//Remove friend
exports.removeFriend = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        if (!user.friends.includes(req.user._id)) {
            return res.status(400).json({ message: "You are not friends with this user" });
        }
        user.friends.splice(user.friends.indexOf(req.user._id), 1);
        await user.save();

        const relUser = await User.findById(req.user._id);
        relUser.friends.splice(relUser.friends.indexOf(userId), 1);
        await relUser.save();
        return res.status(200).json({ message: "Friend removed successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}