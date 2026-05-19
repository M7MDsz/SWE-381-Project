const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true, unique: true },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
