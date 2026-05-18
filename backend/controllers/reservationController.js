const Reservation = require('../models/Reservation');
const Slot = require('../models/Slot');
const Stadium = require('../models/Stadium');

const createReservation = async (req, res, next) => {
  try {
    const { slotId } = req.body;
    const slot = await Slot.findById(slotId);

    if (!slot) {
      res.status(404);
      throw new Error('Slot not found');
    }

    if (slot.isReserved) {
      res.status(400);
      throw new Error('Slot is already reserved');
    }

    const stadium = await Stadium.findById(slot.stadium);
    const reservation = await Reservation.create({
      user: req.user._id,
      owner: stadium.owner,
      stadium: stadium._id,
      slot: slot._id
    });

    slot.isReserved = true;
    await slot.save();

    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

const getMyReservations = async (req, res, next) => {
  try {
    const filter = req.user.role === 'owner' ? { owner: req.user._id } : { user: req.user._id };
    const reservations = await Reservation.find(filter)
      .populate('stadium', 'name location')
      .populate('slot', 'date startTime endTime isReserved')
      .populate('user', 'name email')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404);
      throw new Error('Reservation not found');
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can cancel only your own reservation');
    }

    reservation.status = 'cancelled';
    await reservation.save();
    await Slot.findByIdAndUpdate(reservation.slot, { isReserved: false });

    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReservation, getMyReservations, cancelReservation };
