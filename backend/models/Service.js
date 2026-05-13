const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // MTN, Airtel, Glo, 9Mobile
  type: { type: String, enum: ['airtime', 'data'], required: true },
  plans: [{
    planId: String,
    name: String,
    amount: Number,
    validity: String,
    description: String,
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);