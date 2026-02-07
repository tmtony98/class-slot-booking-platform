import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getMonthName } from '../utils/batchUtils';
import ConfirmDeleteModal from '../components/Modal/ConfirmDeleteModal';

export default function ScheduledClassesPage() {
  const [groupedBookings, setGroupedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupedBookings();
  }, []);

  const fetchGroupedBookings = async () => {
    try {
      const response = await bookingsAPI.getGrouped();
      setGroupedBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = (bookingId) => {
    setDeleteTarget(bookingId);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await bookingsAPI.delete(deleteTarget);
      setDeleteTarget(null);
      fetchGroupedBookings();
    } catch (err) {
      setError('Failed to delete booking');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNewSlot = () => {
    navigate('/calendar');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="text-center py-[60px] text-[#666] text-lg">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 py-3 px-4 md:py-4 md:px-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h1 className="text-dark-purple text-2xl font-semibold">Scheduled Classes</h1>
        <div className="flex items-center gap-4">
          <button
            className="bg-primary-purple text-white border-none py-2.5 px-5 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-dark-purple hover:-translate-y-px"
            onClick={handleAddNewSlot}
          >
            Add New Slot
          </button>
          <span className="text-[#666] text-sm">{user?.name}</span>
          <button
            className="py-2 px-4 border border-[#e0e0e0] bg-white rounded-md text-[13px] cursor-pointer text-[#666] transition-all duration-200 hover:border-error hover:text-error"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        {error && (
          <div className="bg-error-bg text-error py-3 px-4 rounded-lg text-sm text-center mb-5">
            {error}
          </div>
        )}

        {groupedBookings.length === 0 ? (
          <div className="text-center py-[60px] px-5 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <h2 className="text-dark-purple mb-2">No bookings yet</h2>
            <p className="text-[#666] mb-6">Click "Add New Slot" to book your first class</p>
            <button
              className="bg-primary-purple text-white border-none py-3.5 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-dark-purple hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(107,75,124,0.4)]"
              onClick={handleAddNewSlot}
            >
              Book Your First Class
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {groupedBookings.map((group) => (
              <div key={`${group.year}-${group.month}`} className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-baseline gap-3 mb-5 pb-3 border-b-2 border-[#f0f0f0]">
                  <h2 className="text-dark-purple text-[1.3rem] font-semibold">{getMonthName(group.month)}</h2>
                  <span className="text-[#999] text-[1.1rem]">{group.year}</span>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 md:gap-4">
                  {group.bookings.map((booking) => (
                    <div key={booking._id} className="bg-light-purple rounded-[10px] overflow-hidden text-center transition-transform duration-200 hover:-translate-y-0.5">
                      <div className="py-2.5 px-2 flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-dark-purple">Day {booking.dayNumber}</span>
                        <span className="text-[10px] text-[#666]">{booking.topic}</span>
                      </div>
                      <div className="text-[24px] md:text-[28px] font-bold text-dark-purple py-3 md:py-4 px-4">
                        {new Date(booking.date).getDate().toString().padStart(2, '0')}
                      </div>
                      <button
                        className="w-full py-2  bg-white/60 text-[11px] cursor-pointer transition-all duration-200 text-[#888] border-none hover:bg-red-50 hover:text-error"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
