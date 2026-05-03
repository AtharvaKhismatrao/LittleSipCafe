const jwt = require('jsonwebtoken');
const { connectToDb } = require('./_lib/db');
const Admin = require('../backend/models/Admin');
const MenuItem = require('../backend/models/MenuItem');
const Order = require('../backend/models/Order');
const Reservation = require('../backend/models/Reservation');
const Review = require('../backend/models/Review');
const User = require('../backend/models/User');

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function getPathParts(req) {
  const url = new URL(req.url, 'http://localhost');
  return url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
}

function getBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function getToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice(7);
}

async function requireAdmin(req, res) {
  const token = getToken(req);
  if (!token) {
    json(res, 401, { message: 'Authentication required' });
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    const admin = await Admin.findById(payload.sub).select('email');
    if (!admin) {
      json(res, 401, { message: 'Invalid or expired token' });
      return null;
    }
    return admin;
  } catch {
    json(res, 401, { message: 'Invalid or expired token' });
    return null;
  }
}

async function requireUser(req, res) {
  const token = getToken(req);
  if (!token) {
    json(res, 401, { message: 'No token' });
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    const user = await User.findById(payload.sub).select('name email');
    if (!user) {
      json(res, 401, { message: 'Invalid token' });
      return null;
    }
    return user;
  } catch {
    json(res, 401, { message: 'Invalid token' });
    return null;
  }
}

function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: '8h' }
  );
}

function signUserToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: '7d' }
  );
}

module.exports = async (req, res) => {
  try {
    await connectToDb();

    const parts = getPathParts(req);
    const root = parts[0] || '';
    const method = (req.method || 'GET').toUpperCase();
    const body = getBody(req);

    if (root === 'health' && method === 'GET') {
      return json(res, 200, { ok: true, service: 'Little Sip Cafe API' });
    }

    if (root === 'menu') {
      if (method === 'GET') {
        const items = await MenuItem.find().sort({ category: 1, name: 1 });
        return json(res, 200, items);
      }

      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (method === 'POST') {
        const { name, category, price, description, image } = body;
        if (!name || !category || price == null) {
          return json(res, 400, { message: 'name, category, and price are required' });
        }

        const item = await MenuItem.create({
          name,
          category,
          price: Number(price),
          description: description || '',
          image: image || '',
        });
        return json(res, 201, item);
      }

      if (method === 'PUT') {
        const id = parts[1] || '';
        if (!id) return json(res, 400, { message: 'Menu item id is required' });

        const update = {};
        if (body.name != null) update.name = body.name;
        if (body.category != null) update.category = body.category;
        if (body.price != null) update.price = Number(body.price);
        if (body.description != null) update.description = body.description;
        if (body.image != null) update.image = body.image;

        const item = await MenuItem.findByIdAndUpdate(id, update, {
          new: true,
          runValidators: true,
        });
        if (!item) return json(res, 404, { message: 'Menu item not found' });
        return json(res, 200, item);
      }

      if (method === 'DELETE') {
        const id = parts[1] || '';
        if (!id) return json(res, 400, { message: 'Menu item id is required' });

        const item = await MenuItem.findByIdAndDelete(id);
        if (!item) return json(res, 404, { message: 'Menu item not found' });
        return json(res, 200, { message: 'Deleted', id });
      }
    }

    if (root === 'reservations') {
      if (method === 'POST') {
        const { name, email, phone, guests, date, time, specialRequest } = body;
        if (!name || !email || !phone || guests == null || !date || !time) {
          return json(res, 400, {
            message: 'name, email, phone, guests, date, and time are required',
          });
        }

        const reservation = await Reservation.create({
          name,
          email,
          phone,
          guests: Number(guests),
          date,
          time,
          specialRequest: specialRequest || '',
        });
        return json(res, 201, reservation);
      }

      if (method === 'GET') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;

        const list = await Reservation.find().sort({ createdAt: -1 });
        return json(res, 200, list);
      }
    }

    if (root === 'reviews') {
      if (method === 'GET') {
        const list = await Review.find().sort({ date: -1, createdAt: -1 });
        return json(res, 200, list);
      }

      if (method === 'POST') {
        const { name, rating, comment } = body;
        if (!name || rating == null || !comment) {
          return json(res, 400, { message: 'name, rating, and comment are required' });
        }

        const review = await Review.create({
          name,
          rating: Number(rating),
          comment,
          date: new Date(),
        });
        return json(res, 201, review);
      }
    }

    if (root === 'orders') {
      if (method === 'POST') {
        const { items, totalPrice, customerName, status, user } = body;
        if (!items || !Array.isArray(items) || items.length === 0) {
          return json(res, 400, { message: 'items array is required' });
        }
        if (totalPrice == null) {
          return json(res, 400, { message: 'totalPrice is required' });
        }

        const order = await Order.create({
          items: items.map((item) => ({
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity) || 1,
          })),
          totalPrice: Number(totalPrice),
          customerName: customerName || 'Guest',
          user: user || undefined,
          status: status || 'pending',
        });
        return json(res, 201, order);
      }

      if (method === 'GET') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;

        const list = await Order.find().sort({ createdAt: -1 });
        return json(res, 200, list);
      }

      if (method === 'PATCH') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;

        const id = parts[1] || '';
        const { status } = body;
        const allowed = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
        if (!status || !allowed.includes(status)) {
          return json(res, 400, { message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
          id,
          { status },
          { new: true, runValidators: true }
        );
        if (!order) return json(res, 404, { message: 'Order not found' });
        return json(res, 200, order);
      }
    }

    if (root === 'auth') {
      if (parts[1] === 'login' && method === 'POST') {
        const { email, password } = body;
        if (!email || !password) {
          return json(res, 400, { message: 'Email and password required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin || !(await admin.comparePassword(password))) {
          return json(res, 401, { message: 'Invalid credentials' });
        }

        return json(res, 200, { token: signAdminToken(admin), email: admin.email });
      }

      if (parts[1] === 'me' && method === 'GET') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;

        return json(res, 200, { email: admin.email });
      }
    }

    if (root === 'users') {
      if (parts[1] === 'register' && method === 'POST') {
        const { name, email, password } = body;
        if (!name || !email || !password) {
          return json(res, 400, { message: 'Missing fields' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return json(res, 400, { message: 'Email already exists' });
        }

        const user = await User.create({ name, email: normalizedEmail, password });
        return json(res, 201, {
          user: { id: user._id, name: user.name, email: user.email },
          token: signUserToken(user),
        });
      }

      if (parts[1] === 'login' && method === 'POST') {
        const { email, password } = body;
        const user = await User.findOne({ email: (email || '').toLowerCase().trim() });
        if (!user || !(await user.comparePassword(password))) {
          return json(res, 401, { message: 'Invalid credentials' });
        }

        return json(res, 200, {
          user: { id: user._id, name: user.name, email: user.email },
          token: signUserToken(user),
        });
      }

      if (parts[1] === 'me' && method === 'GET') {
        const user = await requireUser(req, res);
        if (!user) return;

        return json(res, 200, { id: user._id, name: user.name, email: user.email });
      }
    }

    return json(res, 404, { message: 'Not found' });
  } catch (error) {
    console.error(error);
    return json(res, 500, { message: error.message || 'Server error' });
  }
};