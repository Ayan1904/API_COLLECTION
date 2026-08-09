const Product = require('../Models/ProductModel');

// ─── Seed Data: 6 APIs from the frontend homepage ────────────────────────────
const SEED_APIS = [
  {
    name: 'Payment Gateway Pro',
    category: 'Finance',
    description:
      'Accept global payments, handle subscriptions, and manage fraud detection effortlessly.',
    latency: '45ms',
    uptime: '99.99%',
    rating: 4.9,
    reviewsCount: 342,
    price: 'Freemium',
    provider: 'StripeX Tech',
    version: 'v2.4.0',
    tags: ['PCI-DSS Certified', 'Global Payments', 'Webhooks', 'OAuth 2.0'],
    endpoints: [
      {
        method: 'POST',
        path: '/v2/charges',
        summary: 'Create a new charge',
        description:
          'Captures and processes a card charge given a valid token or customer ID.',
        params: [
          { name: 'amount', type: 'integer', required: true, description: 'Amount in smallest currency unit (e.g., 4999 = $49.99).' },
          { name: 'currency', type: 'string', required: true, description: 'Three-letter ISO currency code (e.g., usd, eur).' },
          { name: 'customer_id', type: 'string', required: false, description: 'Optional saved customer identifier.' },
        ],
        samplePayload: { amount: 4999, currency: 'usd', customer_id: 'cus_9982341' },
      },
      {
        method: 'GET',
        path: '/v2/customers/{id}',
        summary: 'Retrieve customer info',
        description: 'Returns customer details, attached payment methods, and current subscriptions.',
        params: [{ name: 'id', type: 'string', required: true, description: 'Unique identifier of the customer.' }],
        samplePayload: {},
      },
      {
        method: 'POST',
        path: '/v2/refunds',
        summary: 'Create a refund',
        description: 'Initiates a partial or full refund for a processed charge.',
        params: [
          { name: 'charge_id', type: 'string', required: true, description: 'Identifier of the charge being refunded.' },
          { name: 'amount', type: 'integer', required: false, description: 'Amount to refund. Omitting refunds full charge.' },
        ],
        samplePayload: { charge_id: 'ch_8829103', amount: 1500 },
      },
    ],
    pricingPlans: [
      { name: 'Free Tier', price: '$0', period: '/month', requests: '10,000 req/mo', features: ['Standard Latency (~80ms)', 'Community Support', 'Shared Rate Limit', '1 API Key'], cta: 'Start Free', popular: false },
      { name: 'Pro Developer', price: '$49', period: '/month', requests: '500,000 req/mo', features: ['Ultra-low Latency (~35ms)', '99.99% SLA Uptime', 'Dedicated Support (24/7)', 'Unlimited API Keys', 'Custom Webhooks'], cta: 'Subscribe Pro', popular: true },
      { name: 'Enterprise', price: 'Custom', period: '', requests: 'Unlimited req', features: ['Dedicated Edge Nodes', 'Custom SLA Guarantee', 'Dedicated Account Manager', 'Custom Billing & Invoicing'], cta: 'Contact Sales', popular: false },
    ],
  },
  {
    name: 'AI Vision & OCR',
    category: 'Machine Learning',
    description:
      'Extract text, detect objects, and analyze image contents in real-time with state-of-the-art AI.',
    latency: '120ms',
    uptime: '99.9%',
    rating: 4.8,
    reviewsCount: 215,
    price: 'Paid',
    provider: 'DeepVision Labs',
    version: 'v1.3.0',
    tags: ['OCR', 'Object Detection', 'Real-Time', 'REST API'],
    endpoints: [
      { method: 'POST', path: '/v1/vision/analyze', summary: 'Analyze an image', description: 'Detects objects, extracts text, and classifies scene.', params: [{ name: 'image_url', type: 'string', required: true, description: 'Publicly accessible URL to the image.' }], samplePayload: { image_url: 'https://example.com/photo.jpg' } },
      { method: 'POST', path: '/v1/ocr/extract', summary: 'Extract text from image', description: 'Runs OCR engine and returns structured text blocks.', params: [{ name: 'image_url', type: 'string', required: true, description: 'URL of the image to process.' }, { name: 'language', type: 'string', required: false, description: 'Language hint (ISO 639-1 code, default: en).' }], samplePayload: { image_url: 'https://example.com/doc.png', language: 'en' } },
    ],
    pricingPlans: [
      { name: 'Starter', price: '$29', period: '/month', requests: '50,000 req/mo', features: ['Standard Processing', 'Email Support', '2 API Keys'], cta: 'Get Started', popular: false },
      { name: 'Business', price: '$99', period: '/month', requests: '500,000 req/mo', features: ['Priority Processing', '24/7 Support', 'Unlimited Keys', 'Batch Processing'], cta: 'Upgrade to Business', popular: true },
    ],
  },
  {
    name: 'GeoLocation Sync',
    category: 'Mapping & Data',
    description:
      'High-precision IP geolocation, reverse geocoding, and timezone identification.',
    latency: '25ms',
    uptime: '100%',
    rating: 4.7,
    reviewsCount: 89,
    price: 'Free',
    provider: 'GeoNet Inc.',
    version: 'v3.1.0',
    tags: ['Geolocation', 'IP Lookup', 'Timezone', 'Reverse Geocoding'],
    endpoints: [
      { method: 'GET', path: '/v3/ip/{ip}', summary: 'Lookup IP location', description: 'Returns country, city, region, lat/lon, and timezone for an IP.', params: [{ name: 'ip', type: 'string', required: true, description: 'IPv4 or IPv6 address to look up.' }], samplePayload: {} },
      { method: 'GET', path: '/v3/reverse', summary: 'Reverse geocode coordinates', description: 'Converts latitude and longitude to human-readable address.', params: [{ name: 'lat', type: 'number', required: true, description: 'Latitude.' }, { name: 'lon', type: 'number', required: true, description: 'Longitude.' }], samplePayload: {} },
    ],
    pricingPlans: [
      { name: 'Free', price: '$0', period: '/month', requests: '10,000 req/mo', features: ['Basic Lookup', 'Community Support'], cta: 'Start Free', popular: false },
      { name: 'Pro', price: '$19', period: '/month', requests: '500,000 req/mo', features: ['High-Accuracy Data', 'Batch Lookup', 'Priority Support'], cta: 'Go Pro', popular: true },
    ],
  },
  {
    name: 'User Auth & Identity',
    category: 'Security',
    description:
      'Zero-trust auth solution supporting OAuth2, SAML, WebAuthn, and biometric sign-ins.',
    latency: '35ms',
    uptime: '99.95%',
    rating: 4.9,
    reviewsCount: 401,
    price: 'Freemium',
    provider: 'AuthCore Systems',
    version: 'v4.0.2',
    tags: ['OAuth2', 'SAML', 'WebAuthn', 'Zero-Trust'],
    endpoints: [
      { method: 'POST', path: '/v4/auth/token', summary: 'Issue access token', description: 'Validates credentials and returns a signed OAuth2 access token.', params: [{ name: 'client_id', type: 'string', required: true, description: 'Application client ID.' }, { name: 'client_secret', type: 'string', required: true, description: 'Application client secret.' }, { name: 'grant_type', type: 'string', required: true, description: 'OAuth2 grant type (e.g., client_credentials).' }], samplePayload: { client_id: 'app_123', client_secret: 'secret_xyz', grant_type: 'client_credentials' } },
      { method: 'GET', path: '/v4/auth/userinfo', summary: 'Get user info', description: 'Returns profile claims for the authenticated token.', params: [], samplePayload: {} },
    ],
    pricingPlans: [
      { name: 'Free', price: '$0', period: '/month', requests: '5,000 MAU', features: ['OAuth2 Basic', 'Community Support'], cta: 'Start Free', popular: false },
      { name: 'Growth', price: '$79', period: '/month', requests: '100,000 MAU', features: ['All Auth Methods', 'MFA', 'SAML SSO', '24/7 Support'], cta: 'Choose Growth', popular: true },
    ],
  },
  {
    name: 'Smart Weather & Climate',
    category: 'Data & Analytics',
    description:
      'Historical, current, and forecasted weather metrics tailored for enterprise scale.',
    latency: '50ms',
    uptime: '99.8%',
    rating: 4.6,
    reviewsCount: 134,
    price: 'Free',
    provider: 'ClimaCloud',
    version: 'v2.0.0',
    tags: ['Weather', 'Forecast', 'Climate Data', 'Enterprise'],
    endpoints: [
      { method: 'GET', path: '/v2/current', summary: 'Get current weather', description: 'Returns current conditions for a given lat/lon.', params: [{ name: 'lat', type: 'number', required: true, description: 'Latitude.' }, { name: 'lon', type: 'number', required: true, description: 'Longitude.' }, { name: 'units', type: 'string', required: false, description: 'metric | imperial | kelvin' }], samplePayload: {} },
      { method: 'GET', path: '/v2/forecast', summary: '7-day forecast', description: 'Returns hourly forecast data for the next 7 days.', params: [{ name: 'lat', type: 'number', required: true, description: 'Latitude.' }, { name: 'lon', type: 'number', required: true, description: 'Longitude.' }], samplePayload: {} },
    ],
    pricingPlans: [
      { name: 'Free', price: '$0', period: '/month', requests: '10,000 req/mo', features: ['Current & Forecast', 'Community Support'], cta: 'Start Free', popular: false },
      { name: 'Enterprise', price: 'Custom', period: '', requests: 'Unlimited', features: ['Historical Data', 'Dedicated Nodes', 'SLA Guarantee'], cta: 'Contact Sales', popular: false },
    ],
  },
  {
    name: 'OmniChannel SMS & Push',
    category: 'Communication',
    description:
      'Send transactional SMS, email notifications, and app push alerts across 180+ countries.',
    latency: '80ms',
    uptime: '99.9%',
    rating: 4.8,
    reviewsCount: 278,
    price: 'Paid',
    provider: 'OmniComm Inc.',
    version: 'v1.8.3',
    tags: ['SMS', 'Push Notifications', 'Email', '180+ Countries'],
    endpoints: [
      { method: 'POST', path: '/v1/sms/send', summary: 'Send SMS', description: 'Delivers a transactional SMS to a phone number.', params: [{ name: 'to', type: 'string', required: true, description: 'E.164 format phone number.' }, { name: 'message', type: 'string', required: true, description: 'Text content (max 160 chars).' }, { name: 'from', type: 'string', required: false, description: 'Sender ID or phone number.' }], samplePayload: { to: '+14155552671', message: 'Your OTP is 482910', from: 'APIHub' } },
      { method: 'POST', path: '/v1/push/send', summary: 'Send push notification', description: 'Broadcasts a push notification to a device or topic.', params: [{ name: 'device_token', type: 'string', required: true, description: 'FCM/APNS device token.' }, { name: 'title', type: 'string', required: true, description: 'Notification title.' }, { name: 'body', type: 'string', required: true, description: 'Notification body text.' }], samplePayload: { device_token: 'fcm_tok_abc123', title: 'New Message', body: 'You have a new notification.' } },
    ],
    pricingPlans: [
      { name: 'Starter', price: '$39', period: '/month', requests: '10,000 msg/mo', features: ['SMS & Push', 'Email Support', '1 Sender ID'], cta: 'Get Started', popular: false },
      { name: 'Scale', price: '$149', period: '/month', requests: '250,000 msg/mo', features: ['All Channels', 'Priority Routing', 'Dedicated Support', 'Custom Sender IDs'], cta: 'Choose Scale', popular: true },
    ],
  },
];

// ─── Helper: Seed the database with initial API listings ─────────────────────
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(SEED_APIS);
      console.log('🌱 Database seeded with 6 default API listings');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

// ─── @route   GET /api/products ───────────────────────────────────────────────
// ─── @access  Public
// ─── @query   search, category, price, page, limit
const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, price, page = 1, limit = 20 } = req.query;

    // Build query filter
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (price) {
      filter.price = price;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ rating: -1, createdAt: -1 })
        .populate('createdBy', 'fullName email company'),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/products/categories ───────────────────────────────────
// ─── @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.status(200).json({ success: true, categories: ['All', ...categories.sort()] });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/products/:id ──────────────────────────────────────────
// ─── @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate('createdBy', 'fullName email company');

    if (!product) {
      res.status(404);
      throw new Error('API listing not found');
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/products ─────────────────────────────────────────────
// ─── @access  Private — provider role only
const createProduct = async (req, res, next) => {
  try {
    const {
      name, category, description, latency, uptime,
      price, provider, version, tags, endpoints, pricingPlans,
    } = req.body;

    if (!name || !category || !description) {
      res.status(400);
      throw new Error('Name, category, and description are required');
    }

    const product = await Product.create({
      name,
      category,
      description,
      latency: latency || 'N/A',
      uptime: uptime || '99.9%',
      price: price || 'Free',
      provider: provider || req.user.fullName,
      version: version || 'v1.0.0',
      tags: tags || [],
      endpoints: endpoints || [],
      pricingPlans: pricingPlans || [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'API listing published successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/products/:id ──────────────────────────────────────────
// ─── @access  Private — owner only
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('API listing not found');
    }

    // Ensure the requesting user owns this listing
    if (product.createdBy && product.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized — you do not own this listing');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'API listing updated',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/products/:id ───────────────────────────────────────
// ─── @access  Private — owner only
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('API listing not found');
    }

    if (product.createdBy && product.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized — you do not own this listing');
    }

    // Soft-delete: mark inactive instead of removing the document
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'API listing removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/products/my-listings ──────────────────────────────────
// ─── @access  Private — provider only (or any user who has created listings)
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getMyProducts,
  seedProducts,
};
