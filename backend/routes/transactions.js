const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user transactions
router.get('/', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buy airtime
router.post('/buy-airtime', authenticate, async (req, res) => {
  try {
    const { amount, network, phoneNumber } = req.body;
    const user = await User.findById(req.userId);

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.walletBalance -= amount;
    await user.save();

    const transaction = new Transaction({
      userId: req.userId,
      type: 'airtime',
      amount,
      network,
      phoneNumber,
      status: 'completed',
    });
    await transaction.save();

    res.json({ message: 'Airtime purchased successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buy data
router.post('/buy-data', authenticate, async (req, res) => {
  try {
    const { amount, network, phoneNumber, plan } = req.body;
    const user = await User.findById(req.userId);

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.walletBalance -= amount;
    await user.save();

    const transaction = new Transaction({
      userId: req.userId,
      type: 'data',
      amount,
      network,
      phoneNumber,
      description: plan,
      status: 'completed',
    });
    await transaction.save();

    res.json({ message: 'Data purchased successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;