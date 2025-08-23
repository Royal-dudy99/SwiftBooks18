import React, { useState, useEffect } from 'react';
const apiBase = process.env.REACT_APP_API_URL;


const Dashboard = ({ user, token }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBase}/api/transactions`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});


        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
          calculateStats(data);
        } else {
          console.error('Failed to fetch transactions');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const calculateStats = (transactions) => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setStats({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    });
  };

  const addQuickTransaction = async (type) => {
    const amount = prompt(`Enter ${type} amount:`);
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const description = prompt('Enter description:') || `Quick ${type}`;
    const category = prompt('Enter category:') || (type === 'income' ? 'Other Income' : 'Other Expense');

    try {
      const response = await fetch(`${apiBase}/api/transactions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type,
    amount: parseFloat(amount),
    category,
    description,
    account: 'Cash'
  }),
});


      const result = await response.json();
      
      if (result.success) {
        // Add new transaction to state immediately
        const newTransactions = [...transactions, result.transaction];
        setTransactions(newTransactions);
        calculateStats(newTransactions);
        alert('✅ Transaction added successfully!');
      } else {
        alert('❌ Failed to add transaction: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Network error. Please check your connection.');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍕',
      'Transport': '🚗',
      'Shopping': '🛒',
      'Entertainment': '🎬',
      'Health': '🏥',
      'Education': '📚',
      'Bills': '💡',
      'Salary': '💰',
      'Business': '💼',
      'Investment': '📈',
      'Other Income': '💵',
      'Other Expense': '💸',
      'Other': '📝'
    };
    return icons[category] || '📝';
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>💰 Dashboard</h1>
        <p>Hello {user?.name}, here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card income-card">
          <div className="stat-icon income-icon">📈</div>
          <div className="stat-info">
            <h3>Total Income</h3>
            <div className="amount income">{formatCurrency(stats.totalIncome)}</div>
            <p className="stat-subtitle">This month</p>
          </div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-icon expense-icon">📉</div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <div className="amount expense">{formatCurrency(stats.totalExpenses)}</div>
            <p className="stat-subtitle">This month</p>
          </div>
        </div>

        <div className="stat-card balance-card">
          <div className="stat-icon balance-icon">💳</div>
          <div className="stat-info">
            <h3>Balance</h3>
            <div className={`amount ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className="stat-subtitle">Available</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-btn income-btn"
          onClick={() => addQuickTransaction('income')}
        >
          <span className="btn-icon">💰</span>
          <div className="btn-content">
            <span className="btn-title">Add Income</span>
            <span className="btn-subtitle">Record money received</span>
          </div>
        </button>
        
        <button 
          className="action-btn expense-btn"
          onClick={() => addQuickTransaction('expense')}
        >
          <span className="btn-icon">💸</span>
          <div className="btn-content">
            <span className="btn-title">Add Expense</span>
            <span className="btn-subtitle">Record money spent</span>
          </div>
        </button>
        
        <button className="action-btn transfer-btn">
          <span className="btn-icon">🔄</span>
          <div className="btn-content">
            <span className="btn-title">Transfer</span>
            <span className="btn-subtitle">Between accounts</span>
          </div>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="section-header">
          <h2>Recent Transactions</h2>
          <div className="transaction-stats">
            <span className="transaction-count">{transactions.length} total</span>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No transactions yet</h3>
            <p>Start by adding your first income or expense!</p>
            <button 
              className="cta-btn"
              onClick={() => addQuickTransaction('expense')}
            >
              Add Your First Transaction
            </button>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.slice(-10).reverse().map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className={`transaction-icon ${transaction.type}`}>
                  {getCategoryIcon(transaction.category)}
                </div>
                <div className="transaction-details">
                  <div className="transaction-description">
                    {transaction.description || 'No description'}
                  </div>
                  <div className="transaction-meta">
                    <span className="transaction-category">{transaction.category}</span>
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                    <span className="transaction-account">{transaction.account}</span>
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
