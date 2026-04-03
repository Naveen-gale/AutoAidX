require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.route');
const brandRoutes = require('./routes/brand.route');
const modelRoutes = require('./routes/model.route');
const problemRoutes = require('./routes/problem.route');
const aiRoutes = require('./routes/ai.route');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // frontend + admin panel
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/admin', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AutoAidX Backend is running 🚗' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
