// controllers/groupController.js
const bcrypt = require('bcryptjs');
const groupModel = require('../models/groupModel');

// 그룹 등록 로직
exports.createGroup = (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    // 필수 데이터 유효성 검증
    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required.' });
    }

    // 비밀번호 해시 처리
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Password encryption failed.' });
        }

        // 데이터베이스에 그룹 정보 저장
        groupModel.createGroup({
            name,
            passwordHash: hash,
            imageUrl,
            isPublic,
            introduction
        }, (err, newGroup) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to create group.' });
            }

            // 응답에 맞춰 그룹 정보 반환
            return res.status(201).json({
                id: newGroup.id,
                name: newGroup.name,
                imageUrl: newGroup.imageUrl,
                isPublic: newGroup.isPublic,
                likeCount: 0, // 새로 생성된 그룹의 공감 수는 0
                badges: [], // 배지는 처음에는 빈 배열
                postCount: 0, // 처음에는 게시글 수 0
                createdAt: newGroup.createdAt, // 생성 시각
                introduction: newGroup.introduction
            });
        });
    });
};