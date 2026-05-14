import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import { getAllTransactions } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/admin.css';
import '../styles/tables.css';
import { FiFilter, FiDownload } from 'react-icons/fi';

const AdminTransactions = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filterType, filterStatus]);

  const fetchTransactions = async () => {
    try {
      const response = await getAllTransactions();
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredTransactions(filtered);
  };

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const stats = {
    total: filteredTransactions.length,
    amount: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
    completed: filteredTransactions.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="admin-layout">
      <AdminNavbar user={user} onLogout={onLogout} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="admin-container">
        <Sidebar isOpen={sidebarOpen} />
        <div className="admin-content">
          <div className="admin-header">
            <h1>📋 Transactions Report</h1>
            <button className="btn btn-secondary"><FiDownload /> Export Report</button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Transactions</h4>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-card">
              <h4>Total Amount</h4>
              <p className="stat-value">₦{stats.amount.toLocaleString('en-NG')}</p>
            </div>
            <div className="stat-card">
              <h4>Successful</h4>
              <p className="stat-value">{stats.completed}</p>
            </div>
            <div className="stat-card">
              <h4>Success Rate</h4>
              <p className="stat-value">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-bar">
            <div className="filter-group">
              <label>Type:</label>
              <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Types</option>
                <option value="airtime">Airtime</option>
                <option value="data">Data</option>
                <option value="wallet_topup">Wallet Top-up</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <div className="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Network</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map(t => (
                        <tr key={t._id}>
                          <td>{t.userId?.firstName} {t.userId?.lastName}</td>
                          <td><span className="type-badge">{t.type}</span></td>
                          <td>{t.network || '-'}</td>
                          <td>₦{t.amount.toLocaleString('en-NG')}</td>
                          <td><span className={`status-badge ${t.status}`}>{t.status}</span></td>
                          <td>{new Date(t.createdAt).toLocaleDateString('en-NG')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="text-center text-muted">No transactions found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;