

const express = require('express');
const router = express.Router();


const User = require('../models/user');
const {signup, getAllusers, login} = require('../controllers/authController');


router.post('/signup', signup);
router.post('/login', login);

//for testing only
router.get('/', getAllusers);

module.exports = router;