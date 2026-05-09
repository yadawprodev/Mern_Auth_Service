import { z } from 'zod';

// REGISTER
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// LOGIN
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// RESET PASSWORD
export const resetPasswordSchema = z.object({
  otp: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email format'),
});
