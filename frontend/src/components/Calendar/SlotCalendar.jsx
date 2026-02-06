import { useRef, useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  generateBatchesForMonth, 
  batchesToCalendarEvents,
  getGapDatesForMonth,
  formatDateStr,
  TOPICS
} from '../../utils/batchUtils';
import './SlotCalendar.css';

export default function SlotCalendar({ 
  userBookings = [], 
  selectedSlots = [],
  onSlotSelect,
  onMonthChange
}) {
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [gapDates, setGapDates] = useState([]);

  // Generate events when month or bookings change
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const batches = generateBatchesForMonth(year, month);
    const calendarEvents = batchesToCalendarEvents(batches, userBookings);
    
    // Mark selected slots
    calendarEvents.forEach(event => {
      const isSelected = selectedSlots.some(s => s.dateStr === event.extendedProps.dateStr);
      event.extendedProps.isSelected = isSelected;
    });
    
    setEvents(calendarEvents);
    setGapDates(getGapDatesForMonth(year, month));
  }, [currentDate, userBookings, selectedSlots]);

  // Handle date click
  const handleDateClick = useCallback((info) => {
    console.log('=== DATE CLICK START ===');
    console.log('1. Clicked date:', info.dateStr);
    console.log('2. Events array length:', events.length);
    console.log('3. GapDates:', gapDates);
    
    const dayOfWeek = info.date.getDay();
    console.log('4. Day of week:', dayOfWeek, '(0=Sunday)');
    
    // Prevent selection on Sundays
    if (dayOfWeek === 0) {
      console.log('STOPPED: Sunday clicked');
      return;
    }
    
    const dateStr = formatDateStr(info.date);
    console.log('5. Formatted dateStr:', dateStr);
    
    // Check if this is a gap date
    if (gapDates.includes(dateStr)) {
      console.log('STOPPED: Gap date clicked');
      return;
    }
    
    // Find the event for this date
    console.log('6. Looking for event with start:', dateStr);
    console.log('7. Available events:', events.map(e => e.start));
    
    const event = events.find(e => e.start === dateStr);
    console.log('8. Found event:', event);
    
    if (!event) {
      console.log('STOPPED: No event found for this date');
      return;
    }
    
    // Don't allow selecting already booked slots
    if (event.extendedProps.isBooked) {
      console.log('STOPPED: Slot already booked');
      return;
    }
    
    console.log('9. Calling onSlotSelect...');
    // Toggle selection
    if (onSlotSelect) {
      onSlotSelect({
        id: event.id,
        dateStr: dateStr,
        date: info.date,
        dayNumber: event.extendedProps.dayNumber,
        topic: event.extendedProps.topic,
        batchNumber: event.extendedProps.batchNumber,
        month: event.extendedProps.month,
        year: event.extendedProps.year
      });
      console.log('10. onSlotSelect called successfully!');
    } else {
      console.log('STOPPED: onSlotSelect is not defined');
    }
    console.log('=== DATE CLICK END ===');
  }, [events, gapDates, onSlotSelect]);

  // Handle event click (when clicking on the purple slot boxes)
  const handleEventClick = useCallback((clickInfo) => {
    console.log('=== EVENT CLICK ===');
    const event = clickInfo.event;
    console.log('Clicked event:', event.id, event.startStr);
    
    // Don't allow selecting already booked slots
    if (event.extendedProps.isBooked) {
      console.log('STOPPED: Slot already booked');
      return;
    }
    
    if (onSlotSelect) {
      onSlotSelect({
        id: event.id,
        dateStr: event.startStr,
        date: event.start,
        dayNumber: event.extendedProps.dayNumber,
        topic: event.extendedProps.topic,
        batchNumber: event.extendedProps.batchNumber,
        month: event.extendedProps.month,
        year: event.extendedProps.year
      });
      console.log('onSlotSelect called!');
    }
  }, [onSlotSelect]);

  // Handle month navigation
  const handleDatesSet = (dateInfo) => {
    const newDate = dateInfo.view.currentStart;
    setCurrentDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  // Custom event content
  const renderEventContent = (eventInfo) => {
    console.log('eventInfo', eventInfo);
    
    const { dayNumber, topic, isSelected, isBooked } = eventInfo.event.extendedProps;
    
    return (
      <div className={`slot-content ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}>
        <div className="day-label">Day {dayNumber}</div>
        <div className="topic-label">{topic}</div>
      </div>
    );
  };

  // Dynamic event class names
  const getEventClassNames = (arg) => {
    const classes = [];
    const { batchNumber, isSelected, isBooked } = arg.event.extendedProps;
    
    classes.push(`batch-${batchNumber}`);
    
    if (isSelected) classes.push('slot-selected');
    if (isBooked) classes.push('slot-booked');
    
    return classes;
  };

  // Day cell class names for Sundays and gaps
  const getDayCellClassNames = (arg) => {
    const classes = [];
    const dayOfWeek = arg.date.getDay();
    const dateStr = formatDateStr(arg.date);
    
    if (dayOfWeek === 0) {
      classes.push('sunday-cell');
    }
    
    if (gapDates.includes(dateStr)) {
      classes.push('gap-day');
    }
    
    return classes;
  };

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'today'
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        eventContent={renderEventContent}
        eventClassNames={getEventClassNames}
        dayCellClassNames={getDayCellClassNames}
        firstDay={0}
        fixedWeekCount={false}
        showNonCurrentDates={true}
        height="auto"
      />
    </div>
  );
}
