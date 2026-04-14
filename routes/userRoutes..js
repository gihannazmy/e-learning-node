

const express = require('express');
const router = express.Router();


const User = require('../models/user');
const {signup, getAllUsers} = require('../controllers/authController');


router.post('/', signup);

//for testing only
router.get('/', getAllUsers);

module.exports = router;