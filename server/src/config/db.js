import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

/**
 * MongoDB is optional. Without MONGODB_URI the site runs normally;
 * only the anonymous inquiry metadata log is disabled.
 */
export async function connectDb() {
  if (!env.mongoUri) {
    logger.info('db.disabled', { reason: 'MONGODB_URI not set' });
    return false;
  }
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    logger.info('db.connected');
    return true;
  } catch (err) {
    // Never log the connection string.
    logger.error('db.connection_failed', { reason: err.name });
    return false;
  }
}

export const isDbConnected = () => mongoose.connection.readyState === 1;

export async function disconnectDb() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}
