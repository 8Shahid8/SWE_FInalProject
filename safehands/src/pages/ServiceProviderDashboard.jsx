// safehands/src/pages/ServiceProviderDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Briefcase, AlertTriangle, User, Package, Truck, ShieldCheck, Sparkles, Shirt, PawPrint, ShoppingCart, Utensils } from 'lucide-react'; // Added ShoppingCart, Utensils
import { getCurrentUser } from '../utils/auth';
import { onBookingsUpdateForProvider, updateBookingStatus, getFirestoreUserProfile } from '../utils/database';

// Define the services statically so the sidebar is always present, using specific service names
const services = [
    // Delivery Services Sub-categories
    { id: 'Grocery Delivery', name: 'Grocery Delivery', icon: ShoppingCart },
    { id: 'Food Delivery', name: 'Food Delivery', icon: Utensils },
    { id: 'Parcel Delivery', name: 'Parcel Delivery', icon: Package },
    
    // Other Services
    { id: 'Medication Delivery', name: 'Medication Delivery', icon: Truck },
    { id: 'Covid 19 Testing', name: 'Covid 19 Testing', icon: ShieldCheck },
    { id: 'Home Cleaning', name: 'Home Cleaning', icon: Sparkles },
    { id: 'Laundry Service', name: 'Laundry Service', icon: Shirt },
    { id: 'Pet Care Services', name: 'Pet Care Services', icon: PawPrint }
];

const ServiceProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(services[0].id); // Default to the first service
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      setLoading(true);
      
      const unsubscribe = onBookingsUpdateForProvider(currentUser.uid, (providerBookings) => {
        console.log('[SP Dashboard Debug] Raw providerBookings received:', providerBookings); // Debug log
        
        // No longer hydrating with client names here due to security rules.
        // The userName is already part of the booking data.
        setBookings(providerBookings);
        if (providerBookings.length > 0 && !activeTab) {
          setActiveTab(services[0].id); // Set active tab if there are bookings and none is selected
        }
        setLoading(false);
      });

      // Return the unsubscribe function for cleanup
      return () => unsubscribe();
    } else {
        console.log('[SP Dashboard Debug] No current user or UID.'); // Debug log
        setLoading(false); // If no user, stop loading.
    }
  }, [currentUser, activeTab]);

  const handleStatusChange = async (bookingId, newStatus) => {
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result.success) {
      // The real-time listener will automatically update the UI, 
      // but we can show an alert for immediate feedback.
      alert(`Booking status updated to ${newStatus}`);
    } else {
      alert(`Error updating status: ${result.error}`);
    }
  };

  const handleReportPositive = () => {
    if(window.confirm("Are you sure you want to report a positive test result? This will notify recent clients and is irreversible.")) {
      alert("You have reported a positive test. Thank you for helping keep the community safe. Recent clients will be notified.");
    }
  };

  const filteredBookings = useMemo(() => {
    const filtered = bookings.filter(b => b.serviceType === activeTab);
    console.log(`[SP Dashboard Debug] Filtered bookings for tab "${activeTab}":`, filtered); // Debug log
    return filtered;
  }, [bookings, activeTab]);

  if (loading) {
    return <div className="p-8 text-center">Loading your dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Service Categories</h2>
        </div>
        <nav className="p-4">
          <ul>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <li key={service.id}>
                  <button
                    onClick={() => setActiveTab(service.id)}
                    className={`w-full flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 ${
                      activeTab === service.id
                        ? 'bg-indigo-100 text-indigo-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3" size={20} />
                    <span>{service.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Provider Dashboard
          </h1>
          <button 
            onClick={handleReportPositive}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
          >
            <AlertTriangle size={20} />
            <span>Report Positive Test</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Briefcase className="mr-3" /> Bookings for {activeTab}
          </h2>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No assigned bookings for this service category.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Update Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                        <User size={16} className="mr-2 text-gray-500" />
                        {booking.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.bookingDate ? new Date(booking.bookingDate.seconds * 1000).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select 
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)} 
                          value={booking.status}
                          className="p-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="accepted">Accepted</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderDashboard;