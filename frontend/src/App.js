import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Components
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Analytics from './components/Analytics';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Styles
import './App.css';

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Axios default config
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' 
  : 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    // Load user preferences
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedCurrency = localStorage.getItem('currency') || 'INR';
    setTheme(savedTheme);
    setCurrency(savedCurrency);
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <Navbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            toggleTheme={toggleTheme}
            theme={theme}
          />
          
          <div className="app-container">
            <Sidebar 
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard currency={currency} />} />
                <Route path="/add-transaction" element={<TransactionForm currency={currency} />} />
                <Route path="/analytics" element={<Analytics currency={currency} />} />
              </Routes>
            </main>
          </div>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#333' : '#fff',
                color: theme === 'dark' ? '#fff' : '#333',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

