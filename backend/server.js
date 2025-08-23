const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (simulating database)
let users = [];
let userTransactions = {}; // Object to store transactions by user ID

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'swiftbooks_secret_key_2025';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// AUTH ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    userTransactions[user.id] = []; // Initialize empty transactions for new user

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// TRANSACTION ROUTES (Protected)

// Get user's transactions
app.get('/api/transactions', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const transactions = userTransactions[userId] || [];
  res.json(transactions);
});

// Add new transaction
app.post('/api/transactions', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { type, amount, category, description, account } = req.body;

    // Validate input
    if (!type || !amount || !category) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newTransaction = {
      id: Date.now(),
      userId,
      type,
      amount: parseFloat(amount),
      category: category || 'Other',
      description: description || '',
      account: account || 'Cash',
      date: new Date().toISOString()
    };

    // Initialize user transactions if not exists
    if (!userTransactions[userId]) {
      userTransactions[userId] = [];
    }

    userTransactions[userId].push(newTransaction);
    
    console.log(`Transaction added for user ${userId}:`, newTransaction);
    
    res.json({ success: true, transaction: newTransaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update transaction
app.put('/api/transactions/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);
    
    if (!userTransactions[userId]) {
      return res.status(404).json({ success: false, error: 'No transactions found' });
    }

    const index = userTransactions[userId].findIndex(t => t.id === transactionId);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    userTransactions[userId][index] = { 
      ...userTransactions[userId][index], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, transaction: userTransactions[userId][index] });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);
    
    if (!userTransactions[userId]) {
      return res.status(404).json({ success: false, error: 'No transactions found' });
    }

    const index = userTransactions[userId].findIndex(t => t.id === transactionId);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    userTransactions[userId].splice(index, 1);
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  
  res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

app.listen(PORT, () => {
  console.log(`SwiftBooks Server running on port ${PORT}`);
  console.log('Authentication system ready!');
});
