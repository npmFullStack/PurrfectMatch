// authMiddleware.js
import jwt from 'jsonwebtoken';
import { createResponse } from './helper.js';

// JWT authentication middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(createResponse(false, 'Access token required', null, 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json(createResponse(false, 'Invalid or expired token', null, 403));
    }
    req.user = decoded.user;
    next();
  });
};

// Optional: Check if user is authenticated but don't block if not
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded.user;
      }
    });
  }
  next();
};