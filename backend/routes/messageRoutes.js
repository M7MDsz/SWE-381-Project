const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', protect, getMessages);
router.post('/', protect, requireFields(['text']), sendMessage);

module.exports = router;
