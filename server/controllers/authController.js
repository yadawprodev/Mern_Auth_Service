import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import logger from '../utils/logger.js';
import User from '../models/User.js';

import sendEmail from '../config/mail.js';

import {
  generateOtpTemplate,
  welcomeTemplate,
} from '../config/emailTemplates.js';

import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from '../utils/validation.js';

// Register a new user and set JWT token in cookie
const registerUser = async (req, res) => {
  logger.info('Registration endpoint hit ...');
  try {
    // validate user schema
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      logger.warn(`Validation failed`, { error: result.error.issues });

      const errorMessages = result.error.issues
        .map((issue) => issue.message)
        .join('\n');
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    const { username, email, password } = result.data;

    // check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      logger.warn('Attempt to register with existing email', { email });
      return res.status(400).json({
        success: false,
        message: `User already exists with email ${email}`,
      });
    }

    const html = welcomeTemplate
      .replaceAll('{{USERNAME}}', username)
      .replace('{{EMAIL}}', email);

    // create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // save user token in cookie
    res.cookie('token', token, {
      httpOnly: true, // prevents JS access (important for security)
      secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // send welcome email
    try {
      await sendEmail({
        to: email,
        subject: `Welcome ${username} to my website`,
        htmlContent: html,
      });

      logger.info('Welcome email sent successfully', { email });
    } catch (emailError) {
      logger.error('Failed to send welcome email', {
        email,
        message: emailError.message,
        stack: emailError.stack,
      });
    }
    logger.info('User registered successfully', { email });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userData: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAccountVerified: newUser.isVerified,
      },
    });
  } catch (e) {
    logger.error('Error during registration', {
      message: e.message,
      stack: e.stack,
    });

    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login user and set JWT token in cookie
const loginUser = async (req, res) => {
  logger.info(`Login endpoint hit...`);
  try {
    // validate user schema
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      logger.warn('Validation failed', { error: result.error.issues });
      const errorMessages = result.error.issues
        .map((issue) => issue.message)
        .join('\n');
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    const { email, password } = result.data;

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('Attempt to login with non-existing email', { email });
      return res.status(400).json({
        success: false,
        message: `User does not exist with email ${email}`,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      logger.warn('Invalid password attempt', { email });
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // save user token in cookie
    res.cookie('token', token, {
      httpOnly: true, // prevents JS access (important for security)
      secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info('User logged in successfully', { email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userData: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAccountVerified: user.isVerified,
      },
    });
  } catch (e) {
    logger.error('Error during login', {
      message: e.message,
      stack: e.stack,
    });

    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Clear the authentication cookie to log out the user
const logoutUser = (req, res) => {
  logger.info('Logout endpoint hit...');
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    logger.info('User logged out successfully');

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (e) {
    logger.error('Error during logout', {
      message: e.message,
      stack: e.stack,
    });

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Send verification OTP to the user's email
const sendVerificationOtp = async (req, res) => {
  try {
    const { userId } = req.userInfo;

    const user = await User.findById(userId);

    if (user.isVerified) {
      logger.warn(
        'Attempt to send verification email to already verified user',
        { userId },
      );
      return res.json({
        success: false,
        message: 'User already verified',
      });
    }

    // Generate OTP and save to user document
    const otp = user.setVerifyOtp();
    await user.save();

    // Email html template for email verification
    const html = generateOtpTemplate({
      title: 'Verify Your Email',
      message: 'Use the OTP below to verify your account.',
      otp,
      accentColor: '#4f46e5',
      warningMessage:
        'If you did not create this account, you can safely ignore this email.',
    });

    try {
      // Send email with Brevo API
      await sendEmail({
        to: user.email,
        subject: 'Email Verification OTP',
        htmlContent: html,
      });

      logger.info('Verification email sent successfully', {
        email: user.email,
      });
    } catch (emailError) {
      logger.error('Failed to send verification email', {
        email: user.email,
        message: emailError.message,
        stack: emailError.stack,
      });
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (e) {
    logger.error('Error sending verification email', {
      message: e.message,
      stack: e.stack,
    });

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// verify user email
const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { userId } = req.userInfo;

    if (!userId || !otp) {
      logger.warn('OTP verification attempt with missing userId or OTP');
      return res.status(400).json({
        success: false,
        message: 'User ID and OTP are required',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn('OTP verification attempt for non-existing user', { userId });
      return res.status(400).json({
        success: false,
        message: 'Invalid user',
      });
    }

    if (user.isVerified) {
      logger.warn('OTP verification attempt for already verified user', {
        userId,
      });
      return res.status(400).json({
        success: false,
        message: 'User already verified',
      });
    }

    const hasheOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hasheOtp !== user.verifyOtp) {
      logger.warn('Invalid OTP verification attempt', { userId });

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (user.verifyOtpExpiresAt < new Date()) {
      logger.warn('Expired OTP verification attempt', { userId });
      return res.status(400).json({
        success: false,
        message: 'OTP expired',
      });
    }

    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiresAt = undefined;
    await user.save();

    logger.info('User email verified successfully', { userId });

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (e) {
    logger.error('Error verifying email', {
      message: e.message,
      stack: e.stack,
    });

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Send password reset OTP to the user's email
const sendResetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('Password reset OTP attempt for non-existing user', {
        email,
      });
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate OTP and save to user document
    const otp = user.setResetOtp();
    await user.save();

    // Email html template for email verification
    const html = generateOtpTemplate({
      title: 'Reset Your Password',
      message: 'Use the OTP below to reset your password.',
      otp,
      accentColor: '#dc2626',
      warningMessage:
        'If you did not request a password reset, you can ignore this email.',
    });

    // Send email with Brevo API
    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      htmlContent: html,
    });
    logger.info('Password reset email sent successfully', {
      email: user.email,
    });

    res.json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (e) {
    logger.error('Error sending reset password OTP', {
      message: e.message,
      stack: e.stack,
    });

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    // Validate user schema
    const result = resetPasswordSchema.safeParse(req.body);

    if (!result.success) {
      logger.warn('Validation failed', { error: result.error.issues });
      const errorMessages = result.error.issues
        .map((issue) => issue.message)
        .join('\n');
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    const { otp, newPassword, email } = result.data;

    if (!otp || !newPassword) {
      logger.warn('Password reset attempt with missing OTP, or new password');
      return res.status(400).json({
        success: false,
        message: 'OTP, and new password are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('Password reset attempt for non-existing user', { email });
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    const hasheOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hasheOtp !== user.resetOtp) {
      logger.warn('Invalid OTP password reset attempt', { email });
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (user.resetOtpExpiresAt < new Date()) {
      logger.warn('Expired OTP password reset attempt', { email });
      return res.status(400).json({
        success: false,
        message: 'OTP expired',
      });
    }

    // Check if new password is the same as current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      logger.warn('Password reset attempt with same password', { email });
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the same as your current password',
      });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();

    logger.info('Password reset successfully', { email });
    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (e) {
    logger.error('Error resetting password', {
      message: e.message,
      stack: e.stack,
    });
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Fetch user data for authenticated user
const getUserData = async (req, res) => {
  try {
    const { userId } = req.userInfo;

    const user = await User.findById(userId);

    if (!user) {
      logger.warn('Attempt to fetch data for non-existing user', { userId });
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info('User data fetched successfully', { userId });
    res.status(200).json({
      success: true,
      userData: {
        username: user.username,
        email: user.email,
        isAccountVerified: user.isVerified,
      },
    });
  } catch (e) {
    logger.error('Error fetching user data', {
      message: e.message,
      stack: e.stack,
    });
    logger.error(` Error fetching user data for User ID: ${req.body.userId}`);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Check if user is authenticated
const isAuthenticated = async (req, res) => {
  try {
    const { userId } = req.userInfo;

    const user = await User.findById(userId);

    if (!user) {
      logger.warn('Authentication check for non-existing user', { userId });
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info('User authentication check successful', { userId });
    res.status(200).json({
      success: true,
      isAccountVerified: user.isVerified,
    });
  } catch (e) {
    logger.error('Error checking authentication', {
      message: e.message,
      stack: e.stack,
    });

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationOtp,
  sendResetPasswordOtp,
  verifyOtp,
  resetPassword,
  getUserData,
  isAuthenticated,
};
