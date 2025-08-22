const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Routes
const transactionRoutes = require('./routes/transactions.js');
const authRoutes = require('./routes/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());


let transactions = [
  {
    id: 1,
    type: 'expense',
    amount: 500,
    category: 'Food',
    description: 'Lunch',
    date: new Date().toISOString()
  }
];

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.netlify.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Database connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swiftbooks', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:',
//  err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);


app.post('/api/transactions', (req, res) => {
  const { type, amount, category, description } = req.body;
  
  const newTransaction = {
    id: Date.now(),
    type,
    amount: parseFloat(amount),
    category,
    description,
    date: new Date().toISOString()
  };
  
  transactions.push(newTransaction);
  res.json({ success: true, transaction: newTransaction });
});



// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

