const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load env variables
dotenv.config();

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const queryRoutes = require('./routes/queryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRouter');
const collectionRoutes = require('./routes/collectionRoutes'); // ✅ Collection route added
const couponRoutes = require('./routes/couponRoutes'); // ✅ Coupon route added
const testEmailRoute = require('./routes/testEmail'); // ✅ Email test
const pingRoute = require('./routes/pingRoute'); // ✅ Ping route added

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('🚀 Count88 API is running...');
});

// DB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/collections', collectionRoutes); // ✅ Collections API registered
app.use('/api/coupons', couponRoutes); // ✅ Coupons API registered
app.use('/api', testEmailRoute);
app.use('/api/ping', pingRoute); // ✅ Ping route registered

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
