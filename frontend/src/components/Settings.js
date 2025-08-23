import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const availableCurrencies = [
  { code: "INR", symbol: "₹", label: "INR (₹)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" }
];

const Settings = ({ selectedCurrency, setSelectedCurrency, theme, toggleTheme }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved && availableCurrencies.find((c) => c.code === saved)) {
      setSelectedCurrency(saved);
    }
  }, [setSelectedCurrency]);

  const handleChange = (e) => {
    setSelectedCurrency(e.target.value);
    localStorage.setItem("currency", e.target.value);
  };

  // Generate a shareable referral link for the current user (use user data if available)
  const userId = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'))?.id || 'demoUser';
    } catch {
      return 'demoUser';
    }
  })();
  const referralLink = `${window.location.origin}/?ref=${userId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert(t('referral_copied'));
  };

  return (
    <Box maxWidth={420} mx="auto" mt={4}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          {t('settings')}
        </Typography>
        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel>{t('select_currency')}</InputLabel>
            <Select value={selectedCurrency} label={t('select_currency')} onChange={handleChange}>
              {availableCurrencies.map((cur) => (
                <MenuItem key={cur.code} value={cur.code}>{cur.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography mt={1}>{t('selected')}: <strong>{selectedCurrency}</strong></Typography>
        </Box>
        <Box mb={3}>
          <Typography fontWeight={500}>{t('theme')}</Typography>
          <Button
            variant="outlined"
            startIcon={theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            onClick={toggleTheme}
            sx={{ ml: 2 }}
          >
            {theme === 'light' ? t('switch_to_dark') : t('switch_to_light')}
          </Button>
          <Typography mt={1}>{t('current')}: <b>{theme.charAt(0).toUpperCase() + theme.slice(1)} {t('mode')}</b></Typography>
        </Box>
        <Box>
          <Typography fontWeight={500}>{t('refer')}</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>{t('share_this_link')}</Typography>
          <Paper sx={{ mt: 1, mb: 1, p: 1, background: "#f5f6fa", wordBreak: "break-all" }} elevation={0}>
            {referralLink}
          </Paper>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
          >
            {t('copy_link')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;
