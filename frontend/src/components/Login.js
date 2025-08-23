import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LoginIcon from '@mui/icons-material/Login';
import Skeleton from '@mui/material/Skeleton';

const apiBase = process.env.REACT_APP_API_URL;

const Login = ({ onLogin }) => {
  const { t } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegistering && formData.password !== confirmPassword) {
      setError(t('error') + ": " + t("Passwords do not match"));
      setLoading(false);
      return;
    }

    const endpoint = isRegistering
      ? `${apiBase}/api/auth/register`
      : `${apiBase}/api/auth/login`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user, data.token);
      } else {
        setError(data.error || t('error'));
      }
    } catch (err) {
      setError(err.message || t("network_error"));
    } finally {
      setLoading(false);
    }
  };

  // Optional: show skeleton when loading form or during auth
  if (loading) {
    return (
      <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Paper elevation={4} sx={{ mt: 8, py: 5, px: 3, borderRadius: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Skeleton variant="circular" width={54} height={54} sx={{ mb: 3 }} />
            <Skeleton variant="text" width={120} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={170} sx={{ mb: 2 }} />
          </Box>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={52} sx={{ mb: 2 }} />
          ))}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ mt: 8, py: 5, px: 3, borderRadius: 4, transition: 'box-shadow 0.3s, transform 0.16s', '&:hover': { boxShadow: 10, transform: 'scale(1.015)' } }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src="/swiftbooks_logo.png" alt="SwiftBooks Logo" style={{ height: 54, marginBottom: 18 }} />
          <Typography component="h1" variant="h5" fontWeight={600} mb={1}>
            SwiftBooks
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mb={2}>
            {isRegistering ? t("Create your account") : t("Welcome back")}
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {isRegistering && (
            <TextField
              margin="normal"
              required
              fullWidth
              label={t("Full Name")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
              disabled={loading}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label={t("email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label={t("password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete={isRegistering ? "new-password" : "current-password"}
            disabled={loading}
          />
          {isRegistering && (
            <TextField
              margin="normal"
              required
              fullWidth
              label={t("Confirm Password")}
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={loading}
            />
          )}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1, mb: 0 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress color="inherit" size={18} /> : isRegistering ? <PersonAddAltIcon /> : <LoginIcon />}
            sx={{ mt: 3, mb: 2, fontWeight: 700, transition: 'box-shadow 0.2s, transform 0.1s', '&:hover': { boxShadow: 6, transform: 'scale(1.03)' } }}
            disabled={loading}
          >
            {isRegistering ? t("Create Account") : t("Sign In")}
          </Button>
        </Box>
        <Grid container justifyContent="center">
          <Grid item>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {isRegistering
                ? t('Already have an account?')
                : t("Don't have an account?")}{' '}
              <Button
                color="secondary"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setConfirmPassword('');
                }}
                size="small"
                sx={{ fontWeight: 700, textTransform: 'none' }}
              >
                {isRegistering ? t('Sign In') : t('Create Account')}
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
