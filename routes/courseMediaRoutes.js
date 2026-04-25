const express = require('express');
const router = express.Router();
const {
  createCourseMedia,
  getCourseMedias,
  getCourseMedia,
  updateCourseMedia,
  deleteCourseMedia
} = require('../controllers/courseMediaController');

router.post('/', createCourseMedia);
router.get('/', getCourseMedias);
router.get('/:id', getCourseMedia);
router.put('/:id', updateCourseMedia);
router.delete('/:id', deleteCourseMedia);

module.exports = router;