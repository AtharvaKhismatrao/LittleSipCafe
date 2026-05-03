const express = require('express');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { items, totalPrice, customerName, status, user } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items array is required' });
    }
    if (totalPrice == null) {
      return res.status(400).json({ message: 'totalPrice is required' });
    }
    const order = await Order.create({
      items: items.map((i) => ({
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity) || 1,
      })),
      totalPrice: Number(totalPrice),
      customerName: customerName || 'Guest',
      user: user || undefined,
      status: status || 'pending',
    });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const list = await Order.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/status', authMiddleware, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
