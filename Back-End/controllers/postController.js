// controllers/postController.js
const bcrypt = require('bcryptjs');
const groupModel = require('../models/groupModel');
const postModel = require('../models/postModel');

// 게시글 등록
exports.createPostInGroup = async(req, res) => {
    try {
        const { groupId } = req.params;
        const {
            nickname,
            title,
            content,
            postPassword,
            groupPassword,
            imageUrl,
            tags,
            location,
            moment,
            isPublic
        } = req.body;

        // 필수 데이터 유효성 검사
        if (!groupId || !nickname || !title || !content || !postPassword || !groupPassword) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        // 그룹 정보 가져오기 및 비밀번호 검증
        const group = await groupModel.getGroupById(groupId);
        if (!group || !(await bcrypt.compare(groupPassword, group.passwordHash))) {
            return res.status(403).json({ message: "그룹 비밀번호가 올바르지 않습니다." });
        }

        // 게시글 비밀번호 해시 처리
        const hashedPostPassword = await bcrypt.hash(postPassword, 10);

        // 게시글 생성
        const newPost = await postModel.createPost({
            groupId,
            nickname,
            title,
            content,
            postPassword: hashedPostPassword,
            imageUrl,
            tags,
            location,
            moment,
            isPublic
        });

        res.status(200).json(newPost);
    } catch (error) {
        console.error("Error creating post in group:", error);
        res.status(500).json({ message: "게시글 생성에 실패했습니다." });
    }
};