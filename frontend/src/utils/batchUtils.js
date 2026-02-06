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
export function generateBatchesForMonth(year, month) {
  const batches = [];
  let currentDate = new Date(year, month, 1);
  
  for (let batchNum = 1; batchNum <= 3; batchNum++) {
    const batchDays = [];
    let dayCount = 0;
    
    while (dayCount < 7) {
      if (currentDate.getDay() !== 0) {
        const dateStr = formatDateStr(currentDate);
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
 * Format date to YYYY-MM-DD string
 */
export function formatDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get all gap dates for a month
 */
export function getGapDatesForMonth(year, month) {
  const batches = generateBatchesForMonth(year, month);
  const classDates = new Set();
  const gapDates = [];
  
  batches.forEach(batch => {
    batch.days.forEach(day => {
      classDates.add(day.dateStr);
    });
  });
  
  if (batches.length > 0) {
    const startDate = new Date(batches[0].days[0].date);
    const endDate = new Date(batches[batches.length - 1].days[6].date);
    
    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = formatDateStr(current);
      if (current.getDay() !== 0 && !classDates.has(dateStr)) {
        gapDates.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }
  }
  
  return gapDates;
}

/**
 * Check if a date is a gap date
 */
export function isGapDate(date, year, month) {
  const gapDates = getGapDatesForMonth(year, month);
  const dateStr = formatDateStr(date);
  return gapDates.includes(dateStr);
}

/**
 * Convert batches to FullCalendar event format
 */
export function batchesToCalendarEvents(batches, userBookings = []) {
  const events = [];
  
  batches.forEach(batch => {
    batch.days.forEach(day => {
      const isBooked = userBookings.some(b => 
        b.dateStr === day.dateStr
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
          year: day.year,
          dateStr: day.dateStr
        }
      });
    });
  });
  
  return events;
}

/**
 * Get month name
 */
export function getMonthName(month) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

export { TOPICS };
