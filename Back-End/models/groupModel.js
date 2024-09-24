// models/groupModel.js
const db = require('../db');

// 그룹 데이터베이스 저장
exports.createGroup = (groupData, callback) => {
    const query = `
        INSERT INTO \`groups\` (name, passwordHash, imageUrl, isPublic, introduction) 
        VALUES (?, ?, ?, ?, ?)`;
    const values = [
        groupData.name,
        groupData.passwordHash,
        groupData.imageUrl,
        groupData.isPublic,
        groupData.introduction
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            return callback(err);
        }

        // 생성된 그룹 정보 반환
        const newGroup = {
            id: result.insertId, // 새로 생성된 그룹 ID
            name: groupData.name,
            imageUrl: groupData.imageUrl,
            isPublic: groupData.isPublic,
            introduction: groupData.introduction,
            createdAt: new Date().toISOString() // 생성 시간
        };

        callback(null, newGroup);
    });
};