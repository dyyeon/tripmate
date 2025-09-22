const express = require('express');
const { body, validationResult } = require('express-validator');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();

// 모든 여행 조회
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(trips);
  } catch (error) {
    console.error('여행 목록 조회 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 특정 여행 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!trip) {
      return res.status(404).json({ message: '여행을 찾을 수 없습니다.' });
    }
    
    res.json(trip);
  } catch (error) {
    console.error('여행 조회 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 새 여행 생성
router.post('/', auth, [
  body('destination').trim().isLength({ min: 1 }),
  body('countryCode').isLength({ min: 2, max: 2 }),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('budget').isNumeric().isFloat({ min: 0 }),
  body('memo').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { destination, countryCode, startDate, endDate, budget, memo } = req.body;

    const trip = new Trip({
      user: req.user._id,
      destination,
      countryCode: countryCode.toUpperCase(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget,
      memo: memo || ''
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    console.error('여행 생성 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 여행 수정
router.put('/:id', auth, [
  body('destination').optional().trim().isLength({ min: 1 }),
  body('countryCode').optional().isLength({ min: 2, max: 2 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('budget').optional().isNumeric().isFloat({ min: 0 }),
  body('memo').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!trip) {
      return res.status(404).json({ message: '여행을 찾을 수 없습니다.' });
    }

    const updates = req.body;
    if (updates.countryCode) {
      updates.countryCode = updates.countryCode.toUpperCase();
    }
    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate);
    }
    if (updates.endDate) {
      updates.endDate = new Date(updates.endDate);
    }

    Object.assign(trip, updates);
    await trip.save();
    
    res.json(trip);
  } catch (error) {
    console.error('여행 수정 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 여행 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!trip) {
      return res.status(404).json({ message: '여행을 찾을 수 없습니다.' });
    }
    
    res.json({ message: '여행이 삭제되었습니다.' });
  } catch (error) {
    console.error('여행 삭제 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 지출 추가
router.post('/:id/expenses', auth, [
  body('category').isIn(['숙박', '교통', '식사', '관광', '쇼핑', '기타']),
  body('amount').isNumeric().isFloat({ min: 0 }),
  body('description').trim().isLength({ min: 1 }),
  body('date').isISO8601(),
  body('location').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!trip) {
      return res.status(404).json({ message: '여행을 찾을 수 없습니다.' });
    }

    const { category, amount, description, date, location } = req.body;
    
    trip.expenses.push({
      category,
      amount,
      description,
      date: new Date(date),
      location: location || ''
    });

    trip.calculateTotalSpent();
    await trip.save();
    
    res.status(201).json(trip);
  } catch (error) {
    console.error('지출 추가 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 지출 수정
router.put('/:id/expenses/:expenseId', auth, [
  body('category').optional().isIn(['숙박', '교통', '식사', '관광', '쇼핑', '기타']),
  body('amount').optional().isNumeric().isFloat({ min: 0 }),
  body('description').optional().trim().isLength({ min: 1 }),
  body('date').optional().isISO8601(),
  body('location').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!trip) {
      return res.status(404).json({ message: '여행을 찾을 수 없습니다.' });
    }

    const expense = trip.expenses.id(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ message: '지출을 찾을 수 없습니다.' });
    }

    const updates = req.body;
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    Object.assign(expense, updates);
    trip.calculateTotalSpent();
    await trip.save();
    
    res.json(trip);
  } catch (error) {
    console.error('지출 수정 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 지출 삭제
router.delete('/:id/expenses/:expenseId', auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!trip) {
      return res.status(404).json({ message: '여행을 찾을 수 없습니다.' });
    }

    const expense = trip.expenses.id(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ message: '지출을 찾을 수 없습니다.' });
    }

    expense.remove();
    trip.calculateTotalSpent();
    await trip.save();
    
    res.json({ message: '지출이 삭제되었습니다.' });
  } catch (error) {
    console.error('지출 삭제 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;
