import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import { useTheme } from './ThemeContext'; // <-- This is new!

const Navbar = ({ toggleSidebar, handleLogout, user }) => {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useTheme();

  return (
    <AppBar position="sticky" color="default" elevation={2} sx={{ background: mode === 'dark' ? '#191724' : 'rgba(255,255,255,0.97)' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img
            src="/swiftbooks_logo.png"
            alt="SwiftBooks Logo"
            style={{ height: '36px', marginRight: 10 }}
          />
          <Box>
            <Typography variant="h6" noWrap fontWeight={700}>
              {t('swiftbooks', { defaultValue: 'SwiftBooks' })}
            </Typography>
            <Typography variant="caption" color="primary" fontWeight={500}>
              {t('tagline')}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ mr: 2 }}>
          {user?.name ? `Welcome, ${user.name}!` : ''}
        </Typography>
        <IconButton
          title={mode === 'light' ? t('switch_to_dark') : t('switch_to_light')}
          color="inherit"
          onClick={toggleTheme}
        >
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
        <button onClick={handleLogout} className="logout-btn" style={{ marginLeft: 8 }}>
          Logout
        </button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
