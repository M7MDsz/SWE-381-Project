const express = require('express');
const {
  getStadiums,
  createStadium,
  getOwnerStadiums,
  getStadiumById,
  createSlot,
  getStadiumSlots,
  getOwnerStats
} = require('../controllers/stadiumController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', getStadiums);
router.post('/', protect, ownerOnly, requireFields(['name', 'description', 'location']), createStadium);
router.get('/mine', protect, ownerOnly, getOwnerStadiums);
router.get('/stats', protect, ownerOnly, getOwnerStats);
router.post('/slots', protect, ownerOnly, requireFields(['stadiumId', 'date', 'startTime', 'endTime']), createSlot);
router.get('/:id', getStadiumById);
router.get('/:id/slots', getStadiumSlots);

module.exports = router;
