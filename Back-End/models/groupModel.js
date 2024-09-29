// models/groupModel.js
const db = require('../db');

// 그룹 데이터베이스 저장
exports.createGroup = async(groupData) => {
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

    const [result] = await db.query(query, values);
    return {
        id: result.insertId,
        ...groupData,
        likeCount: 0,
        badges: [],
        postCount: 0,
        createdAt: new Date().toISOString()
    };
};

// 그룹 정보 가져오기
exports.getGroupById = async(groupId) => {
    const query = 'SELECT * FROM \`groups\` WHERE id = ?';
    const [result] = await db.query(query, [groupId]);
    return result.length ? result[0] : null;
};

// 그룹 정보 업데이트
exports.updateGroup = async(groupId, updatedData) => {
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

    await db.query(query, values);
};

// 그룹 삭제
exports.deleteGroup = async(groupId) => {
    const query = 'DELETE FROM \`groups\` WHERE id = ?';
    await db.query(query, [groupId]);
};

// 공개 그룹 조회
exports.findGroups = async({ page, pageSize, sortBy, keyword, isPublic }) => {
    let whereClause = `WHERE isPublic = ${isPublic}`;
    if (keyword) {
        whereClause += ` AND name LIKE '%${keyword}%'`;
    }

    let orderBy = '';
    switch (sortBy) {
        case 'mostPosted':
            orderBy = 'ORDER BY postCount DESC';
            break;
        case 'mostLiked':
            orderBy = 'ORDER BY likeCount DESC';
            break;
        case 'mostBadge':
            orderBy = 'ORDER BY badges DESC';
            break;
        default:
            orderBy = 'ORDER BY createdAt DESC';
    }

    const offset = (page - 1) * pageSize;
    const query = `
        SELECT SQL_CALC_FOUND_ROWS id, name, imageUrl, isPublic, likeCount, badges, postCount, createdAt, introduction
        FROM \`groups\`
        ${whereClause}
        ${orderBy}
        LIMIT ${pageSize} OFFSET ${offset}`;

    const [groups] = await db.query(query);
    const [
        [{ total }]
    ] = await db.query('SELECT FOUND_ROWS() as total');
    return { total, groups };
};

// 공감 누르기 로직
exports.addLike = async(groupId) => {
    const query = 'UPDATE \`groups\` SET likeCount = likeCount + 1 WHERE id = ?';
    await db.query(query, [groupId]);
};
// 배지, 좋아요 수, 게시물 수 등을 조회하는 쿼리
exports.getGroupAdditionalDetails = async(groupId) => {
    const query = 'SELECT likeCount, badges, postCount FROM \`groups\` WHERE id = ?';
    try {
        const [results] = await db.query(query, [groupId]);
        return results.length ? results[0] : null;
    } catch (err) {
        console.error("Database error in getGroupAdditionalDetails:", err);
        throw err; // 에러를 호출 스택으로 전파하여 적절히 처리할 수 있도록 함
    }
};