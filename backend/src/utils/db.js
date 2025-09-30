const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDatabase() {
  let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }

  // Ensure URI has a database name (Mongo sometimes fails if missing)
  if (mongoUri.endsWith('/')) {
    mongoUri += 'test'; // fallback DB name, replace with your own
  }

  mongoose.set('strictQuery', true);

  // Connection event listeners for debugging
  mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to DB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected');
  });

  try {
    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        family: 4, // force IPv4
      });
    console.log('🎉 Connected to MongoDB at', mongoUri);
  } catch (err) {
    console.error('❌ Initial MongoDB connection error:', err);
    console.log('🔍 MONGODB_URI used:', mongoUri);
    throw err;
  }
}

module.exports = { connectToDatabase };
