require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Import centralized user data
const { 
  findUserByEmail, 
  findUserById, 
  addUser,
  updateUser 
} = require('../data/users');

// Import utilities
const { sanitizeUser } = require('../utils/sanitize');

// Import validation middleware
const { 
  validateRegistration, 
  validateLogin,
  validatePasswordChange 
} = require('../middleware/validate');

// Import auth middleware
const { authenticateToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET;

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // FIX: Properly await bcrypt.compare
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.set('X-Hidden-Hint', 'check_the_response_headers_for_clues');
    
    res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user) // FIX: Remove password from response
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = findUserByEmail(email);
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name: name || 'Unknown User',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    addUser(newUser);

    res.status(201).json({
      message: 'User created successfully',
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = findUserById(req.user.userId);
    
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

// Change password
router.post('/change-password', authenticateToken, validatePasswordChange, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const user = findUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    updateUser(user.id, { password: hashedPassword });

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;