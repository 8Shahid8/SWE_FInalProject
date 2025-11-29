import React, { useState } from 'react';
import { Shirt, User, Phone, Home, Calendar, Clock, WashingMachine, AlertTriangle } from 'lucide-react';
import { addFirestoreBooking } from '../utils/database';
import { getCurrentUser } from '../utils/auth';
import { addAuditLog } from '../utils/database'; // Import addAuditLog
import { useQuarantine } from '../context/QuarantineContext.jsx'; // Import the quarantine hook

const generateAnonymousToken = () => {
    return 'TKN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default function LaundryService() {
  const initialFormState = {
    customerName: '',
    contactNumber: '',
    pickupAddress: '',
    preferredPickupDate: '',
    preferredPickupTime: '',
    serviceType: 'wash-fold',
    notes: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const { isQuarantined } = useQuarantine(); // Get quarantine status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isQuarantined) {
      alert("You cannot book new services while under quarantine.");
      return;
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('You must be logged in to request a service.');
        return;
    }

    const DUMMY_PROVIDER_UID = 'DUMMY_PROVIDER_UID_FOR_TESTING';
    const bookingDateTime = new Date(`${formData.preferredPickupDate}T${formData.preferredPickupTime}`);

    const bookingData = {
        clientId: currentUser.uid,
        userName: currentUser.name || currentUser.email,
        providerId: DUMMY_PROVIDER_UID,
        serviceType: 'Laundry Service',
        bookingDate: bookingDateTime,
        contactToken: generateAnonymousToken(),
        status: 'confirmed',
        details: { ...formData }
    };

    const result = await addFirestoreBooking(bookingData);

    if (result.success) {
        // R7: Audit Log for Booking Creation
        await addAuditLog('Booking Created', { bookingId: result.id, serviceType: bookingData.serviceType, clientId: bookingData.clientId });
        alert('Laundry Service request submitted successfully!');
        setFormData(initialFormState);
    } else {
        alert(`Failed to submit request: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <WashingMachine className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Laundry Service Request</h1>
              <p className="text-gray-600">Schedule your laundry pickup and delivery.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={isQuarantined} className="space-y-4">
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                    placeholder="e.g., +1234567890"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pickupAddress" className="block text-sm font-semibold mb-2">Pickup Address</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <textarea
                    id="pickupAddress"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                    placeholder="Enter full address for laundry pickup"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredPickupDate" className="block text-sm font-semibold mb-2">Preferred Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      id="preferredPickupDate"
                      name="preferredPickupDate"
                      value={formData.preferredPickupDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="preferredPickupTime" className="block text-sm font-semibold mb-2">Preferred Pickup Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="time"
                      id="preferredPickupTime"
                      name="preferredPickupTime"
                      value={formData.preferredPickupTime}
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="serviceType" className="block text-sm font-semibold mb-2">Service Type</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  <option value="wash-fold">Wash & Fold</option>
                  <option value="dry-cleaning">Dry Cleaning</option>
                  <option value="ironing">Ironing Only</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold mb-2">Special Instructions (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                  placeholder="e.g., delicate items, specific detergent, delivery instructions"
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
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Shirt size={20} />
                <span>Request Laundry Service</span>
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
