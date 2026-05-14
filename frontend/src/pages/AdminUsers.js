import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import { getAllUsers } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/admin.css';
import '../styles/tables.css';
import { FiSearch, FiDownload, FiEye } from 'react-icons/fi';

const AdminUsers = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(u =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phoneNumber.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleExport = () => {
    const csv = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Wallet Balance', 'Created'],
      ...users.map(u => [
        u.firstName,
        u.lastName,
        u.email,
        u.phoneNumber,
        u.walletBalance,
        new Date(u.createdAt).toLocaleDateString('en-NG')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <div className="admin-layout">
      <AdminNavbar user={user} onLogout={onLogout} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="admin-container">
        <Sidebar isOpen={sidebarOpen} />
        <div className="admin-content">
          <div className="admin-header">
            <h1>👥 Users Management</h1>
            <button className="btn btn-secondary" onClick={handleExport}>
              <FiDownload /> Export CSV
            </button>
          </div>

          <div className="filter-bar">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Wallet Balance</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map(u => (
                        <tr key={u._id}>
                          <td>{u.firstName} {u.lastName}</td>
                          <td>{u.email}</td>
                          <td>{u.phoneNumber}</td>
                          <td>₦{u.walletBalance.toLocaleString('en-NG')}</td>
                          <td><span className="status-badge active">Active</span></td>
                          <td>{new Date(u.createdAt).toLocaleDateString('en-NG')}</td>
                          <td>
                            <button className="action-btn"><FiEye /> View</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" className="text-center text-muted">No users found</td></tr>
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
                    Page {currentPage} of {totalPages} ({filteredUsers.length} users)
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

export default AdminUsers;