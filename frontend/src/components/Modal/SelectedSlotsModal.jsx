import { getMonthName } from '../../utils/batchUtils';
import './SelectedSlotsModal.css';

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
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">Selected Slots</h2>
        
        <div className="slots-container">
          {sortedSlots.map((slot, index) => (
            <div key={slot.id || index} className="slot-card">
              <div className="slot-header">
                {`${index + 1}${getOrdinalSuffix(index + 1)} Schedule`}
              </div>
              <div className="slot-body">
                <div className="slot-date">
                  {new Date(slot.dateStr).getDate().toString().padStart(2, '0')}
                </div>
                <div className="slot-info">
                  <span className="slot-day">Day {slot.dayNumber}</span>
                  <span className="slot-topic">{slot.topic}</span>
                </div>
              </div>
              <button 
                className="slot-delete"
                onClick={() => onDeleteSlot(slot)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {slots.length === 0 && (
          <div className="no-slots">
            <p>No slots selected</p>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="btn-confirm" 
            onClick={onConfirm}
            disabled={loading || slots.length === 0}
          >
            {loading ? 'Saving...' : 'Ok'}
          </button>
        </div>

        <div className="modal-footer">
          <div className="contact-icons">
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
          </div>
          <p>For inquiry: +44 123456789</p>
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
