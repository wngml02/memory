const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// 그룹 등록 엔드포인트
router.post('/', groupController.createGroup);

module.exports = router;