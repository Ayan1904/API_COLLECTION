const crypto = require('crypto');
const Subscription = require('../Models/SubscriptionModel');
const Product = require('../Models/ProductModel');

// ─── @route   POST /api/subscriptions ─────────────────────────────────────────
// ─── @access  Private
const createSubscription = async (req, res, next) => {
  try {
    const { apiId, planName } = req.body;

    if (!apiId || !planName) {
      res.status(400);
      throw new Error('API ID and Plan Name are required');
    }

    // Verify product/API exists
    const product = await Product.findById(apiId);
    if (!product) {
      res.status(404);
      throw new Error('API listing not found');
    }

    // Check for existing active subscription
    const existing = await Subscription.findOne({
      user: req.user._id,
      api: apiId,
      status: 'active',
    });

    if (existing) {
      res.status(400);
      throw new Error(`You already have an active subscription to this API (${existing.planName})`);
    }

    // Generate unique subscription API Key
    const randomHex = crypto.randomBytes(24).toString('hex');
    const apiKey = `apihub_sub_${randomHex}`;

    const subscription = await Subscription.create({
      user: req.user._id,
      api: apiId,
      planName,
      status: 'active',
      apiKey,
    });

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/subscriptions ──────────────────────────────────────────
// ─── @access  Private
const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      user: req.user._id,
    })
      .populate('api', 'name category description provider latency uptime rating price priceType version')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/subscriptions/:id ───────────────────────────────────
// ─── @access  Private (subscriber only)
const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      res.status(404);
      throw new Error('Subscription not found');
    }

    // Auth check
    if (subscription.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to cancel this subscription');
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/subscriptions/check/:apiId ─────────────────────────────
// ─── @access  Private
const checkSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      api: req.params.apiId,
      status: 'active',
    });

    res.status(200).json({
      success: true,
      subscribed: !!subscription,
      subscription: subscription || null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  cancelSubscription,
  checkSubscription,
};
