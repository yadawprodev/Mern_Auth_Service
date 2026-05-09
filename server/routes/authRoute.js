import express from 'express';

import RateLimiter from '../middlewares/rateLimiter.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationOtp,
  sendResetPasswordOtp,
  verifyOtp,
  resetPassword,
  isAuthenticated,
} from '../controllers/authController.js';

const router = express.Router();

router.use(RateLimiter); // Apply rate limiting to all auth routes

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.post('/send-verification-otp', authMiddleware, sendVerificationOtp);
router.post('/send-reset-password-otp', sendResetPasswordOtp);
router.post('/verify-account', authMiddleware, verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/is-authenticated', authMiddleware, isAuthenticated);

export default router;
