import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState(
    localStorage.getItem('colorMode') || 'light'
  );

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('colorMode', next);
      return next;
    });
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: { main: '#497ce2' },
        secondary: { main: '#3bb77e' },
        background: {
          default: mode === 'dark' ? '#191724' : '#f4f6fb',
          paper: mode === 'dark' ? '#232535' : '#fff'
        }
      },
      shape: { borderRadius: 12 },
      typography: { fontFamily: '"Noto Serif", "Segoe UI", Arial, serif' },
    }), [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
