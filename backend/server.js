const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (instead of MongoDB)
let transactions = [
  {
    id: 1,
    type: 'expense',
    amount: 250,
    category: 'Food',
    description: 'Lunch at cafe',
    date: new Date('2025-08-22').toISOString(),
    account: 'Cash'
  },
  {
    id: 2,
    type: 'income',
    amount: 5000,
    category: 'Salary',
    description: 'Monthly salary',
    date: new Date('2025-08-20').toISOString(),
    account: 'Bank'
  },
  {
    id: 3,
    type: 'expense',
    amount: 100,
    category: 'Transport',
    description: 'Bus fare',
    date: new Date('2025-08-21').toISOString(),
    account: 'Cash'
  }
];

// Get all transactions
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// Add new transaction
app.post('/api/transactions', (req, res) => {
  try {
    const { type, amount, category, description, account } = req.body;
    
    const newTransaction = {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      category: category || 'Other',
      description: description || '',
      account: account || 'Cash',
      date: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    console.log('New transaction added:', newTransaction);
    
    res.json({ success: true, transaction: newTransaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get transaction by ID
app.get('/api/transactions/:id', (req, res) => {
  const transaction = transactions.find(t => t.id === parseInt(req.params.id));
  if (!transaction) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }
  res.json(transaction);
});

// Update transaction
app.put('/api/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }
  
  transactions[index] = { ...transactions[index], ...req.body };
  res.json({ success: true, transaction: transactions[index] });
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }
  
  transactions.splice(index, 1);
  res.json({ success: true, message: 'Transaction deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
