import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios from 'axios';

// === MATERIAL UI IMPORTS ===
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';

const apiBase = process.env.REACT_APP_API_URL;

const schema = yup.object({
  type: yup.string().required('Transaction type is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  description: yup.string(),
  date: yup.date().required('Date is required'),
});

const TransactionForm = ({ currency, token }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [categories] = useState({
    income: ['salary', 'freelance', 'investment', 'bonus', 'other'],
    expense: ['food', 'transport', 'entertainment', 'healthcare', 'education', 'shopping', 'utilities', 'other']
  });

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      currency: currency,
      date: new Date().toISOString().split('T')[0]
    }
  });

  const transactionType = watch('type');

  const createTransactionMutation = useMutation(
    (data) => axios.post(`${apiBase}/api/transactions`, { ...data, currency }, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions');
        toast.success(t('transaction_added'));
        reset({ type: 'expense', currency: currency, date: new Date().toISOString().split('T')[0] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || t('failed_add_transaction'));
      }
    }
  );

  const onSubmit = (data) => {
    createTransactionMutation.mutate({ ...data, currency });
  };

  return (
    <Box sx={{ maxWidth: 520, m: '36px auto', px: 2 }}>
      <h1 style={{ marginBottom: 20 }}>{t('add_transaction')}</h1>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>

            <TextField
              label={t('type')}
              select
              fullWidth
              defaultValue="expense"
              {...register('type')}
              error={!!errors.type}
              helperText={errors.type ? t('type') + ": " + errors.type.message : ""}
            >
              <MenuItem value="expense">{t('expense')}</MenuItem>
              <MenuItem value="income">{t('income')}</MenuItem>
              <MenuItem value="transfer">{t('transfer')}</MenuItem>
            </TextField>

            <TextField
              label={`${t('amount')} (${currency})`}
              type="number"
              step="0.01"
              fullWidth
              {...register('amount')}
              error={!!errors.amount}
              helperText={errors.amount ? t('amount') + ": " + errors.amount.message : ""}
              inputProps={{ min: "0", inputMode: "decimal" }}
            />

            <TextField
              label={t('category')}
              select
              fullWidth
              defaultValue=""
              {...register('category')}
              error={!!errors.category}
              helperText={errors.category ? t('category') + ": " + errors.category.message : ""}
            >
              <MenuItem value="">{t('category')}</MenuItem>
              {categories[transactionType]?.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label={t('date')}
              type="date"
              fullWidth
              {...register('date')}
              error={!!errors.date}
              helperText={errors.date ? t('date') + ": " + errors.date.message : ""}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            label={t('description')}
            multiline
            rows={2}
            fullWidth
            {...register('description')}
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('select_currency')}
            select
            fullWidth
            value={currency}
            disabled
            sx={{ mb: 3 }}
          >
            <MenuItem value="INR">INR (₹)</MenuItem>
            <MenuItem value="USD">USD ($)</MenuItem>
            <MenuItem value="EUR">EUR (€)</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={createTransactionMutation.isLoading ? <CircularProgress color="inherit" size={20} /> : <AddIcon />}
            fullWidth
            size="large"
            disabled={createTransactionMutation.isLoading}
            sx={{ mb: 0.5, fontWeight: 600 }}
          >
            {t('add_transaction')}
          </Button>
        </form>
      </Paper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        theme="colored"
      />
    </Box>
  );
};

export default TransactionForm;
