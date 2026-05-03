const express = require('express');
const multer = require('multer');
const path = require('path');
const MenuItem = require('../models/MenuItem');
const { authMiddleware } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res, next) => {
  try {
    const { name, category, price, description, image } = req.body;
    if (!name || !category || price == null) {
      return res.status(400).json({ message: 'name, category, and price are required' });
    }
    const item = await MenuItem.create({
      name,
      category,
      price: Number(price),
      description: description || '',
      image: req.file ? `/uploads/${req.file.filename}` : (image || ''),
    });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res, next) => {
  try {
    const { name, category, price, description, image } = req.body;
    const update = {};
    if (name != null) update.name = name;
    if (category != null) update.category = category;
    if (price != null) update.price = Number(price);
    if (description != null) update.description = description;
    if (req.file) {
      update.image = `/uploads/${req.file.filename}`;
    } else if (image != null) {
      update.image = image;
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
