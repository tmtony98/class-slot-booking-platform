import { getMonthName } from '../../utils/batchUtils';

export default function SelectedSlotsModal({
  isOpen,
  slots,
  onClose,
  onConfirm,
  onDeleteSlot,
  loading
}) {
  if (!isOpen) return null;

  // Sort slots by date
  const sortedSlots = [...slots].sort((a, b) =>
    new Date(a.dateStr) - new Date(b.dateStr)
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5 backdrop-blur-[4px]">
      <div className="bg-white rounded-2xl p-5 md:p-8 max-w-[900px] w-full max-h-[90vh] overflow-y-auto relative shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full border-none bg-[#333] text-white text-xl cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-black"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-center text-[#333] text-2xl mb-6 font-semibold">Selected Slots</h2>

        <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-6">
          {sortedSlots.map((slot, index) => (
            <div key={slot.id || index} className="bg-white rounded-xl overflow-hidden w-[90px] md:w-[110px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-0.5">
              <div className="bg-[#f0f0f0] p-2 text-center text-[10px] text-[#666] font-medium">
                {`${index + 1}${getOrdinalSuffix(index + 1)} Schedule`}
              </div>
              <div className="bg-primary-purple text-white p-3 text-center">
                <div className="text-[20px] md:text-2xl font-bold mb-1">
                  {new Date(slot.dateStr).getDate().toString().padStart(2, '0')}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold">Day {slot.dayNumber}</span>
                  <span className="text-[10px] opacity-90">{slot.topic}</span>
                </div>
              </div>
              <button
                className="w-full p-2 border border-[#e0e0e0] bg-white text-xs cursor-pointer transition-all duration-200 text-[#666] hover:bg-error-bg hover:text-error hover:border-error"
                onClick={() => onDeleteSlot(slot)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {slots.length === 0 && (
          <div className="text-center py-10 text-[#666]">
            <p>No slots selected</p>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="py-3 px-10 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-white border-2 border-[#e0e0e0] text-[#666] hover:border-[#333] hover:text-[#333]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="py-3 px-10 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-[#333] border-2 border-[#333] text-white hover:bg-black hover:border-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#333] disabled:hover:border-[#333]"
            onClick={onConfirm}
            disabled={loading || slots.length === 0}
          >
            {loading ? 'Saving...' : 'Ok'}
          </button>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-[#e0e0e0]">
          <div className="flex justify-center gap-2 mb-2 text-primary-purple">
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
          </div>
          <p className="text-xs text-[#666]">For inquiry: +44 123456789</p>
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
