import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      const data = await response.json();
      setTransactions(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

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
    const description = prompt('Enter description:');
    
    if (!amount || isNaN(amount)) return;

    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category: type === 'income' ? 'Other Income' : 'Other Expense',
          description,
          account: 'Cash'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchTransactions(); // Refresh data
        alert('Transaction added successfully!');
      } else {
        alert('Failed to add transaction!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding transaction!');
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
      'Salary': '💰',
      'Other Income': '💵',
      'Other Expense': '💸'
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
      month: 'short'
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>💰 SwiftBooks</h1>
        <p>Your Smart Money Manager</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card income-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Total Income</h3>
            <div className="amount income">{formatCurrency(stats.totalIncome)}</div>
          </div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-icon">📉</div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <div className="amount expense">{formatCurrency(stats.totalExpenses)}</div>
          </div>
        </div>

        <div className="stat-card balance-card">
          <div className="stat-icon">💳</div>
          <div className="stat-info">
            <h3>Balance</h3>
            <div className={`amount ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(stats.balance)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-btn income-btn"
          onClick={() => addQuickTransaction('income')}
        >
          <span>➕</span>
          Add Income
        </button>
        <button 
          className="action-btn expense-btn"
          onClick={() => addQuickTransaction('expense')}
        >
          <span>➖</span>
          Add Expense
        </button>
        <button className="action-btn transfer-btn">
          <span>🔄</span>
          Transfer
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="section-header">
          <h2>Recent Transactions</h2>
          <span className="transaction-count">{transactions.length} total</span>
        </div>

        <div className="transaction-list">
          {transactions.slice(-10).reverse().map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className={`transaction-icon ${transaction.type}`}>
                {getCategoryIcon(transaction.category)}
              </div>
              <div className="transaction-details">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-meta">
                  <span className="transaction-category">{transaction.category}</span>
                  <span className="transaction-date">{formatDate(transaction.date)}</span>
                </div>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
