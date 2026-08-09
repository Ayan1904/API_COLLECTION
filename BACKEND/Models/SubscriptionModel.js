const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    api: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
