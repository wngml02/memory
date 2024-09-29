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

//게시글 조회

exports.getPostsInGroup = async(req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic = true } = req.query;

        // 필수 데이터 검증
        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required." });
        }

        const { total, posts } = await postModel.getPostsByGroup({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            sortBy,
            keyword,
            isPublic: isPublic === 'true', // String을 boolean으로 변환
            groupId: parseInt(groupId)
        });

        const totalPages = Math.ceil(total / pageSize);

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItemCount: total,
            data: posts.map(post => ({
                ...post,
                tags: isValidJson(post.tags) ? JSON.parse(post.tags) : [] // JSON 유효성 검사 후 파싱
            }))
        });
    } catch (error) {
        console.error("Error retrieving posts in group:", error);
        res.status(500).json({ message: "Failed to retrieve posts." });
    }
};

// JSON 유효성 검사 함수
const isValidJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

//게시글 수정
exports.updatePost = async(req, res) => {
    try {
        const { postId } = req.params;
        const {
            nickname,
            title,
            content,
            postPassword,
            imageUrl,
            tags,
            location,
            moment,
            isPublic
        } = req.body;

        // 필수 데이터 유효성 검증
        if (!postId || !postPassword) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        // 게시글 조회
        const post = await postModel.getPostById(postId);
        if (!post) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호 검증
        const isMatch = await bcrypt.compare(postPassword, post.postPassword);
        if (!isMatch) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 게시글 수정
        const updatedData = {
            nickname: nickname || post.nickname,
            title: title || post.title,
            content: content || post.content,
            imageUrl: imageUrl || post.imageUrl,
            tags: tags || JSON.parse(post.tags),
            location: location || post.location,
            moment: moment || post.moment,
            isPublic: isPublic !== undefined ? isPublic : post.isPublic
        };

        await postModel.updatePost(postId, updatedData);

        res.status(200).json({
            id: post.id,
            groupId: post.groupId,
            ...updatedData,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            createdAt: post.createdAt
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "게시글 수정에 실패했습니다." });
    }
};


//게시글 삭제
exports.deletePost = async(req, res) => {
    try {
        const { postId } = req.params;
        const { postPassword } = req.body;

        // 필수 데이터 유효성 검증
        if (!postId || !postPassword) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        // 게시글 조회
        const post = await postModel.getPostById(postId);
        if (!post) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호 검증
        const isMatch = await bcrypt.compare(postPassword, post.postPassword);
        if (!isMatch) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 게시글 삭제
        await postModel.deletePost(postId);

        res.status(200).json({ message: "게시글 삭제 성공" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "게시글 삭제에 실패했습니다." });
    }
};