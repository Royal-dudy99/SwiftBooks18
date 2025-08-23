import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceWallet';
import CircularProgress from '@mui/material/CircularProgress';

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

  const handleExportCsv = () => {
    if (!transactions.length) {
      alert(t('no_transactions'));
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
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">{t('loading_data')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, m: '0 auto', p: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <div style={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            📊 {t('analytics')}
          </Typography>
          <Typography variant="subtitle1">
            {t('welcome_user', { name: user?.name })}
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudDownloadIcon />}
          onClick={handleExportCsv}
        >
          {t('export_csv')}
        </Button>
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
    </Box>
  );
};

export default Analytics;
