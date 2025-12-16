/**
 * Middleware to check if authenticated user has admin role
 * Must be used after authenticateToken middleware
 */
const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated (set by authenticateToken middleware)
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Admin privileges required.' 
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authorization error' });
  }
};

module.exports = {
  requireAdmin
};
