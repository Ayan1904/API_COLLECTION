const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const {
  register,
  login,
  getProfile,
  generateApiKey,
  updateProfile,
} = require('../Controllers/UserController');

// ─── Public Routes ─────────────────────────────────────────────────────────────
// POST /api/users/register
router.post('/register', register);

// POST /api/users/login
router.post('/login', login);

// ─── Protected Routes (JWT required) ──────────────────────────────────────────
// GET  /api/users/profile
router.get('/profile', protect, getProfile);

// PUT  /api/users/profile
router.put('/profile', protect, updateProfile);

// POST /api/users/generate-key
router.post('/generate-key', protect, generateApiKey);

module.exports = router;
