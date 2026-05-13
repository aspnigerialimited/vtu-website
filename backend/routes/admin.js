const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Middleware to check if admin
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard stats
router.get('/dashboard', authenticate, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalTransactions = await Transaction.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: 'completed' });
    
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(10).populate('userId');

    res.json({
      totalUsers,
      totalTransactions,
      totalPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all transactions
router.get('/transactions', authenticate, checkAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId').sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', authenticate, checkAdmin, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;