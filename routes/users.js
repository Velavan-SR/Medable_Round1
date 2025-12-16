require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Import centralized user data
const { 
  getAllUsers,
  findUserById, 
  findUserByEmail,
  updateUser,
  deleteUser
} = require('../data/users');

// Import utilities
const { sanitizeUser, sanitizeUsers } = require('../utils/sanitize');

// Import middleware
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { validateUserUpdate } = require('../middleware/validate');

// Get all users (with optional pagination)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const allUsers = getAllUsers();
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);
    
    res.set({
      'X-Total-Users': allUsers.length.toString(),
      'X-Current-Page': page.toString(),
      'X-Secret-Endpoint': '/api/users/secret-stats' // PUZZLE: Hidden endpoint hint
    });
    
    res.json({
      users: sanitizeUsers(paginatedUsers),
      pagination: {
        total: allUsers.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(allUsers.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/:userId', authenticateToken, validateUserUpdate, async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    const user = findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Only admins can update other users or change roles
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'You can only update your own profile' 
      });
    }
    
    // Only admins can change roles
    if (updateData.role && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Only admins can change user roles' 
      });
    }
    
    // Check if email is being changed to an existing email
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = findUserByEmail(updateData.email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = updateUser(userId, updateData);

    res.json({
      message: 'User updated successfully',
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent self-deletion
    if (req.user.userId === userId) {
      return res.status(400).json({ 
        error: 'You cannot delete your own account' 
      });
    }
    
    const user = findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    deleteUser(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;