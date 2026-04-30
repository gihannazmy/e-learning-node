const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect, restrictTo } = require('../utils/auth');
const { validateDepartment, validateDepartmentId } = require('../utils/validation');

router.post('/', protect, restrictTo('admin'), validateDepartment, createDepartment);
router.get('/', getDepartments);
router.get('/:id', validateDepartmentId, getDepartment);
router.put('/:id', protect, restrictTo('admin'), validateDepartmentId, validateDepartment, updateDepartment);
router.delete('/:id', protect, restrictTo('admin'), validateDepartmentId, deleteDepartment);

module.exports = router;