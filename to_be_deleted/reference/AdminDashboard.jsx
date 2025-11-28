import { useState, useEffect } from 'react';
import { Users, Package, TestTube, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeQuarantine: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalCheckIns: 0,
    totalExposures: 0
  });

  const [bookings, setBookings] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [exposures, setExposures] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load all data from localStorage
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const allCheckIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    const allExposures = JSON.parse(localStorage.getItem('exposures') || '[]');

    // For demo purposes, we'll simulate multiple users
    const totalUsers = 15; // Simulated
    const activeQuarantine = allExposures.length + 3; // Simulated

    setBookings(allBookings);
    setCheckIns(allCheckIns);
    setExposures(allExposures);

    setStats({
      totalUsers,
      activeQuarantine,
      totalBookings: allBookings.length,
      pendingBookings: allBookings.filter(b => b.status === 'pending').length,
      totalCheckIns: allCheckIns.length,
      totalExposures: allExposures.length
    });
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    loadData();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (type) => {
    switch(type) {
      case 'grocery': return '🛒';
      case 'medication': return '💊';
      case 'covid-testing': return '🧪';
      case 'food': return '🍔';
      case 'parcel': return '📦';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings, track contacts, and monitor quarantine status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Quarantine</p>
                <p className="text-3xl font-bold text-red-600">{stats.activeQuarantine}</p>
              </div>
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Bookings</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
              </div>
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Check-Ins</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalCheckIns}</p>
              </div>
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <MapPin className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reported Exposures</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalExposures}</p>
              </div>
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <TestTube className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Management */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Details</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(-10).reverse().map(booking => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getServiceIcon(booking.type)}</span>
                          <span className="font-medium capitalize">{booking.type.replace('-', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {booking.type === 'grocery' && (
                          <span className="text-sm text-gray-600">{booking.items?.length || 0} items</span>
                        )}
                        {booking.type === 'medication' && (
                          <span className="text-sm text-gray-600">{booking.medicationName}</span>
                        )}
                        {booking.type === 'covid-testing' && (
                          <span className="text-sm text-gray-600">{booking.testType?.toUpperCase()}</span>
                        )}
                        {booking.type === 'food' && (
                          <span className="text-sm text-gray-600">{booking.restaurant?.name}</span>
                        )}
                        {booking.type === 'parcel' && (
                          <span className="text-sm text-gray-600">{booking.packageType}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className="text-sm px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contact Tracing Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Check-Ins */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-purple-500" size={20} />
              Recent Check-Ins
            </h2>
            {checkIns.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No check-ins recorded</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {checkIns.slice(-10).reverse().map(checkIn => (
                  <div key={checkIn.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{checkIn.locationName}</p>
                        <p className="text-xs text-gray-600 capitalize">{checkIn.locationType}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {checkIn.visitDate} at {checkIn.visitTime}
                        </p>
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {checkIn.duration}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exposure Reports */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              Exposure Reports
            </h2>
            {exposures.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No exposures reported</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {exposures.slice(-10).reverse().map(exposure => (
                  <div key={exposure.id} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm text-red-800">Positive Case Reported</p>
                        <p className="text-xs text-red-700">Test Date: {exposure.testDate}</p>
                        {exposure.symptomsStartDate && (
                          <p className="text-xs text-red-700">Symptoms: {exposure.symptomsStartDate}</p>
                        )}
                      </div>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded font-semibold">
                        {exposure.testResult.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Isolation: {exposure.isolationStatus === 'yes' ? '✓ Yes' : '✗ No'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
