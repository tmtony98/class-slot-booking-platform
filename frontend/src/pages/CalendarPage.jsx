import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SlotCalendar from '../components/Calendar/SlotCalendar';
import MonthlySchedule from '../components/Calendar/MonthlySchedule';
import SelectedSlotsModal from '../components/Modal/SelectedSlotsModal';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log("selected-slots", selectedSlots);


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
    const exists = selectedSlots.find(s => s.dateStr === slot.dateStr);

    if (exists) {
      setError('');
      setSelectedSlots(prev => prev.filter(s => s.dateStr !== slot.dateStr));
    } else {
      const existingCount = userBookings.filter(b => b.month === slot.month && b.year === slot.year).length;
      const selectedCount = selectedSlots.filter(s => s.month === slot.month && s.year === slot.year).length;

      if (existingCount + selectedCount >= 7) {
        toast.warn('Maximum 7 bookings allowed per month');
        return;
      }

      setError('');
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
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 py-3 px-4 md:py-4 md:px-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h1 className="text-dark-purple text-[1.2rem] md:text-2xl font-semibold">Select your slots</h1>
        <div className="flex items-center gap-4">
          <span className="text-[#666] text-sm">Welcome, {user?.name}</span>
          <button
            className="py-2 px-4 border border-[#e0e0e0] bg-white rounded-md text-[13px] cursor-pointer text-[#666] transition-all duration-200 hover:border-error hover:text-error"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-4 md:p-6 max-w-[1400px] mx-auto">
        <div className="min-w-0">
          <SlotCalendar
            userBookings={userBookings}
            selectedSlots={selectedSlots}
            onSlotSelect={handleSlotSelect}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div className="flex flex-col gap-4 -order-1 lg:order-none">
          <MonthlySchedule
            currentDate={currentDate}
            onMonthSelect={handleMonthChange}
            selectedSlots={selectedSlots}
          />

          {error && (
            <div className="bg-error-bg text-error py-3 px-4 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            className="bg-primary-purple text-white border-none py-3.5 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-dark-purple hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(107,75,124,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-purple disabled:hover:translate-y-0 disabled:hover:shadow-none"
            onClick={handleSubmitClick}
            disabled={selectedSlots.length === 0}
          >
            Submit
          </button>

          <button
            className="border-2 border-primary-purple text-primary-purple bg-white py-3.5 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(107,75,124,0.4)]"
            onClick={() => navigate('/scheduled')}
          >
            View Bookings
          </button>

          <div className="text-center p-4 text-[#666]">
            <div className="flex justify-center gap-2 mb-2 text-primary-purple">
           
            </div>
            <p className="text-xs">For inquiry: +44 123456789</p>
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
