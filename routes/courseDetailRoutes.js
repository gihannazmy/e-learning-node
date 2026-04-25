const express = require('express');
const router = express.Router();
const {
  createCourseDetail,
  getCourseDetails,
  getCourseDetail,
  updateCourseDetail,
  deleteCourseDetail
} = require('../controllers/courseDetailController');

router.post('/', createCourseDetail);
router.get('/', getCourseDetails);
router.get('/:id', getCourseDetail);
router.put('/:id', updateCourseDetail);
router.delete('/:id', deleteCourseDetail);

module.exports = router;