const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', requireFields(['name', 'email', 'password', 'role']), registerUser);
router.post('/login', requireFields(['email', 'password']), loginUser);
router.get('/profile', protect, getProfile);

module.exports = router;
