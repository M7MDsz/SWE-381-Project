const Stadium = require('../models/Stadium');
const Slot = require('../models/Slot');
const Reservation = require('../models/Reservation');

const getStadiums = async (req, res, next) => {
  try {
    const { location, date, startTime } = req.query;
    const stadiumFilter = {};

    if (location) {
      stadiumFilter.location = { $regex: location, $options: 'i' };
    }

    let stadiums = await Stadium.find(stadiumFilter).populate('owner', 'name email');

    if (date || startTime) {
      const slotFilter = { isReserved: false };
      if (date) slotFilter.date = date;
      if (startTime) slotFilter.startTime = startTime;

      const slots = await Slot.find(slotFilter).select('stadium');
      const availableIds = slots.map((slot) => slot.stadium.toString());
      stadiums = stadiums.filter((stadium) => availableIds.includes(stadium._id.toString()));
    }

    res.json(stadiums);
  } catch (error) {
    next(error);
  }
};

const createStadium = async (req, res, next) => {
  try {
    const { name, description, location, photos, facilities } = req.body;
    const stadium = await Stadium.create({
      owner: req.user._id,
      name,
      description,
      location,
      photos: photos || [],
      facilities: facilities || []
    });

    res.status(201).json(stadium);
  } catch (error) {
    next(error);
  }
};

const getOwnerStadiums = async (req, res, next) => {
  try {
    const stadiums = await Stadium.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(stadiums);
  } catch (error) {
    next(error);
  }
};

const getStadiumById = async (req, res, next) => {
  try {
    const stadium = await Stadium.findById(req.params.id).populate('owner', 'name email');

    if (!stadium) {
      res.status(404);
      throw new Error('Stadium not found');
    }

    res.json(stadium);
  } catch (error) {
    next(error);
  }
};

const createSlot = async (req, res, next) => {
  try {
    const { stadiumId, date, startTime, endTime } = req.body;
    const stadium = await Stadium.findOne({ _id: stadiumId, owner: req.user._id });

    if (!stadium) {
      res.status(404);
      throw new Error('Stadium not found for this owner');
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    if (selectedDate < today || selectedDate > sevenDaysFromNow) {
      res.status(400);
      throw new Error('Slot date must be within the upcoming 7 days');
    }

    const slot = await Slot.create({ stadium: stadiumId, owner: req.user._id, date, startTime, endTime });
    res.status(201).json(slot);
  } catch (error) {
    next(error);
  }
};

const getStadiumSlots = async (req, res, next) => {
  try {
    const slots = await Slot.find({ stadium: req.params.id }).sort({ date: 1, startTime: 1 });
    res.json(slots);
  } catch (error) {
    next(error);
  }
};

const deleteStadium = async (req, res, next) => {
  try {
    const stadium = await Stadium.findOne({ _id: req.params.id, owner: req.user._id });

    if (!stadium) {
      res.status(404);
      throw new Error('Stadium not found for this owner');
    }

    const slots = await Slot.find({ stadium: stadium._id }).select('_id');
    const slotIds = slots.map((slot) => slot._id);

    await Reservation.deleteMany({ $or: [{ stadium: stadium._id }, { slot: { $in: slotIds } }] });
    await Slot.deleteMany({ stadium: stadium._id });
    await Stadium.findByIdAndDelete(stadium._id);

    res.json({ message: 'Stadium and related slots/reservations deleted.' });
  } catch (error) {
    next(error);
  }
};

const deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      res.status(404);
      throw new Error('Slot not found');
    }

    const stadium = await Stadium.findById(slot.stadium);
    if (!stadium || stadium.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this slot');
    }

    if (slot.isReserved) {
      res.status(400);
      throw new Error('Reserved slots cannot be deleted.');
    }

    await Reservation.deleteMany({ slot: slot._id });
    await Slot.findByIdAndDelete(slot._id);

    res.json({ message: 'Slot deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getOwnerStats = async (req, res, next) => {
  try {
    const stadiums = await Stadium.find({ owner: req.user._id }).sort({ createdAt: -1 });
    const stadiumIds = stadiums.map((stadium) => stadium._id);

    const ownerSlots = await Slot.find({ owner: req.user._id }).sort({ date: -1, startTime: -1 });
    const totalSlots = ownerSlots.length;
    const reservedSlots = ownerSlots.filter((slot) => slot.isReserved).length;
    const availableSlots = totalSlots - reservedSlots;

    const reservations = await Reservation.find({ owner: req.user._id, status: 'active' })
      .populate('stadium', 'name')
      .sort({ createdAt: -1 });

    const reservedPercentage = totalSlots > 0 ? Number(((reservedSlots / totalSlots) * 100).toFixed(1)) : 0;
    const availablePercentage = totalSlots > 0 ? Number(((availableSlots / totalSlots) * 100).toFixed(1)) : 0;

    const stadiumAvailabilityMap = {};
    const stadiumReservationMap = {};

    stadiums.forEach((stadium) => {
      stadiumAvailabilityMap[stadium._id.toString()] = { name: stadium.name, count: 0 };
      stadiumReservationMap[stadium._id.toString()] = { name: stadium.name, count: 0 };
    });

    ownerSlots.forEach((slot) => {
      if (!slot.isReserved && stadiumAvailabilityMap[slot.stadium.toString()]) {
        stadiumAvailabilityMap[slot.stadium.toString()].count += 1;
      }
    });

    reservations.forEach((reservation) => {
      if (stadiumReservationMap[reservation.stadium._id.toString()]) {
        stadiumReservationMap[reservation.stadium._id.toString()].count += 1;
      }
    });

    const stadiumWithMostAvailableSlots = Object.values(stadiumAvailabilityMap).sort((a, b) => b.count - a.count)[0] || null;
    const stadiumWithMostReservations = Object.values(stadiumReservationMap).sort((a, b) => b.count - a.count)[0] || null;

    const recentStadiums = stadiums.slice(0, 3).map((stadium) => ({
      _id: stadium._id,
      name: stadium.name,
      createdAt: stadium.createdAt
    }));

    const recentSlots = ownerSlots.slice(0, 5).map((slot) => ({
      _id: slot._id,
      stadium: slot.stadium,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isReserved: slot.isReserved,
      createdAt: slot.createdAt
    }));

    res.json({
      totalStadiums: stadiums.length,
      totalSlots,
      reservedSlots,
      availableSlots,
      reservedPercentage,
      availablePercentage,
      totalReservations: reservations.length,
      stadiumWithMostAvailableSlots,
      stadiumWithMostReservations,
      recentStadiums,
      recentSlots,
      stadiumIds
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStadiums,
  createStadium,
  getOwnerStadiums,
  getStadiumById,
  createSlot,
  getStadiumSlots,
  deleteStadium,
  deleteSlot,
  getOwnerStats
};
