import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getMonthName } from '../utils/batchUtils';
import './ScheduledClassesPage.css';

export default function ScheduledClassesPage() {
  const [groupedBookings, setGroupedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingsAPI.delete(bookingId);
      // Refresh the list
      fetchGroupedBookings();
    } catch (err) {
      setError('Failed to delete booking');
      console.error(err);
    }
  };

  const handleAddNewSlot = () => {
    navigate('/calendar');
  };

  if (loading) {
    return (
      <div className="scheduled-page">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="scheduled-page">
      <header className="page-header">
        <h1>Scheduled Classes</h1>
        <div className="header-actions">
          <button className="btn-add-slot" onClick={handleAddNewSlot}>
            Add New Slot
          </button>
          <span className="user-name">{user?.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="page-content">
        {error && <div className="error-message">{error}</div>}

        {groupedBookings.length === 0 ? (
          <div className="no-bookings">
            <h2>No bookings yet</h2>
            <p>Click "Add New Slot" to book your first class</p>
            <button className="btn-primary" onClick={handleAddNewSlot}>
              Book Your First Class
            </button>
          </div>
        ) : (
          <div className="bookings-container">
            {groupedBookings.map((group) => (
              <div key={`${group.year}-${group.month}`} className="month-group">
                <div className="month-header">
                  <h2>{getMonthName(group.month)}</h2>
                  <span className="year">{group.year}</span>
                </div>
                
                <div className="bookings-grid">
                  {group.bookings.map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="card-header">
                        <span className="day-label">Day {booking.dayNumber}</span>
                        <span className="topic-label">{booking.topic}</span>
                      </div>
                      <div className="card-date">
                        {new Date(booking.date).getDate().toString().padStart(2, '0')}
                      </div>
                      <button 
                        className="btn-delete"
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
    </div>
  );
}
