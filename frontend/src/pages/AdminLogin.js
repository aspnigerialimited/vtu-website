import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Admin credentials check (in real app, verify with backend)
    if (formData.email === 'admin@vtu.com' && formData.password === 'admin123') {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.isAdmin) {
        onLogin(token, { ...user, isAdmin: true });
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('User is not an admin');
      }
    } else {
      toast.error('Invalid admin credentials');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🛡️ Admin Login</h2>
        <p>Access the VTU Admin Dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@vtu.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <p className="auth-link">
          <a href="/login">Back to User Login</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;