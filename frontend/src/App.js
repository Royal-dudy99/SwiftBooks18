import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import Analytics from './components/Analytics';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import './App.css';

const apiBase = process.env.REACT_APP_API_URL;

function AppContent() {
  // ---- PASSWORD PROTECTION START ----
  const [allowed, setAllowed] = useState(false);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (!asked) {
      const pass = prompt("Site not public yet. Enter password:");
      if (pass === "BETA_TESTER_18") setAllowed(true); // <-- Set your secret password here
      setAsked(true);
    }
  }, [asked]);

  if (!allowed) {
    return (
      <div style={{textAlign:'center', marginTop:'20vh', fontSize:'2rem'}}>
        🔒 Not allowed
      </div>
    );
  }
  // ---- PASSWORD PROTECTION END ----

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

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

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

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
      <div className={`App ${theme}-theme`}>
        <header className="app-header">
          <div className="header-content">
            <div className="logo">💰 SwiftBooks</div>
            <nav className="nav-links">
              <a href="/" className="nav-link">Dashboard</a>
              <a href="/add-transaction" className="nav-link">Add Transaction</a>
              <a href="/analytics" className="nav-link">Analytics</a>
            </nav>
            <div className="user-info">
              <span>Welcome, {user.name}!</span>
              <button onClick={toggleTheme} className="logout-btn" style={{marginRight:"10px"}}>
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard user={user} token={token} />} />
            <Route path="/add-transaction" element={<AddTransaction user={user} token={token} />} />
            <Route path="/analytics" element={<Analytics user={user} token={token} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
