const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  dateStr: {
    type: String,
    required: [true, 'Date string is required']
  },
  batchNumber: {
    type: Number,
    required: [true, 'Batch number is required'],
    min: 1,
    max: 3
  },
  dayNumber: {
    type: Number,
    required: [true, 'Day number is required'],
    min: 1,
    max: 7
  },
  topic: {
    type: String,
    required: [true, 'Topic is required']
  },
  month: {
    type: Number,
    required: true,
    min: 0,
    max: 11
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate bookings for same user on same date
bookingSchema.index({ userId: 1, dateStr: 1 }, { unique: true });

// Index for efficient queries
bookingSchema.index({ userId: 1, year: 1, month: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
