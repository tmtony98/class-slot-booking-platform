import { TOPICS, getMonthName } from '../../utils/batchUtils';

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
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col gap-5">
      <div>
        <h2 className="text-[1.25rem] text-dark-purple mb-3 font-semibold">Monthly Schedule</h2>
        <div className="flex items-center justify-center gap-3 text-primary-purple font-medium">
          <button
            className="bg-transparent border border-[#e0e0e0] w-7 h-7 rounded-md cursor-pointer text-base text-primary-purple flex items-center justify-center transition-all duration-200 hover:bg-primary-purple hover:text-white hover:border-primary-purple"
            onClick={() => onMonthSelect(new Date(displayYear, displayMonth - 1, 1))}
          >
            ‹
          </button>
          <span>{getMonthName(displayMonth)} {displayYear}</span>
          <button
            className="bg-transparent border border-[#e0e0e0] w-7 h-7 rounded-md cursor-pointer text-base text-primary-purple flex items-center justify-center transition-all duration-200 hover:bg-primary-purple hover:text-white hover:border-primary-purple"
            onClick={() => onMonthSelect(new Date(displayYear, displayMonth + 1, 1))}
          >
            ›
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2.5 px-4 border-2 border-primary-purple rounded-lg bg-primary-purple text-sm cursor-pointer transition-all duration-200 text-white">
          09:00 hs
        </button>
        <button className="flex-1 py-2.5 px-4 border-2 border-[#e0e0e0] rounded-lg bg-white text-sm cursor-pointer transition-all duration-200 text-[#666] hover:border-primary-purple hover:text-primary-purple">
          06:00 hs
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {TOPICS.map((topic, index) => (
          <div key={index} className="flex gap-2 text-sm py-1.5 border-b border-[#f0f0f0] last:border-b-0">
            <span className="font-semibold text-dark-purple min-w-[50px]">Day {index + 1}:</span>
            <span className="text-[#666]">{topic}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-row flex-wrap lg:flex-col lg:max-h-[200px] gap-1 overflow-y-auto">
        {months.slice(0, 12).map((m, index) => (
          <button
            key={index}
            className={`py-1.5 px-2.5 lg:py-2 lg:px-3 border-none text-left text-xs lg:text-[13px] cursor-pointer rounded-md transition-all duration-200 ${
              m.month === displayMonth && m.year === displayYear
                ? 'bg-primary-purple text-white font-medium'
                : 'bg-transparent text-[#666] hover:bg-[#f8f5fa] hover:text-primary-purple'
            }`}
            onClick={() => onMonthSelect(new Date(m.year, m.month, 1))}
          >
            {m.label}
          </button>
        ))}
      </div>

      {selectedSlots.length > 0 && (
        <div className="bg-dark-purple text-white py-3 px-4 rounded-lg text-center font-medium text-sm">
          <span>{selectedSlots.length} slot{selectedSlots.length !== 1 ? 's' : ''} selected</span>
        </div>
      )}
    </div>
  );
}
