import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar, toggleTheme, theme }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <Link to="/" className="brand-link">
          <i className="fas fa-book-open"></i>
          <span>SwiftBooks</span>
        </Link>
      </div>
      
      <div className="navbar-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

