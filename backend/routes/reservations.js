const express = require('express');
const Reservation = require('../models/Reservation');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, guests, date, time, specialRequest } = req.body;
    if (!name || !email || !phone || guests == null || !date || !time) {
      return res.status(400).json({
        message: 'name, email, phone, guests, date, and time are required',
      });
    }
    const r = await Reservation.create({
      name,
      email,
      phone,
      guests: Number(guests),
      date,
      time,
      specialRequest: specialRequest || '',
    });
    res.status(201).json(r);
  } catch (e) {
    next(e);
  }
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const list = await Reservation.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
