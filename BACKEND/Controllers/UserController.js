const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/UserModel');

// ─── Helper: Generate JWT ─────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// ─── @route   POST /api/users/register ───────────────────────────────────────
// ─── @access  Public
const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role, company } = req.body;

    if (!fullName || !email || !password) {
      res.status(400);
      throw new Error('Full name, email, and password are required');
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409);
      throw new Error('An account with this email already exists');
    }

    // Create user — passwordHash field triggers the pre-save bcrypt hook
    const user = await User.create({
      fullName,
      email,
      passwordHash: password,
      role: role || 'developer',
      company: company || '',
      apiKey: uuidv4(), // generate API key on registration
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/users/login ──────────────────────────────────────────
// ─── @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    // Find user — need passwordHash so select it back
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);

    // Return user without password hash
    const userData = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/users/profile ─────────────────────────────────────────
// ─── @access  Private (JWT required)
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/users/generate-key ───────────────────────────────────
// ─── @access  Private (JWT required)
const generateApiKey = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.apiKey = uuidv4();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'New API key generated successfully',
      apiKey: user.apiKey,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/users/profile ─────────────────────────────────────────
// ─── @access  Private (JWT required)
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['fullName', 'company'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, generateApiKey, updateProfile };
