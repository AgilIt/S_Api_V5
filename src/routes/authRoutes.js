const express = require('express');
const authController = require('../controllers/authController');
const { validateSignup, validateSignin } = require('../middleware/validation');

const router = express.Router();

router.post('/signup', validateSignup, authController.signup);
router.post('/signin', validateSignin, authController.signin);

module.exports = router;