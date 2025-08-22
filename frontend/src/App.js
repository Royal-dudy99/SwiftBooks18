import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          // Verify token with backend
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(savedToken);
          } else {
            // Token expired or invalid
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

  // Show loading spinner while checking authentication
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

  // If not logged in, show login page
  if (!user || !token) {
    return <Login onLogin={handleLogin} />;
  }

  // If logged in, show main app
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              💰 SwiftBooks
            </div>
            <nav className="nav-links">
              <a href="/" className="nav-link">Dashboard</a>
              <a href="/add-transaction" className="nav-link">Add Transaction</a>
              <a href="/analytics" className="nav-link">Analytics</a>
            </nav>
            <div className="user-info">
              <span>Welcome, {user.name}!</span>
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

export default App;
