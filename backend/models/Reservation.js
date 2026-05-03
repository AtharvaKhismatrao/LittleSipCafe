const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, min: 1 },
    date: { type: String, required: true },
    time: { type: String, required: true },
    specialRequest: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
