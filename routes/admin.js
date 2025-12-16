require('dotenv').config();
const express = require('express');
const router = express.Router();

// Import centralized user data
const { getAllUsers } = require('../data/users');

// Import middleware
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

/**
 * GET /api/admin/stats
 * Get user statistics (admin only)
 */
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const allUsers = getAllUsers();
    
    // Calculate statistics
    const stats = {
      totalUsers: allUsers.length,
      adminUsers: allUsers.filter(u => u.role === 'admin').length,
      regularUsers: allUsers.filter(u => u.role === 'user').length,
      recentUsers: allUsers
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          createdAt: u.createdAt
        })),
      timestamp: new Date().toISOString()
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
