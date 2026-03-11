const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Income', IncomeSchema);
