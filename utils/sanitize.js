// Utility to sanitize user objects before sending in API responses
// Removes sensitive information like passwords

/**
 * Removes password and other sensitive fields from user object
 * @param {Object} user - User object
 * @returns {Object} - Sanitized user object
 */
const sanitizeUser = (user) => {
  if (!user) return null;
  
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

/**
 * Sanitizes an array of users
 * @param {Array} users - Array of user objects
 * @returns {Array} - Array of sanitized user objects
 */
const sanitizeUsers = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(sanitizeUser);
};

module.exports = {
  sanitizeUser,
  sanitizeUsers
};
