const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

// ─── Protect Route Middleware ─────────────────────────────────────────────────
// Verifies JWT Bearer token and attaches decoded user to req.user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized — no token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user without password hash
    req.user = await User.findById(decoded.id).select('-passwordHash');

    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized — user no longer exists'));
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ─── Role Guard Middleware ────────────────────────────────────────────────────
// Usage: authorize('provider') or authorize('developer', 'provider')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(
          `Access denied — role "${req.user.role}" is not authorized for this action`
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
