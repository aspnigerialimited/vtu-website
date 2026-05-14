import React from 'react';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import '../styles/admin.css';

const AdminNavbar = ({ user, onLogout, onMenuToggle }) => {
  const handleLogout = () => {
    onLogout();
    window.location.href = '/login';
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-content">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <FiMenu size={24} />
        </button>
        
        <div className="navbar-brand">
          <h1>🛡️ VTU Admin</h1>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <span>Admin: {user?.firstName}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;