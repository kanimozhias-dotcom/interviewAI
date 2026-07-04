import mongoose from 'mongoose';
import dns from 'dns';

// Fix for SRV resolution errors on mobile hotspots / restricted networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      maxPoolSize: 10, // Maintain a pool for better stability
      waitQueueTimeoutMS: 30000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected. Network drop detected, waiting for driver to automatically reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB successfully reconnected to the replica set');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
  } catch (error) {
    console.error('❌ Failed to establish initial MongoDB connection:', error.message);
    console.log('⚠️  Running without database - some features will be unavailable');
  }
};
