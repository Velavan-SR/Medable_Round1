// Centralized user data storage
// This is the single source of truth for user data across the application

const users = [
  {
    id: '1',
    email: 'admin@test.com',
    password: '$2a$10$xEfqKTibltznzKfYKyXIDuMMjyNpO1NjsNrFoqSTyMHDhoNCzL1RC', // 'admin123'
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString()
  },
  {
    id: '2',
    email: 'user@test.com', 
    password: '$2a$10$SF5Nmp6rX2HEtHf3HZ.6E.lDGhV0LLR8YSLRsLe/rZ7iIYbwQ5HTG', // 'user123'
    name: 'Regular User',
    role: 'user',
    createdAt: new Date('2024-01-02').toISOString()
  }
];

// Export users array and helper functions
module.exports = {
  users,
  
  // Get all users
  getAllUsers: () => users,
  
  // Find user by email
  findUserByEmail: (email) => users.find(u => u.email === email),
  
  // Find user by ID
  findUserById: (id) => users.find(u => u.id === id),
  
  // Add new user
  addUser: (user) => {
    users.push(user);
    return user;
  },
  
  // Update user
  updateUser: (id, updateData) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updateData };
    return users[index];
  },
  
  // Delete user
  deleteUser: (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    users.splice(index, 1);
    return true;
  }
};
