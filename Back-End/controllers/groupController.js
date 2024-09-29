// controllers/groupController.js
const bcrypt = require('bcryptjs');
const groupModel = require('../models/groupModel');

// 그룹 등록 로직
exports.createGroup = async(req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required.' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const newGroup = await groupModel.createGroup({
            name,
            passwordHash: hash,
            imageUrl,
            isPublic,
            introduction
        });

        res.status(201).json({
            id: newGroup.id,
            name: newGroup.name,
            imageUrl: newGroup.imageUrl,
            isPublic: newGroup.isPublic,
            likeCount: 0,
            badges: [],
            postCount: 0,
            createdAt: newGroup.createdAt,
            introduction: newGroup.introduction
        });
    } catch (err) {
        console.error('Error during group creation:', err);
        res.status(500).json({ message: 'Failed to create group.' });
    }
};


// 그룹 수정 로직
exports.updateGroup = async(req, res) => {
    const groupId = req.params.groupId;
    const { password, name, imageUrl, isPublic, introduction } = req.body;

    try {
        const group = await groupModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        const isMatch = await bcrypt.compare(password, group.passwordHash);
        if (!isMatch) {
            return res.status(403).json({ message: 'Incorrect password.' });
        }

        const updatedData = {
            name: name || group.name,
            imageUrl: imageUrl || group.imageUrl,
            isPublic: isPublic !== undefined ? isPublic : group.isPublic,
            introduction: introduction || group.introduction
        };

        await groupModel.updateGroup(groupId, updatedData);
        res.status(200).json({
            message: 'Group updated successfully.',
            groupId: groupId,
            updatedData
        });
    } catch (err) {
        console.error('Error updating group:', err);
        res.status(500).json({ message: 'Failed to update group.' });
    }
};


// 삭제 로직
exports.deleteGroup = async(req, res) => {
    const groupId = req.params.groupId;
    const { password } = req.body;

    try {
        const group = await groupModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        const isMatch = await bcrypt.compare(password, group.passwordHash);
        if (!isMatch) {
            return res.status(403).json({ message: 'Incorrect password.' });
        }

        await groupModel.deleteGroup(groupId);
        res.status(200).json({ message: 'Group deleted successfully.' });
    } catch (err) {
        console.error('Error deleting group:', err);
        res.status(500).json({ message: 'Failed to delete group.' });
    }
};
//공개 그룹 조회
exports.listGroups = async(req, res) => {
    const { page, pageSize, sortBy, keyword, isPublic } = req.query;

    try {
        const result = await groupModel.findGroups({ page, pageSize, sortBy, keyword, isPublic });
        res.json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.total / pageSize),
            totalItemCount: result.total,
            data: result.groups
        });
    } catch (err) {
        console.error("Error during group retrieval:", err);
        res.status(500).json({ message: 'Error retrieving groups.' });
    }
};

// 비공개 그룹 권한 확인
exports.verifyGroupPassword = async(req, res) => {
    const groupId = req.params.groupId;
    const { password } = req.body;

    try {
        const group = await groupModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }

        const isMatch = await bcrypt.compare(password, group.passwordHash);
        if (!isMatch) {
            return res.status(403).json({ message: "Incorrect password." });
        }

        res.status(200).json({ message: "Password verified successfully." });
    } catch (err) {
        console.error("Error comparing passwords:", err);
        res.status(500).json({ message: "Error retrieving group information." });
    }
};


//공개 여부 판단
exports.getGroupPublicStatus = async(req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await groupModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }

        res.status(200).json({
            id: group.id,
            isPublic: group.isPublic
        });
    } catch (err) {
        console.error("Error retrieving group data:", err);
        res.status(500).json({ message: "Error retrieving group data." });
    }
};


// 공감 누르기
exports.likeGroup = async(req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await groupModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }

        await groupModel.addLike(groupId);
        res.status(200).json({ message: "Group liked successfully." });
    } catch (err) {
        console.error("Error liking group:", err);
        res.status(500).json({ message: "Failed to like group." });
    }
};

// 그룹 상세 정보 조회
exports.getGroupDetails = async(req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await groupModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }

        res.status(200).json(group);
    } catch (err) {
        console.error("Error retrieving group details:", err);
        res.status(500).json({ message: "Error retrieving group details." });
    }
};