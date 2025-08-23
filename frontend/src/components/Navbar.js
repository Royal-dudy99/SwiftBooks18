import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({ toggleSidebar, toggleTheme, theme }) => {
  const { t } = useTranslation();
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <Link to="/" className="brand-link" title={t('dashboard')}>
          <img
            src="/swiftbooks_logo.png"
            alt="SwiftBooks Logo"
            style={{ height: '36px', marginRight: '10px', verticalAlign: 'middle' }}
          />
          <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
              {t('swiftbooks', { defaultValue: 'SwiftBooks' })}
            </span>
            <br />
            <span className="tagline" style={{ fontSize: '0.90em', color: '#497ce2', fontWeight: 500 }}>
              {t('tagline')}
            </span>
          </div>
        </Link>
      </div>
      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'light' ? t('switch_to_dark') : t('switch_to_light')}
        >
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
