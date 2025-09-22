const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['숙박', '교통', '식사', '관광', '쇼핑', '기타']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  countryCode: {
    type: String,
    required: true,
    uppercase: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  memo: {
    type: String,
    trim: true
  },
  expenses: [expenseSchema],
  isCompleted: {
    type: Boolean,
    default: false
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 총 지출 계산
tripSchema.methods.calculateTotalSpent = function() {
  this.totalSpent = this.expenses.reduce((total, expense) => total + expense.amount, 0);
  return this.totalSpent;
};

// 남은 예산 계산
tripSchema.methods.getRemainingBudget = function() {
  return this.budget - this.totalSpent;
};

module.exports = mongoose.model('Trip', tripSchema);
