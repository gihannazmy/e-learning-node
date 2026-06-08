

const express = require('express');
const router = express.Router();

const {
  signup,
  getAllusers,
  login,
  logout,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/authController');
const { protect, restrictTo } = require('../utils/auth');
const {
  validateUserSignup,
  validateUserLogin,
  validateUserId,
  validateUserUpdate
} = require('../utils/validation');

router.post('/signup', validateUserSignup, signup);
router.post('/login', validateUserLogin, login);
router.get('/logout', logout);

router.post('/', protect, restrictTo('admin'), validateUserSignup, signup);

router.get('/', protect, restrictTo('admin'), getAllusers);
router.get('/:id', protect, restrictTo('admin'), validateUserId, getUser);
router.put('/:id', protect, restrictTo('admin'), validateUserUpdate, updateUser);
router.delete('/:id', protect, restrictTo('admin'), validateUserId, deleteUser);

module.exports = router;
