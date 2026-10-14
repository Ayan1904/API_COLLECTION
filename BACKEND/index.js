const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars first — must be before any module that reads process.env
dotenv.config();

const connectDB = require('./Config/db');
const { seedProducts } = require('./Controllers/ProductController');
const userRoutes = require('./Routers/UserRouter');
const productRoutes = require('./Routers/ProductRouter');
const subscriptionRoutes = require('./Routers/SubscriptionRouter');
const { notFound, errorHandler } = require('./Middleware/errorMiddleware');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB().then(seedProducts); // seed default API listings after DB connects

// ─── Initialize Express ───────────────────────────────────────────────────────
const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Next.js frontend dev server
      'http://localhost:3001',
      'https://api-collection-psi.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 APIHub Backend is running',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      subscriptions: '/api/subscriptions',
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// ─── Error Handling (must be last) ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 APIHub server running on http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`);
});
