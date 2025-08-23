import React, { useState, useEffect } from 'react';
import './i18n';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { ThemeProvider as CustomThemeProvider, useTheme } from './components/ThemeContext';
import './App.css';

// Material UI ThemeProvider
import { ThemeProvider, createTheme } from '@mui/material/styles';

const apiBase = process.env.REACT_APP_API_URL;

const muiTheme = createTheme({
  palette: {
    primary: { main: '#497ce2' },
    secondary: { main: '#3bb77e' },
    background: { default: '#f4f6fb' }
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Noto Serif", "Segoe UI", Arial, serif',
  }
});

function AppContent() {
  // All hooks MUST come first and always run:
  const [allowed, setAllowed] = useState(false);
  const [asked, setAsked] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem("currency") || "INR"
  );
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!asked) {
      const pass = prompt("Site not public yet. Enter password:");
      if (pass === "BETA_TESTER_18") setAllowed(true);
      setAsked(true);
    }
  }, [asked]);

  useEffect(() => {
    if (!allowed) return;
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (savedToken && savedUser) {
        try {
          const response = await fetch(`${apiBase}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [allowed]);

  if (!allowed && asked) {
    return (
      <div style={{textAlign:'center', marginTop:'20vh', fontSize:'2rem'}}>
        🔒 Not allowed
      </div>
    );
  }
  if (loading && allowed) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading SwiftBooks...</p>
        </div>
      </div>
    );
  }
  if ((!user || !token) && allowed && !loading) {
    return <Login onLogin={handleLogin} />;
  }

  function handleLogin(userData, userToken) {
    setUser(userData);
    setToken(userToken);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }

  return (
    <Router>
      <div className={`App ${theme}-theme`}>
        <header className="app-header">
          <div className="header-content">
            <div className="logo">💰 SwiftBooks</div>
            <nav className="nav-links">
              <a href="/" className="nav-link">Dashboard</a>
              <a href="/add-transaction" className="nav-link">Add Transaction</a>
              <a href="/analytics" className="nav-link">Analytics</a>
              <a href="/settings" className="nav-link">Settings</a>
            </nav>
            <div className="user-info">
              <span>Welcome, {user?.name || "User"}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard user={user} token={token} currency={selectedCurrency} />} />
            <Route path="/add-transaction" element={<AddTransaction user={user} token={token} currency={selectedCurrency} />} />
            <Route path="/analytics" element={<Analytics user={user} token={token} currency={selectedCurrency} />} />
            <Route path="/settings" element={
              <Settings
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </ThemeProvider>
  );
}

export default App;
