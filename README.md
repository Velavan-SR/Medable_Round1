# 🔐 Assessment 1: User Management API

Welcome to the User Management API assessment! This project contains a Node.js API with intentional bugs and missing features that you need to fix and implement.

## 🎯 Objective

Your goal is to:
1. **Fix all bugs** in the existing code
2. **Implement missing features** 
3. **Solve the puzzles** hidden throughout the application
4. **Improve security** and best practices

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3003`

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

#### POST /api/auth/register  
Register a new user
```json
{
  "email": "newuser@test.com",
  "password": "securepassword123",
  "name": "New User"
}
```

### User Management Endpoints

#### GET /api/users
Get all users with pagination (requires authentication)
- Query params: `page` (default: 1), `limit` (default: 10)

#### GET /api/users/:id
Get user by ID (requires authentication)

#### PUT /api/users/:id
Update user information (requires authentication)
- Users can only update their own profile unless they're admin
- Cannot update password directly (use change-password endpoint)

#### DELETE /api/users/:id
Delete user (requires admin role)
- Cannot delete your own account

### Profile & Admin Endpoints

#### GET /api/auth/profile
Get current user's profile (requires authentication)

#### POST /api/auth/change-password
Change password (requires authentication)
```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword123"
}
```

#### GET /api/admin/stats
Get user statistics (requires admin role)
- Returns total users, admin count, regular users, and recent users

## 🐛 Bugs to Fix

### Critical Security Issues
1. ✅ **FIXED - Hardcoded JWT Secret** - Moved to `.env` file
2. ✅ **FIXED - Password Exposure** - Implemented sanitization utility to remove passwords from all responses
3. ✅ **FIXED - Missing Authentication** - Added JWT authentication middleware to all protected routes
4. ✅ **FIXED - No Input Validation** - Implemented comprehensive validation using validator library
5. ✅ **FIXED - Async/Await Bug** - Properly awaiting `bcrypt.compare()` in login endpoint
6. ✅ **FIXED - No Rate Limiting** - Added express-rate-limit (10 req/15min for auth, 100 req/15min for API)

### Functionality Bugs
7. ✅ **FIXED - Duplicate User Data** - Centralized in `data/users.js` as single source of truth
8. ✅ **FIXED - Missing Error Handling** - Added try-catch blocks and JSON parsing validation
9. ✅ **FIXED - No Role-Based Access** - Implemented admin middleware for protected operations
10. ✅ **FIXED - Self-Deletion Prevention** - Added check to prevent users from deleting their own account

## ⚡ Features to Implement

### Must-Have Features
1. ✅ **IMPLEMENTED - JWT Authentication Middleware** - Created `middleware/auth.js` with token verification
2. ✅ **IMPLEMENTED - Input Validation** - Created `middleware/validate.js` with comprehensive validation
3. ✅ **IMPLEMENTED - Password Hashing for Updates** - Change password endpoint with proper bcrypt hashing
4. ✅ **IMPLEMENTED - User Profile Endpoint** - GET /api/auth/profile returns current user info
5. ✅ **IMPLEMENTED - Password Change Endpoint** - POST /api/auth/change-password with old password verification
6. ✅ **IMPLEMENTED - Admin User Statistics** - GET /api/admin/stats with user counts and recent users
7. ✅ **IMPLEMENTED - Pagination** - Added pagination to GET /api/users with page and limit params

## 🧩 Puzzles & Hidden Challenges

### Puzzle 1: Secret Headers ✅
**Question:** Find the secret header set in the network configuration. What value is it set to?  
**Answer:** `X-Secret-Challenge: find_me_if_you_can_2024` - Found in all response headers

### Puzzle 2: Hidden Endpoint ✅
**Question:** There's a secret endpoint mentioned in the API responses. Can you find and access it?  
**Answer:** `/api/secret-stats` - Discovered via `X-Secret-Endpoint` header in GET /api/users response

### Puzzle 3: Encoded Message ✅
**Question:** Once you find the secret endpoint, decode the hidden message. What does it say?  
**Answer:** Base64 decoded message: "Congratulations! You found the secret endpoint. The final clue is: SHC_Header_Puzzle_2024"

### Puzzle 4: Access Methods ✅
**Question:** The secret endpoint has multiple ways to access it. Can you find both methods?  
**Answer:** 
1. Via header check: `X-Secret-Challenge: find_me_if_you_can_2024` (automatically set by server)
2. Via query parameter: `?secret=admin_override`

## 🔧 Testing Your Solutions

### Manual Testing Commands

```bash
# Test login
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Test user creation
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'

# Test getting users (requires auth - should fail without token)
curl http://localhost:3003/api/users

# Test with authentication (replace YOUR_TOKEN)
curl http://localhost:3003/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test profile endpoint
curl http://localhost:3003/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test admin stats (admin only)
curl http://localhost:3003/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Test the secret endpoint (both methods work!)
curl http://localhost:3003/api/secret-stats
curl "http://localhost:3003/api/secret-stats?secret=admin_override"
```

### Expected Behavior After Fixes

1. **Secure Authentication** - JWT tokens should be properly validated
2. **No Sensitive Data Leaks** - Passwords should never be returned
3. **Proper Validation** - Invalid emails/weak passwords should be rejected
4. **Role-Based Security** - Only admins can access admin endpoints
5. **Centralized Data** - Single source of truth for user data

---

## 📊 Test Report

### Test Environment
- **Node Version:** v20.19.4
- **Server Port:** 3003
- **Test Date:** December 16, 2025

### Test Credentials

- **Admin:** `admin@test.com` / `admin123`
- **User:** `user@test.com` / `user123`

---

## 🎉 Summary

All 10 bugs have been fixed, all 6 required features have been implemented, and all 4 puzzles remain functional. The application now follows security best practices with proper authentication, authorization, input validation, and rate limiting.

**Ready for deployment!** 🚀