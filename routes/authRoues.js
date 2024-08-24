const express = require('express');
const router = express.Router();
const { registerUser, verifyUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.get('/verify/:token', verifyUser);

module.exports = router;
