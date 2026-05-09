import mongoose from 'mongoose';

import logger from '../utils/logger.js';

const connectToDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      logger.error('MONGO_URI is not defined');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'mern-auth',
    });
    logger.info('Connected to database successfully');
  } catch (e) {
    logger.error('MongoDB connection error:', {
      message: e.message,
      stack: e.stack,
    });
    process.exit(1);
  }
};

export default connectToDB;
