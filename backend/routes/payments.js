const express = require('express');
const axios = require('axios');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Initialize payment with Paystack
router.post('/initialize', authenticate, async (req, res) => {
  try {
    const { amount, email } = req.body;
    const user = await User.findById(req.userId);

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email || user.email,
        amount: amount * 100, // Paystack uses kobo
        metadata: { userId: req.userId },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const payment = new Payment({
      userId: req.userId,
      amount,
      paymentMethod: 'paystack',
      paystackReference: response.data.data.reference,
      status: 'pending',
    });
    await payment.save();

    res.json({
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
      reference: response.data.data.reference,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
router.post('/verify/:reference', authenticate, async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.data.status === 'success') {
      const payment = await Payment.findOne({ paystackReference: reference });
      if (payment) {
        payment.status = 'completed';
        await payment.save();

        const user = await User.findById(payment.userId);
        user.walletBalance += payment.amount;
        await user.save();

        return res.json({
          message: 'Payment verified successfully',
          walletBalance: user.walletBalance,
        });
      }
    }

    res.status(400).json({ message: 'Payment verification failed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;