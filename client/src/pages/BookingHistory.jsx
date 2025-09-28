import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const res = await bookingAPI.getUserBookings();
      setBookings(res.data.data.bookings);
    } catch (err) {
      setError('Failed to fetch booking history');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayVisitCharge = async (bookingId) => {
    try {
      const res = await bookingAPI.payVisitCharge(bookingId);
      if (res.data.success) {
        // Update the booking status in the UI
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, visitChargePaid: true, status: 'confirmed' } 
            : booking
        ));
        alert('Visit charge paid successfully!');
      }
    } catch (err) {
      console.error('Error paying visit charge:', err);
      alert('Failed to pay visit charge. Please try again.');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const res = await bookingAPI.completeBooking(bookingId);
      if (res.data.success) {
        // Update the booking status in the UI
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'completed', completedAt: res.data.data.booking.completedAt } 
            : booking
        ));
        alert('Booking marked as completed!');
      }
    } catch (err) {
      console.error('Error completing booking:', err);
      alert('Failed to complete booking. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4">Loading booking history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Bookings Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't made any bookings. Find services near you to get started.
          </p>
          <a 
            href="/dashboard" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Find Services
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Booking History</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {booking.providerId?.businessName || 'Unknown Provider'}
                      </h3>
                      <span className={`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {booking.category} {booking.subCategory ? `> ${booking.subCategory}` : ''}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Timeslot: {new Date(booking.timeslot).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    {!booking.visitChargePaid && booking.status === 'pending' && (
                      <button
                        onClick={() => handlePayVisitCharge(booking._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                      >
                        Pay Visit Charge
                      </button>
                    )}
                    
                    {booking.visitChargePaid && booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCompleteBooking(booking._id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
                
                {booking.visitChargePaid && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Visit Charge Paid:</span> ${booking.providerId?.visitCharge || 0}
                    </p>
                    {booking.status === 'completed' && booking.completedAt && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Completed On:</span> {new Date(booking.completedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;