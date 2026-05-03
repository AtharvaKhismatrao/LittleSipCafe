require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const MenuItem = require('./models/MenuItem');

const menuSeed = [
  {
    name: 'Espresso',
    category: 'Coffee',
    price: 180,
    description: 'Bold single shot of pure coffee essence.',
    image:
      'https://images.unsplash.com/photo-1510591509098-f4fdc6d0e04d?w=600&q=80',
  },
  {
    name: 'Cappuccino',
    category: 'Coffee',
    price: 220,
    description: 'Espresso with steamed milk and a cloud of foam.',
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80',
  },
  {
    name: 'Latte',
    category: 'Coffee',
    price: 240,
    description: 'Silky espresso with lots of steamed milk.',
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
  },
  {
    name: 'Americano',
    category: 'Coffee',
    price: 190,
    description: 'Espresso diluted with hot water for a mellow cup.',
    image:
      'https://images.unsplash.com/photo-1551030171-12266abd88b3?w=600&q=80',
  },
  {
    name: 'Mocha',
    category: 'Coffee',
    price: 260,
    description: 'Chocolate meets espresso in a cozy hug.',
    image:
      'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&q=80',
  },
  {
    name: 'Cold Brew',
    category: 'Coffee',
    price: 210,
    description: 'Slow-steeped, smooth, and refreshingly bold.',
    image:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80',
  },
  {
    name: 'Croissant',
    category: 'Pastries',
    price: 180,
    description: 'Buttery, flaky layers baked fresh daily.',
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
  },
  {
    name: 'Blueberry Muffin',
    category: 'Pastries',
    price: 190,
    description: 'Bursting with berries and a golden top.',
    image:
      'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&q=80',
  },
  {
    name: 'Chocolate Chip Cookie',
    category: 'Pastries',
    price: 130,
    description: 'Classic chewy cookie with melty chips.',
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80',
  },
  {
    name: 'Banana Bread',
    category: 'Pastries',
    price: 160,
    description: 'Moist, spiced, and perfect with coffee.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
  },
  {
    name: 'Almond Biscotti',
    category: 'Pastries',
    price: 140,
    description: 'Crisp twice-baked cookies with toasted almonds.',
    image:
      'https://images.unsplash.com/photo-1590080876351-941b5a680d12?w=600&q=80',
  },
  {
    name: 'Avocado Toast',
    category: 'Food',
    price: 350,
    description: 'Smashed avocado on artisan sourdough with sea salt.',
    image:
      'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&q=80',
  },
  {
    name: 'Bagel & Cream Cheese',
    category: 'Food',
    price: 220,
    description: 'Toasted bagel with rich cream cheese spread.',
    image:
      'https://images.unsplash.com/photo-1585856339392-4a70b7d36de0?w=600&q=80',
  },
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/littlesip_cafe';
  await mongoose.connect(uri);
  console.log('Connected for seed');

  const email = (process.env.ADMIN_EMAIL || 'admin@littlesipcafe.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  let admin = await Admin.findOne({ email });
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await Admin.create({ email, passwordHash });
    console.log('Admin created:', email);
  } else {
    console.log('Admin already exists:', email);
  }

  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany(menuSeed);
    console.log(`Inserted ${menuSeed.length} menu items`);
  } else {
    console.log(`Menu already has ${count} items — skip menu seed`);
  }

  await mongoose.disconnect();
  console.log('Seed done');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
