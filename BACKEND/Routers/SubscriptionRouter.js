const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const {
  createSubscription,
  getSubscriptions,
  cancelSubscription,
  checkSubscription,
} = require('../Controllers/SubscriptionController');

// All subscription routes are protected
router.use(protect);

router.post('/', createSubscription);
router.get('/', getSubscriptions);
router.delete('/:id', cancelSubscription);
router.get('/check/:apiId', checkSubscription);

module.exports = router;
