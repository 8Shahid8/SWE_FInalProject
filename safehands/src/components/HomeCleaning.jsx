import React, { useState } from 'react'; // Removed useContext
import { Sparkles, User, Phone, Home, Calendar, Clock, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { addFirestoreBooking } from '../utils/database';
import { getCurrentUser } from '../utils/auth';
import { addAuditLog } from '../utils/database'; // Import addAuditLog
import { useQuarantine } from '../context/QuarantineContext.jsx'; // Use the hook instead of direct context

// Utility to generate a simple anonymous token
const generateAnonymousToken = () => {
    return 'TKN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default function HomeCleaning() {
  const { isQuarantined } = useQuarantine(); // Get quarantine status from context via hook
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    cleaningType: 'basic',
    numberOfRooms: 1,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isQuarantined) { // Early exit if quarantined
        alert("You cannot book new services while under quarantine.");
        return;
    }
    const currentUser = getCurrentUser();

    if (!currentUser || !currentUser.uid) {
      alert('You must be logged in to request a service.');
      return;
    }

    const DUMMY_PROVIDER_UID = 'DUMMY_PROVIDER_UID_FOR_TESTING';
    
    // Combine date and time into a single Date object
    const bookingDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);

    const bookingData = {
      clientId: currentUser.uid,
      userName: currentUser.name || currentUser.email,
      providerId: DUMMY_PROVIDER_UID,
      serviceType: 'Home Cleaning',
      bookingDate: bookingDateTime,
      contactToken: generateAnonymousToken(),
      status: 'confirmed',
      details: {
        customerName: formData.customerName,
        contactNumber: formData.contactNumber,
        address: formData.address,
        cleaningType: formData.cleaningType,
        numberOfRooms: formData.numberOfRooms,
        notes: formData.notes,
      }
    };
    
    const result = await addFirestoreBooking(bookingData);

    if (result.success) {
      // R7: Audit Log for Booking Creation
      await addAuditLog('Booking Created', { bookingId: result.id, serviceType: bookingData.serviceType, clientId: bookingData.clientId });
      alert('Home Cleaning request submitted successfully! A service provider will be assigned shortly.');
      // Reset form
      setFormData({
        customerName: '',
        contactNumber: '',
        address: '',
        preferredDate: '',
        preferredTime: '',
        cleaningType: 'basic',
        numberOfRooms: 1,
        notes: ''
      });
    } else {
      alert(`There was an error submitting your request: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Home Cleaning Request</h1>
              <p className="text-gray-600">Book professional home cleaning services.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={isQuarantined} className="space-y-4"> {/* Wrapped form in fieldset */}
              <div>
                <label htmlFor="customerName" className="block text-sm font-semibold mb-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-semibold mb-2">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                    placeholder="e.g., +1234567890"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold mb-2">Address</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                    placeholder="Enter full address for cleaning service"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-semibold mb-2">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-semibold mb-2">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="time"
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cleaningType" className="block text-sm font-semibold mb-2">Type of Cleaning</label>
                  <select
                    id="cleaningType"
                    name="cleaningType"
                    value={formData.cleaningType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  >
                    <option value="basic">Basic Cleaning</option>
                    <option value="deep">Deep Cleaning</option>
                    <option value="move-in-out">Move-in/Move-out Cleaning</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="numberOfRooms" className="block text-sm font-semibold mb-2">Number of Rooms</label>
                  <input
                    type="number"
                    id="numberOfRooms"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold mb-2">Special Instructions (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
                  placeholder="e.g., focus on kitchen, specific areas to avoid"
                />
              </div>

              {isQuarantined && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0"><AlertTriangle className="h-5 w-5 text-yellow-400" /></div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Due to your quarantine status, you cannot book new services.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Sparkles size={20} />
                <span>Request Home Cleaning</span>
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
