const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// 그룹 등록
router.post('/', groupController.createGroup);

// 그룹 수정
router.put('/:groupId', groupController.updateGroup);

// 그룹 삭제 라우트
router.delete('/:groupId', groupController.deleteGroup);

module.exports = router;