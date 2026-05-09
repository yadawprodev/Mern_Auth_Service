import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import { getUserData } from '../controllers/authController.js';

const router = express.Router();

router.get('/user', authMiddleware, getUserData);

export default router;
