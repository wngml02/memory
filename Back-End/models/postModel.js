const db = require('../db');
// 예시: postModel.createPost 함수를 프로미스 기반으로 변경
exports.createPost = ({ groupId, nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic }) => {
    return new Promise((resolve, reject) => {
        const formattedTags = JSON.stringify(tags);
        const query = `
            INSERT INTO posts (groupId, nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [groupId, nickname, title, content, postPassword, imageUrl, formattedTags, location, moment, isPublic], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.insertId);
            }
        });
    });
};