require('dotenv').config();
const jwt = require('jsonwebtoken');
const { findUserById } = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    // Expected format: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Invalid token' });
      }
      
      // Check if user still exists
      const user = findUserById(decoded.userId);
      if (!user) {
        return res.status(403).json({ error: 'User not found' });
      }
      
      // Attach user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * Useful for endpoints that work differently with/without auth
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        const user = findUserById(decoded.userId);
        if (user) {
          req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
          };
        }
      }
      next();
    });
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
