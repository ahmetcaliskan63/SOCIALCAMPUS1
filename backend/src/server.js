const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoutes');
const messageRoutes = require('../routes/messageRoutes');
const bookRoutes = require('../routes/bookRoutes');
const trendRoutes = require('../routes/trendRoutes');

// Load environment variables
dotenv.config();

const app = express();

// CORS ayarları
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/trends', trendRoutes);

// Test endpoint'i
app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 