import React, { useState, useEffect } from 'react';
import './i18n';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { CustomThemeProvider, useTheme } from './components/ThemeContext';
import './App.css';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const apiBase = process.env.REACT_APP_API_URL;

function AppContent() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem("currency") || "INR"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode } = useTheme();

  // Dynamically update the mobile browser/tab theme color on theme switch
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', mode === 'dark' ? '#191724' : '#f4f6fb');
    }
  }, [mode]);

  useEffect(() => {
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
  }, []);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading SwiftBooks...</p>
        </div>
      </div>
    );
  }
  if (!user || !token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Box className={`App ${mode}-theme`} sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar
          toggleSidebar={() => setSidebarOpen(true)}
          handleLogout={handleLogout}
          user={user}
        />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Toolbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <Dashboard user={user} token={token} currency={selectedCurrency} />
            } />
            <Route path="/add-transaction" element={
              <AddTransaction user={user} token={token} currency={selectedCurrency} />
            } />
            <Route path="/analytics" element={
              <Analytics user={user} token={token} currency={selectedCurrency} />
            } />
            <Route path="/settings" element={
              <Settings
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
              />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Box>
    </Router>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
