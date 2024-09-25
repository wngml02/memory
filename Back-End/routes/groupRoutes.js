const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// 그룹 등록 엔드포인트
router.post('/', groupController.createGroup);

// 그룹 수정 엔드포인트
router.put('/:groupId', groupController.updateGroup);

module.exports = router;