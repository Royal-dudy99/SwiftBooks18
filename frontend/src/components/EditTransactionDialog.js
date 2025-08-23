import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

const categoriesObj = {
  income: ['salary', 'freelance', 'investment', 'bonus', 'other'],
  expense: ['food', 'transport', 'entertainment', 'healthcare', 'education', 'shopping', 'utilities', 'other']
};

const EditTransactionDialog = ({
  open,
  onClose,
  onSave,
  transaction,
}) => {
  const { t } = useTranslation();
  const [form, setForm] = React.useState(transaction);

  React.useEffect(() => {
    setForm(transaction);
  }, [transaction]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const categories = categoriesObj[form.type] || [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('edit_transaction')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('type')}
          select
          name="type"
          value={form.type}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        >
          <MenuItem value="expense">{t('expense')}</MenuItem>
          <MenuItem value="income">{t('income')}</MenuItem>
          <MenuItem value="transfer">{t('transfer')}</MenuItem>
        </TextField>
        <TextField
          label={t('amount')}
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          label={t('category')}
          select
          name="category"
          value={form.category}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('date')}
          type="date"
          name="date"
          value={form.date?.slice(0,10) || ''}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ my: 1 }}
        />
        <TextField
          label={t('description')}
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
          sx={{ my: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={() => onSave(form)} variant="contained">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTransactionDialog;
