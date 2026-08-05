const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../Middleware/authMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../Controllers/ProductController');

// ─── Public Routes ─────────────────────────────────────────────────────────────
// GET /api/products               — list all (supports ?search=&category=&price=&page=&limit=)
router.get('/', getAllProducts);

// GET /api/products/categories    — list all distinct categories
router.get('/categories', getCategories);

// GET /api/products/:id           — get single API listing by ID
router.get('/:id', getProductById);

// ─── Protected Routes (JWT + provider role required) ──────────────────────────
// POST   /api/products            — publish new API listing
router.post('/', protect, authorize('provider'), createProduct);

// PUT    /api/products/:id        — update API listing (owner only)
router.put('/:id', protect, authorize('provider'), updateProduct);

// DELETE /api/products/:id        — soft-delete API listing (owner only)
router.delete('/:id', protect, authorize('provider'), deleteProduct);

module.exports = router;
