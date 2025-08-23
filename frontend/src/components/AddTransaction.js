import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
const apiBase = process.env.REACT_APP_API_URL;

const schema = yup.object({
  type: yup.string().required('Transaction type is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  description: yup.string(),
  date: yup.date().required('Date is required'),
});

const TransactionForm = ({ currency, token }) => {
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
        toast.success('✅ Transaction added successfully!');
        reset({ type: 'expense', currency: currency, date: new Date().toISOString().split('T')[0] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '❌ Failed to add transaction');
      }
    }
  );

  const onSubmit = (data) => {
    createTransactionMutation.mutate({ ...data, currency });
  };

  return (
    <div className="transaction-form">
      <h1>Add Transaction</h1>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-2">

            <div className="form-group">
              <label className="form-label">Type</label>
              <select {...register('type')} className="form-input">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
              {errors.type && <span className="error">{errors.type.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Amount ({currency})</label>
              <input
                type="number"
                step="0.01"
                {...register('amount')}
                className="form-input"
                placeholder="0.00"
              />
              {errors.amount && <span className="error">{errors.amount.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select {...register('category')} className="form-input">
                <option value="">Select category</option>
                {categories[transactionType]?.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              {errors.category && <span className="error">{errors.category.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                {...register('date')}
                className="form-input"
              />
              {errors.date && <span className="error">{errors.date.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              {...register('description')}
              className="form-input"
              rows="3"
              placeholder="Optional description..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-input" value={currency} disabled>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={createTransactionMutation.isLoading}
          >
            {createTransactionMutation.isLoading ? (
              <>
                <div className="spinner"></div>
                Adding...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                Add Transaction
              </>
            )}
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
      />
    </div>
  );
};

export default TransactionForm;
