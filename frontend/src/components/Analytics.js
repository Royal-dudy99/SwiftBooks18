import React, { useState, useEffect } from 'react';

const apiBase = process.env.REACT_APP_API_URL;

// Helper to convert array of objects to CSV string
function arrayToCsv(items) {
  if (!items.length) return '';
  const header = Object.keys(items[0]).join(',');
  const rows = items.map(row =>
    Object.values(row)
      .map(val => `"${typeof val === 'string' ? val.replace(/"/g, '""') : val}"`)
      .join(',')
  );
  return [header, ...rows].join('\r\n');
}

function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

const Analytics = ({ user, token, currency }) => {
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
          headers: { 'Authorization': `Bearer ${token}` }
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
    if (token) fetchTransactions();
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

  // Dynamic currency formatting
  const formatCurrency = (amount) => {
    if (currency === "USD") return `$${amount.toLocaleString('en-US')}`;
    if (currency === "EUR") return `€${amount.toLocaleString('en-EU')}`;
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

  // Export to CSV logic
  const handleExportCsv = () => {
    if (!transactions.length) {
      alert('No transactions to export!');
      return;
    }
    const toExport = transactions.map(({ id, userId, ...rest }) => ({
      ...rest,
      date: formatDate(rest.date),
    }));
    const csv = arrayToCsv(toExport);
    downloadCsv(csv, 'swiftbooks_transactions.csv');
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
        <h1>📊 Analytics</h1>
        <p>Hello {user?.name}, here's your financial overview</p>
        <button className="cta-btn" onClick={handleExportCsv} style={{ float:"right", marginTop: "-45px" }}>
          Export as CSV
        </button>
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
      {/* You can add chart components below, passing currency if needed */}
      {/* <YourPieChart data={} currency={currency} /> */}
      {/* <YourBarChart data={} currency={currency} /> */}
    </div>
  );
};

export default Analytics;
