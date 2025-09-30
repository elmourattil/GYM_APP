const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const trainerRoutes = require('./routes/trainers');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const reviewRoutes = require('./routes/reviews');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CORS_ORIGIN].filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gym Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files only if explicitly enabled AND client build exists
if (process.env.SERVE_CLIENT === 'true') {
  const clientDir = path.join(__dirname, '../frontend/dist');
  const indexFile = path.join(clientDir, 'index.html');
  if (fs.existsSync(clientDir) && fs.existsSync(indexFile)) {
    app.use(express.static(clientDir));
    app.get('*', (req, res) => {
      res.sendFile(indexFile);
    });
  }
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;
