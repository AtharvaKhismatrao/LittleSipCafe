const mongoose = require('mongoose');

let cached = global.__littlesipMongoose;

if (!cached) {
  cached = global.__littlesipMongoose = { conn: null, promise: null };
}

async function connectToDb() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((client) => client);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectToDb };