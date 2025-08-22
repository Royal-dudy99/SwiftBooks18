import React from 'react';
import { useQuery } from 'react-query';
// import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
);

const Analytics = ({ currency }) => {
  const { data: transactions, isLoading } = useQuery(
    'transactions',
    () => axios.get('/api/transactions').then(res => res.data)
  );

  const getCategoryData = () => {
    if (!transactions) return { labels: [], datasets: [] };

    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
      }]
    };
  };

  const getMonthlyData = () => {
    if (!transactions) return { labels: [], datasets: [] };

    const monthlyData = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      monthlyData[month][t.type === 'income' ? 'income' : 'expenses'] += t.amount;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Income',
          data: sortedMonths.map(month => monthlyData[month].income),
          backgroundColor: '#4BC0C0',
          borderColor: '#4BC0C0',
        },
        {
          label: 'Expenses',
          data: sortedMonths.map(month => monthlyData[month].expenses),
          backgroundColor: '#FF6384',
          borderColor: '#FF6384',
        }
      ]
    };
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <h1>Analytics</h1>
      
      <div className="grid grid-2">
        <div className="card">
          <h3>Expenses by Category</h3>
          <div style={{ height: '300px' }}>
            <Pie
              data={getCategoryData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3>Monthly Trends</h3>
          <div style={{ height: '300px' }}>
            <Bar
              data={getMonthlyData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

