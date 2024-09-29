const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// 게시글 등록
router.post('/groups/:groupId/posts', postController.createPostInGroup);

//게시글 조회
router.get('/groups/:groupId/posts', postController.getPostsInGroup);

//게시글 수정
router.put('/posts/:postId', postController.updatePost);

//게시글 삭제
router.delete('/posts/:postId', postController.deletePost);

module.exports = router;