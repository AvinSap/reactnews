const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');

router.get('/', newsController.getAllNews);
router.get('/published', newsController.getPublishedNews);
router.get('/:id', newsController.getNewsById);
router.post('/', newsController.createNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;
