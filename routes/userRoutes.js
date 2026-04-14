

const express = require('express');
const router = express.Router();


const User = require('../models/user');
const {signup, getAllusers, login} = require('../controllers/authController');


router.post('/', signup);
router.get('/', login)

//for testing only
router.get('/', getAllusers);

module.exports = router;