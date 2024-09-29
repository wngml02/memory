const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// routes/postRoutes.js
router.post('/groups/:groupId/posts', postController.createPostInGroup);

module.exports = router;