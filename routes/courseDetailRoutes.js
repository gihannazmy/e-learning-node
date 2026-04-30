const express = require('express');
const router = express.Router();
const {
  createCourseDetail,
  getCourseDetails,
  getCourseDetail,
  updateCourseDetail,
  deleteCourseDetail
} = require('../controllers/courseDetailController');
const { protect, restrictTo } = require('../utils/auth');
const { validateCourseDetail, validateCourseDetailId } = require('../utils/validation');

router.post('/', protect, restrictTo('instructor', 'admin'), validateCourseDetail, createCourseDetail);
router.get('/', protect, getCourseDetails);
router.get('/:id', protect, validateCourseDetailId, getCourseDetail);
router.put('/:id', protect, restrictTo('instructor', 'admin'), validateCourseDetailId, validateCourseDetail, updateCourseDetail);
router.delete('/:id', protect, restrictTo('admin'), validateCourseDetailId, deleteCourseDetail);

module.exports = router;