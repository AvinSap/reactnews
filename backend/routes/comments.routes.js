const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments.controller');

router.get('/news/:newsId/comments', commentsController.getCommentsByNewsId);
router.post('/news/:newsId/comments', commentsController.addComment);
router.put('/news/:newsId/comments/:commentId', commentsController.updateComment);
router.delete('/news/:newsId/comments/:commentId', commentsController.deleteComment);

module.exports = router;
