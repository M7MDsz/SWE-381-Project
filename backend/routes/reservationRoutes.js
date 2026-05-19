const express = require('express');
const {
  createReservation,
  getMyReservations,
  cancelReservation
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/', protect, requireFields(['slotId']), createReservation);
router.get('/mine', protect, getMyReservations);
router.put('/:id/cancel', protect, cancelReservation);

module.exports = router;
