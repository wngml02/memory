const bcrypt = require('bcryptjs');
const groupModel = require('../models/groupModel');
const postModel = require('../models/postModel');

exports.createPostInGroup = (req, res) => {
    const groupId = req.params.groupId;
    const { nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic } = req.body;

    groupModel.getGroupById(groupId, (err, group) => {
        if (err) {
            console.error("Error retrieving group:", err);
            return res.status(500).json({ message: "Failed to retrieve group." });
        }
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }

        bcrypt.compare(groupPassword, group.passwordHash, (err, isMatch) => {
            if (err) {
                console.error("Error comparing password:", err);
                return res.status(500).json({ message: "Password comparison failed." });
            }
            if (!isMatch) {
                return res.status(403).json({ message: "Incorrect group password." });
            }

            postModel.createPost({
                groupId,
                nickname,
                title,
                content,
                postPassword,
                imageUrl,
                tags,
                location,
                moment,
                isPublic
            }, (err, postId) => {
                if (err) {
                    console.error("Error creating post in group:", err);
                    return res.status(500).json({ message: "Failed to create post." });
                }

                res.status(200).json({
                    id: postId,
                    groupId,
                    nickname,
                    title,
                    content,
                    imageUrl,
                    tags,
                    location,
                    moment,
                    isPublic,
                    likeCount: 0,
                    commentCount: 0,
                    createdAt: new Date().toISOString()
                });
            });
        });
    });
};