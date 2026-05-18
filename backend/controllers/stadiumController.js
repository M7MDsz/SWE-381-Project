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
    const stadiums = await Stadium.find({ owner: req.user._id });
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

const getOwnerStats = async (req, res, next) => {
  try {
    const stadiums = await Stadium.find({ owner: req.user._id });
    const stadiumIds = stadiums.map((stadium) => stadium._id);
    const totalSlots = await Slot.countDocuments({ owner: req.user._id });
    const reservedSlots = await Slot.countDocuments({ owner: req.user._id, isReserved: true });
    const availableSlots = totalSlots - reservedSlots;
    const reservations = await Reservation.find({ owner: req.user._id, status: 'active' }).populate('stadium', 'name');

    res.json({
      totalStadiums: stadiums.length,
      totalSlots,
      reservedSlots,
      availableSlots,
      totalReservations: reservations.length,
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
  getOwnerStats
};
