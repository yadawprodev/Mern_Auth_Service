import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const authMiddleware = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      logger.warn('Access attempted with out token');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized please login to continue',
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.id) {
      req.userInfo = { userId: decodedToken.id };
    } else {
      logger.warn('Invalid token provided');
      return res.status(401).json({
        success: false,
        message: 'Invalid token provided',
      });
    }

    next();
  } catch (e) {
    logger.error('Authentication error:', e);
    res.status(401).json({
      success: false,
      message: 'Unauthorized please login to access this resource',
    });
  }
};

export default authMiddleware;
