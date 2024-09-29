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

//게시글 조회
exports.getPostsByGroup = async({ page, pageSize, sortBy, keyword, isPublic, groupId }) => {
    let whereClause = `WHERE groupId = ? AND isPublic = ?`;
    const values = [groupId, isPublic];

    if (keyword) {
        whereClause += ` AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)`;
        values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    let orderBy = '';
    switch (sortBy) {
        case 'mostCommented':
            orderBy = 'ORDER BY commentCount DESC';
            break;
        case 'mostLiked':
            orderBy = 'ORDER BY likeCount DESC';
            break;
        default:
            orderBy = 'ORDER BY createdAt DESC'; // 기본값: 최신순
    }

    const offset = (page - 1) * pageSize;
    const query = `
        SELECT SQL_CALC_FOUND_ROWS id, nickname, title, imageUrl, tags, location, moment, isPublic, likeCount, commentCount, createdAt
        FROM posts
        ${whereClause}
        ${orderBy}
        LIMIT ? OFFSET ?`;

    values.push(pageSize, offset);

    const [posts] = await db.query(query, values);
    const [
        [{ total }]
    ] = await db.query('SELECT FOUND_ROWS() as total');
    return { total, posts };
};

//게시글 수정
exports.updatePost = async(postId, updatedData) => {
    const query = `
        UPDATE posts
        SET nickname = ?, title = ?, content = ?, imageUrl = ?, tags = ?, location = ?, moment = ?, isPublic = ?
        WHERE id = ?`;
    const values = [
        updatedData.nickname,
        updatedData.title,
        updatedData.content,
        updatedData.imageUrl,
        JSON.stringify(updatedData.tags),
        updatedData.location,
        updatedData.moment,
        updatedData.isPublic,
        postId
    ];

    const [result] = await db.query(query, values);
    return result;
};

//게시글 아이디 조회
exports.getPostById = async(postId) => {
    const query = 'SELECT * FROM posts WHERE id = ?';
    const [result] = await db.query(query, [postId]);
    return result.length ? result[0] : null;
};


//게시글 삭제
exports.deletePost = async(postId) => {
    const query = 'DELETE FROM posts WHERE id = ?';
    const [result] = await db.query(query, [postId]);
    return result;
};