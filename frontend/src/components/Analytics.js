
import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const apiBase = process.env.REACT_APP_API_URL;

const Analytics = ({ currency }) => {
  const { data: transactions, isLoading } = useQuery(
    'transactions',
    () => axios.get('${apiBase}/api/transactions').then(res => res.data)
  );

  const getCategoryData = (transactions) => {
    if (!transactions) return { labels: [], datasets: [] };

    const totals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      });

    return {
      labels: Object.keys(totals),
      datasets: [
        {
          data: Object.values(totals),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }
      ]
    };
  };

  const getMonthlyData = (transactions) => {
    if (!transactions) return { labels: [], datasets: [] };

    const months = {};
    transactions.forEach(t => {
      const m = new Date(t.date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      months[m][t.type === 'income' ? 'income' : 'expense'] += t.amount;
    });

    const labels = Object.keys(months).sort((a, b) => new Date(a) - new Date(b));

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: labels.map(l => months[l].income),
          backgroundColor: '#4BC0C0'
        },
        {
          label: 'Expense',
          data: labels.map(l => months[l].expense),
          backgroundColor: '#FF6384'
        }
      ]
    };
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h1>📊 Analytics</h1>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Expenses by Category</h3>
          <div style={{ height: '300px' }}>
            <Pie
              data={getCategoryData(transactions)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
          </div>
        </div>

        <div className="analytics-card">
          <h3>Monthly Income vs Expense</h3>
          <div style={{ height: '300px' }}>
            <Bar
              data={getMonthlyData(transactions)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
