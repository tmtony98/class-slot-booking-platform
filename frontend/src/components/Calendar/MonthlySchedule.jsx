import { TOPICS, getMonthName } from '../../utils/batchUtils';
import './MonthlySchedule.css';

export default function MonthlySchedule({ 
  currentDate, 
  onMonthSelect,
  selectedSlots = []
}) {
  const months = [];
  const currentYear = new Date().getFullYear();
  
  // Generate next 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, new Date().getMonth() + i, 1);
    months.push({
      month: date.getMonth(),
      year: date.getFullYear(),
      label: getMonthName(date.getMonth()).substring(0, 3)
    });
  }

  const displayYear = currentDate.getFullYear();
  const displayMonth = currentDate.getMonth();

  return (
    <div className="monthly-schedule">
      <div className="schedule-header">
        <h2>Monthly Schedule</h2>
        <div className="month-display">
          <button 
            className="month-nav"
            onClick={() => onMonthSelect(new Date(displayYear, displayMonth - 1, 1))}
          >
            ‹
          </button>
          <span>{getMonthName(displayMonth)} {displayYear}</span>
          <button 
            className="month-nav"
            onClick={() => onMonthSelect(new Date(displayYear, displayMonth + 1, 1))}
          >
            ›
          </button>
        </div>
      </div>

      <div className="time-slots">
        <button className="time-slot active">09:00 hs</button>
        <button className="time-slot">06:00 hs</button>
      </div>

      <div className="topics-list">
        {TOPICS.map((topic, index) => (
          <div key={index} className="topic-item">
            <span className="day-number">Day {index + 1}:</span>
            <span className="topic-name">{topic}</span>
          </div>
        ))}
      </div>

      <div className="month-tabs">
        {months.slice(0, 12).map((m, index) => (
          <button
            key={index}
            className={`month-tab ${m.month === displayMonth && m.year === displayYear ? 'active' : ''}`}
            onClick={() => onMonthSelect(new Date(m.year, m.month, 1))}
          >
            {m.label}
          </button>
        ))}
      </div>

      {selectedSlots.length > 0 && (
        <div className="selected-count">
          <span>{selectedSlots.length} slot{selectedSlots.length !== 1 ? 's' : ''} selected</span>
        </div>
      )}
    </div>
  );
}
