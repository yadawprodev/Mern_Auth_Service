import dotenv from 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import logger from './utils/logger.js';
import connectToDB from './config/mongodb.js';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://mern-auth-service.vercel.app',
];

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

async function startServer() {
  connectToDB();
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

// start our server
startServer();

// unhandled rejections
process.on('unhandledRejection', (reason) => {
  logger.error(' ERROR:', reason);
});
