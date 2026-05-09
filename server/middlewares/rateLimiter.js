import { RateLimiterRedis } from 'rate-limiter-flexible';

import { redis } from '../config/redis.js';
import logger from '../utils/logger.js';

const limiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'login_fail',
  points: 5, // 5 attempts
  duration: 60 * 5, // 5 min window
  blockDuration: 60 * 15, // block 15 min
});

const RateLimiter = async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    next();
  } catch (err) {
    logger.error(err);
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: 'false',
      message: 'Too many attempts. Try again later.',
    });
  }
};

export default RateLimiter;
