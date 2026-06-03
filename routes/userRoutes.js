

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const {signup, getAllusers, login, logout} = require('../controllers/authController');
const { protect } = require('../utils/auth');
const { validateUserSignup, validateUserLogin } = require('../utils/validation');

router.post('/signup', validateUserSignup, signup);
router.post('/login', validateUserLogin, login);
router.get('/logout', logout);

// Allow creating users via POST / (useful for admin UI)
router.post('/', validateUserSignup, signup);

//for testing only - should be protected in production
router.get('/', protect, getAllusers);

module.exports = router;