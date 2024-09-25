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

// 그룹 정보 가져오기
exports.getGroupById = (groupId, callback) => {
    const query = 'SELECT * FROM `groups` WHERE id = ?';
    db.query(query, [groupId], (err, result) => {
        if (err) {
            return callback(err);
        }
        if (result.length === 0) {
            return callback(null, null); // 그룹을 찾지 못함
        }
        callback(null, result[0]); // 그룹 정보 반환
    });
};

// 그룹 정보 업데이트
exports.updateGroup = (groupId, updatedData, callback) => {
    const query = `
        UPDATE \`groups\`
        SET name = ?, imageUrl = ?, isPublic = ?, introduction = ?
        WHERE id = ?`;

    const values = [
        updatedData.name,
        updatedData.imageUrl,
        updatedData.isPublic,
        updatedData.introduction,
        groupId
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

//조회 로직
exports.getGroupById = (groupId, callback) => {
    const query = 'SELECT id, passwordHash FROM `groups` WHERE id = ?';
    db.query(query, [groupId], (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};

// 그룹 삭제 쿼리
exports.deleteGroup = (groupId, callback) => {

    const query = 'DELETE FROM `groups` WHERE id = ?';

    db.query(query, [groupId], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};