const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isReserved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);
