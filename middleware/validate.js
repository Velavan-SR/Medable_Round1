const validator = require('validator');

/**
 * Validates email format
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

/**
 * Validates password strength
 * Requirements: At least 6 characters
 */
const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters long' 
    });
  }
  
  next();
};

/**
 * Validates registration input
 */
const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;
  
  // Validate email
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Validate password
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters long' 
    });
  }
  
  // Validate name (optional but should be string if provided)
  if (name && typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a string' });
  }
  
  next();
};

/**
 * Validates login input
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

/**
 * Validates user update input
 */
const validateUserUpdate = (req, res, next) => {
  const { email, name, role } = req.body;
  
  // If email is being updated, validate format
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Validate name if provided
  if (name && typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a string' });
  }
  
  // Validate role if provided
  if (role && !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be either "user" or "admin"' });
  }
  
  // Don't allow direct password updates through this endpoint
  if (req.body.password) {
    return res.status(400).json({ 
      error: 'Use /api/auth/change-password to update password' 
    });
  }
  
  next();
};

/**
 * Validates password change input
 */
const validatePasswordChange = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ 
      error: 'Both old password and new password are required' 
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ 
      error: 'New password must be at least 6 characters long' 
    });
  }
  
  if (oldPassword === newPassword) {
    return res.status(400).json({ 
      error: 'New password must be different from old password' 
    });
  }
  
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRegistration,
  validateLogin,
  validateUserUpdate,
  validatePasswordChange
};
