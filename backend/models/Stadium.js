const mongoose = require('mongoose');

const stadiumSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    photos: [{ type: String }],
    facilities: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stadium', stadiumSchema);
