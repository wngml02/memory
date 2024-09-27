const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// 그룹 등록
router.post('/', groupController.createGroup);

// 그룹 수정
router.put('/:groupId', groupController.updateGroup);

// 그룹 삭제 라우트
router.delete('/:groupId', groupController.deleteGroup);

// 공개 그룹 목록 조회
router.get('/', groupController.listGroups);

//비공개 그룹 권한 확인
router.post('/:groupId/verify-password', groupController.verifyGroupPassword);

//공개 여부 확인
router.get('/:groupId/is-public', groupController.getGroupPublicStatus);

//공감 누르기
router.post('/:groupId/like', groupController.likeGroup);

// 그룹 상세 조회
router.get('/:groupId', groupController.getGroupDetails);
module.exports = router;