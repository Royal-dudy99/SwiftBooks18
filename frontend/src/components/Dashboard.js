import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceWallet';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';

const apiBase = process.env.REACT_APP_API_URL;

const Dashboard = ({ user, token, currency }) => {
  const { t } = useTranslation();
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
          console.error(t('failed_fetch'));
        }
      } catch (error) {
        console.error(t('network_error'));
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTransactions();
  }, [token, t]);

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
    const amount = prompt(`${t('amount')}:`);
    if (!amount || isNaN(amount) || amount <= 0) {
      alert(t('error') + ': ' + t('amount'));
      return;
    }
    const description = prompt(t('description')) || `${t('add_transaction')} ${type}`;
    const category = prompt(t('category')) || (type === 'income' ? t('income') : t('expense'));
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
        const newTransactions = [...transactions, result.transaction];
        setTransactions(newTransactions);
        calculateStats(newTransactions);
        alert(t('transaction_added'));
      } else {
        alert(t('failed_add_transaction') + ': ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(t('network_error'));
      alert('❌ ' + t('network_error'));
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

  if (loading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">{t('loading_data')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, m: '0 auto', p: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          💰 {t('dashboard')}
        </Typography>
        <Typography variant="subtitle1">
          {t('welcome_user', { name: user?.name })}
        </Typography>
      </Box> 

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #3bb77e' }}>
            <CardContent>
              <Chip icon={<TrendingUpIcon />} color="success" label={t('total_income')} />
              <Typography mt={1} variant="h5" color="success.main" fontWeight={800}>
                {formatCurrency(stats.totalIncome)}
              </Typography>
              <Typography variant="body2" color="text.secondary">{t('this_month')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #d32f2f' }}>
            <CardContent>
              <Chip icon={<TrendingDownIcon />} color="error" label={t('total_expenses')} />
              <Typography mt={1} variant="h5" color="error.main" fontWeight={800}>
                {formatCurrency(stats.totalExpenses)}
              </Typography>
              <Typography variant="body2" color="text.secondary">{t('this_month')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #497ce2' }}>
            <CardContent>
              <Chip icon={<AccountBalanceIcon />} color="primary" label={t('balance')} />
              <Typography mt={1} variant="h5" color={stats.balance >= 0 ? "success.main" : "error.main"} fontWeight={800}>
                {formatCurrency(stats.balance)}
              </Typography>
              <Typography variant="body2" color="text.secondary">{t('available')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          color="success"
          startIcon={<TrendingUpIcon />}
          onClick={() => addQuickTransaction('income')}
        >
          {t('add_income')}
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<TrendingDownIcon />}
          onClick={() => addQuickTransaction('expense')}
        >
          {t('add_expense')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AutorenewIcon />}
          onClick={() => alert(t('feature_coming_soon'))}
        >
          {t('transfer')}
        </Button>
      </Paper>

      {/* Recent Transactions */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('recent_transactions')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {transactions.length} {t('total')}
        </Typography>
      </Box>
      {transactions.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 4, border: '1px dashed #497ce2', mb: 5 }}>
          <Typography variant="h5" fontWeight={600} color="primary">
            {t('no_transactions')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{t('start_adding')}</Typography>
          <Button variant="contained" onClick={() => addQuickTransaction('expense')} startIcon={<AddIcon />}>
            {t('add_first_transaction')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {transactions.slice(-10).reverse().map((transaction) => (
            <Grid item xs={12} key={transaction.id}>
              <Card sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ fontSize: 34 }}>{getCategoryIcon(transaction.category)}</Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={600}>
                    {transaction.description || t('description')}
                  </Typography>
                  <Typography fontSize={14} color="text.secondary">
                    {transaction.category} • {formatDate(transaction.date)} • {transaction.account}
                  </Typography>
                </Box>
                <Typography fontWeight={700} fontSize={18} color={transaction.type === "income" ? "success.main" : "error.main"}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
