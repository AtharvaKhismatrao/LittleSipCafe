const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const list = await Review.find().sort({ date: -1, createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || rating == null || !comment) {
      return res.status(400).json({ message: 'name, rating, and comment are required' });
    }
    const r = await Review.create({
      name,
      rating: Number(rating),
      comment,
      date: new Date(),
    });
    res.status(201).json(r);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
