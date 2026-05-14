import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBarChart2, FiUsers, FiShoppingCart, FiSettings, FiLogOut } from 'react-icons/fi';
import '../styles/admin.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <h3>Menu</h3>
        <ul>
          <li>
            <Link 
              to="/admin/dashboard" 
              className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              <FiBarChart2 /> Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users" 
              className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
            >
              <FiUsers /> Users
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/transactions" 
              className={`nav-link ${isActive('/admin/transactions') ? 'active' : ''}`}
            >
              <FiShoppingCart /> Transactions
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/settings" 
              className={`nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
            >
              <FiSettings /> Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;