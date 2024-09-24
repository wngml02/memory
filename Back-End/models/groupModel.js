// models/groupModel.js
const db = require('../db');

// 그룹 데이터베이스 저장
exports.createGroup = (groupData, callback) => {
    const query = `
        INSERT INTO \`groups\` (name, passwordHash, imageUrl, isPublic, introduction, likeCount, badges, postCount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        groupData.name,
        groupData.passwordHash,
        groupData.imageUrl,
        groupData.isPublic,
        groupData.introduction,
        0, // likeCount 초기값 0
        JSON.stringify([]), // badges에 빈 배열을 JSON으로 저장
        0 // postCount 초기값 0
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            return callback(err);
        }

        // 생성된 그룹 정보 반환
        const newGroup = {
            id: result.insertId,
            name: groupData.name,
            imageUrl: groupData.imageUrl,
            isPublic: groupData.isPublic,
            likeCount: 0, // 응답에 likeCount 포함
            badges: [], // 응답에 빈 배열로 badges 포함
            postCount: 0, // postCount 포함
            introduction: groupData.introduction,
            createdAt: new Date().toISOString()
        };

        callback(null, newGroup);
    });
};