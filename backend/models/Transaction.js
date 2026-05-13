const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['airtime', 'data', 'wallet_topup'], required: true },
  amount: { type: Number, required: true },
  network: String,
  phoneNumber: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  reference: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);