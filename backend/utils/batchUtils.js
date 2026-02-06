const TOPICS = [
  'Topic 1',
  'Topic 2',
  'Topic 3',
  'Topic 4',
  'Topic 5',
  'Topic 6',
  'Topic 7'
];

/**
 * Generate batch schedule for a given month
 * @param {number} year - Full year (e.g., 2024)
 * @param {number} month - Month index (0-11)
 * @returns {Array} Array of 3 batches, each containing 7 class days
 */
function generateBatchesForMonth(year, month) {
  const batches = [];
  let currentDate = new Date(year, month, 1); // Start from 1st
  
  for (let batchNum = 1; batchNum <= 3; batchNum++) {
    const batchDays = [];
    let dayCount = 0;
    
    // Add 7 class days (skipping Sundays)
    while (dayCount < 7) {
      // Skip Sundays (day 0)
      if (currentDate.getDay() !== 0) {
        const dateStr = currentDate.toISOString().split('T')[0];
        batchDays.push({
          id: `${year}-${month}-batch${batchNum}-day${dayCount + 1}`,
          date: new Date(currentDate),
          dateStr: dateStr,
          dayNumber: dayCount + 1,
          topic: TOPICS[dayCount],
          batchNumber: batchNum,
          month: month,
          year: year
        });
        dayCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    batches.push({
      batchNumber: batchNum,
      days: batchDays,
      startDate: batchDays[0].dateStr,
      endDate: batchDays[batchDays.length - 1].dateStr
    });
    
    // Add 2-day gap (excluding Sundays) before next batch
    let gapDays = 0;
    while (gapDays < 2 && batchNum < 3) {
      if (currentDate.getDay() !== 0) {
        gapDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return batches;
}

/**
 * Get all gap dates for a month (dates between batches that are not class days)
 */
function getGapDatesForMonth(year, month) {
  const batches = generateBatchesForMonth(year, month);
  const classDates = new Set();
  const gapDates = [];
  
  // Collect all class dates
  batches.forEach(batch => {
    batch.days.forEach(day => {
      classDates.add(day.dateStr);
    });
  });
  
  // Find gap dates (non-Sunday, non-class dates within the batch range)
  if (batches.length > 0) {
    const startDate = new Date(batches[0].days[0].date);
    const endDate = new Date(batches[batches.length - 1].days[6].date);
    
    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      if (current.getDay() !== 0 && !classDates.has(dateStr)) {
        gapDates.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }
  }
  
  return gapDates;
}

/**
 * Convert batches to FullCalendar event format
 */
function batchesToCalendarEvents(batches, userBookings = []) {
  const events = [];
  
  batches.forEach(batch => {
    batch.days.forEach(day => {
      const isBooked = userBookings.some(b => 
        b.dateStr === day.dateStr && b.batchNumber === batch.batchNumber
      );
      
      events.push({
        id: day.id,
        title: `Day ${day.dayNumber}`,
        start: day.dateStr,
        allDay: true,
        extendedProps: {
          dayNumber: day.dayNumber,
          topic: day.topic,
          batchNumber: batch.batchNumber,
          isSelected: false,
          isBooked: isBooked,
          month: day.month,
          year: day.year
        }
      });
    });
  });
  
  return events;
}

/**
 * Check if a date string is within any batch for a given month
 */
function isDateInBatch(dateStr, year, month) {
  const batches = generateBatchesForMonth(year, month);
  
  for (const batch of batches) {
    for (const day of batch.days) {
      if (day.dateStr === dateStr) {
        return {
          found: true,
          batchNumber: batch.batchNumber,
          dayNumber: day.dayNumber,
          topic: day.topic
        };
      }
    }
  }
  
  return { found: false };
}

module.exports = {
  TOPICS,
  generateBatchesForMonth,
  getGapDatesForMonth,
  batchesToCalendarEvents,
  isDateInBatch
};
