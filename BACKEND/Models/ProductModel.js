const mongoose = require('mongoose');

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const paramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const endpointSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      required: true,
    },
    path: { type: String, required: true },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    params: [paramSchema],
    samplePayload: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const pricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    period: { type: String, default: '' },
    requests: { type: String, default: '' },
    features: [{ type: String }],
    cta: { type: String, default: 'Get Started' },
    popular: { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── Product (API Listing) Schema ─────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'API name is required'],
      trim: true,
      maxlength: [120, 'API name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    latency: {
      type: String,
      default: 'N/A',
    },
    uptime: {
      type: String,
      default: '99.9%',
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    price: {
      type: String,
      enum: {
        values: ['Free', 'Freemium', 'Paid'],
        message: 'Price must be Free, Freemium, or Paid',
      },
      default: 'Free',
    },
    // Provider display name (e.g. "StripeX Tech")
    provider: {
      type: String,
      trim: true,
      default: '',
    },
    version: {
      type: String,
      default: 'v1.0.0',
    },
    tags: [{ type: String, trim: true }],
    endpoints: [endpointSchema],
    pricingPlans: [pricingPlanSchema],
    // Reference to the User who published this API
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Soft-delete / visibility flag
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Text Index for full-text search on name & description ───────────────────
productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
