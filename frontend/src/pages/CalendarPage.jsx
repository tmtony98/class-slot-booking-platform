import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SlotCalendar from '../components/Calendar/SlotCalendar';
import MonthlySchedule from '../components/Calendar/MonthlySchedule';
import SelectedSlotsModal from '../components/Modal/SelectedSlotsModal';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CalendarPage.css';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user's existing bookings
  useEffect(() => {
    fetchBookings();
    console.log('userBookings', userBookings);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setUserBookings(response.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  // Handle slot selection/deselection
  const handleSlotSelect = (slot) => {
    console.log('slot', slot);
    
    const exists = selectedSlots.find(s => s.dateStr === slot.dateStr);
    
    if (exists) {
      setSelectedSlots(prev => prev.filter(s => s.dateStr !== slot.dateStr));
    } else {
      setSelectedSlots(prev => [...prev, slot]);
    }
  };

  // Handle month change
  const handleMonthChange = (date) => {
    setCurrentDate(date);
  };

  // Open modal
  const handleSubmitClick = () => {
    if (selectedSlots.length === 0) {
      setError('Please select at least one slot');
      return;
    }
    setError('');
    setIsModalOpen(true);
  };

  // Delete slot from selection
  const handleDeleteSlot = (slot) => {
    setSelectedSlots(prev => prev.filter(s => s.dateStr !== slot.dateStr));
  };

  // Confirm and save bookings
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await bookingsAPI.create(selectedSlots);
      setSelectedSlots([]);
      setIsModalOpen(false);
      navigate('/scheduled');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calendar-page">
      <header className="page-header">
        <h1>Select your slots</h1>
        <div className="header-actions">
          <span className="user-name">Welcome, {user?.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="calendar-section">
          <SlotCalendar
            userBookings={userBookings}
            selectedSlots={selectedSlots}
            onSlotSelect={handleSlotSelect}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div className="sidebar-section">
          <MonthlySchedule
            currentDate={currentDate}
            onMonthSelect={handleMonthChange}
            selectedSlots={selectedSlots}
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            className="btn-submit"
            onClick={handleSubmitClick}
            disabled={selectedSlots.length === 0}
          >
            Submit
          </button>
          
          <div className="page-footer">
            <div className="social-icons">
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
            <p>For inquiry: +44 123456789</p>
          </div>
        </div>
      </div>

      <SelectedSlotsModal
        isOpen={isModalOpen}
        slots={selectedSlots}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        onDeleteSlot={handleDeleteSlot}
        loading={loading}
      />
    </div>
  );
}
