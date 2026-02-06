const express = require('express');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const { 
  generateBatchesForMonth, 
  batchesToCalendarEvents,
  getGapDatesForMonth 
} = require('../utils/batchUtils');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ date: 1 });
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/bookings/grouped
// @desc    Get bookings grouped by month
// @access  Private
router.get('/grouped', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ date: 1 });
    
    // Group bookings by year and month
    const grouped = {};
    bookings.forEach(booking => {
      const key = `${booking.year}-${booking.month}`;
      if (!grouped[key]) {
        grouped[key] = {
          year: booking.year,
          month: booking.month,
          bookings: []
        };
      }
      grouped[key].bookings.push(booking);
    });
    
    // Convert to array sorted by date
    const result = Object.values(grouped).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create new bookings (bulk)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { slots } = req.body;
    
    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: 'Please provide slots to book' });
    }
    
    // Prepare bookings with userId
    const bookingsToCreate = slots.map(slot => ({
      userId: req.user._id,
      date: new Date(slot.date),
      dateStr: slot.date,
      batchNumber: slot.batchNumber,
      dayNumber: slot.dayNumber,
      topic: slot.topic,
      month: slot.month,
      year: slot.year
    }));
    
    // Insert bookings (skip duplicates)
    const createdBookings = [];
    const errors = [];
    
    for (const booking of bookingsToCreate) {
      try {
        const created = await Booking.create(booking);
        createdBookings.push(created);
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate key error - slot already booked
          errors.push({
            date: booking.dateStr,
            message: 'Slot already booked'
          });
        } else {
          throw err;
        }
      }
    }
    
    res.status(201).json({
      message: `${createdBookings.length} slots booked successfully`,
      bookings: createdBookings,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }
    
    await booking.deleteOne();
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/batches/:year/:month
// @desc    Get batch schedule for a month
// @access  Private
router.get('/batches/:year/:month', protect, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
      return res.status(400).json({ message: 'Invalid year or month' });
    }
    
    // Get batches for the month
    const batches = generateBatchesForMonth(year, month);
    
    // Get user's existing bookings for this month
    const userBookings = await Booking.find({
      userId: req.user._id,
      year: year,
      month: month
    });
    
    // Convert to calendar events
    const events = batchesToCalendarEvents(batches, userBookings);
    
    // Get gap dates
    const gapDates = getGapDatesForMonth(year, month);
    
    res.json({
      year,
      month,
      batches,
      events,
      gapDates,
      userBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
