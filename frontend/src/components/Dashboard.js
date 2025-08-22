import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = ({ currency }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0
  });

  const { data: transactions, isLoading } = useQuery(
    'transactions',
    () => axios.get('/api/transactions').then(res => res.data),
    {
      onSuccess: (data) => {
        calculateSummary(data);
      }
    }
  );

  const calculateSummary = (transactions) => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setSummary({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      transactionCount: transactions.length
    });
  };

  const formatCurrency = (amount) => {
    const symbols = { INR: '₹', USD: '$', EUR: '€' };
    return `${symbols[currency] || '₹'}${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title">Dashboard</h1>
      
      <div className="grid grid-3">
        <div className="card">
          <div className="summary-card">
            <i className="fas fa-arrow-up text-success"></i>
            <div>
              <h3>Total Income</h3>
              <p className="amount text-success">{formatCurrency(summary.totalIncome)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="summary-card">
            <i className="fas fa-arrow-down text-danger"></i>
            <div>
              <h3>Total Expenses</h3>
              <p className="amount text-danger">{formatCurrency(summary.totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="summary-card">
            <i className="fas fa-wallet"></i>
            <div>
              <h3>Balance</h3>
              <p className={`amount ${summary.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Recent Transactions</h3>
          <div className="transaction-list">
            {transactions?.slice(0, 5).map(transaction => (
              <div key={transaction._id} className="transaction-item">
                <div>
                  <strong>{transaction.category}</strong>
                  <p>{transaction.description}</p>
                </div>
                <div className={`amount ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Add Income
            </button>
            <button className="btn btn-danger">
              <i className="fas fa-minus"></i>
              Add Expense
            </button>
            <button className="btn btn-secondary">
              <i className="fas fa-exchange-alt"></i>
              Transfer
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

