// models/postModel.js
const db = require('../db');


// 게시글 등록
const formatDateForMySQL = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

exports.createPost = async({
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
}) => {
    const query = `
        INSERT INTO posts 
        (groupId, nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic, likeCount, commentCount, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        groupId, // groupId 컬럼
        nickname, // nickname 컬럼
        title, // title 컬럼
        content, // content 컬럼
        postPassword, // postPassword 컬럼
        imageUrl, // imageUrl 컬럼
        JSON.stringify(tags), // tags 컬럼 (JSON 형식)
        location, // location 컬럼
        moment, // moment 컬럼
        isPublic, // isPublic 컬럼
        0, // likeCount 컬럼 (초기값 0)
        0, // commentCount 컬럼 (초기값 0)
        formatDateForMySQL(new Date()) // createdAt 컬럼
    ];

    const [result] = await db.query(query, values);
    return {
        id: result.insertId,
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
        createdAt: formatDateForMySQL(new Date())
    };
};