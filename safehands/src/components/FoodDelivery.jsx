import React, { useState } from 'react';
import { Utensils, User, Phone, Home, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { addFirestoreBooking } from '../utils/database';
import { getCurrentUser } from '../utils/auth';
import { addAuditLog } from '../utils/database'; // Import addAuditLog
import { useQuarantine } from '../context/QuarantineContext.jsx'; // Import the quarantine hook

const generateAnonymousToken = () => {
    return 'TKN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default function FoodDelivery() {
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    deliveryAddress: '',
    preferredDate: '',
    preferredTime: '',
    cuisinePreference: 'any',
    notes: ''
  });
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
        alert('You must be logged in to order food delivery.');
        return;
    }

    const DUMMY_PROVIDER_UID = 'DUMMY_PROVIDER_UID_FOR_TESTING';
    const bookingDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);

    const bookingData = {
        clientId: currentUser.uid,
        userName: currentUser.name || currentUser.email,
        providerId: DUMMY_PROVIDER_UID,
        serviceType: 'Food Delivery',
        bookingDate: bookingDateTime,
        contactToken: generateAnonymousToken(),
        status: 'confirmed',
        details: {
            customerName: formData.customerName,
            contactNumber: formData.contactNumber,
            deliveryAddress: formData.deliveryAddress,
            cuisinePreference: formData.cuisinePreference,
            notes: formData.notes,
        }
    };
    
    const result = await addFirestoreBooking(bookingData);

    if (result.success) {
        // R7: Audit Log for Booking Creation
        await addAuditLog('Booking Created', { bookingId: result.id, serviceType: bookingData.serviceType, clientId: bookingData.clientId });
        alert('Food delivery order placed successfully!');
        setFormData({
            customerName: '',
            contactNumber: '',
            deliveryAddress: '',
            preferredDate: '',
            preferredTime: '',
            cuisinePreference: 'any',
            notes: ''
        });
    } else {
        alert(`Failed to place order: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <Utensils className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Food Delivery Request</h1>
              <p className="text-gray-600">Order your favorite food from local restaurants.</p>
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-200"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-200"
                    placeholder="e.g., +1234567890"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-semibold mb-2">Delivery Address</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-200"
                    placeholder="Enter full address for food delivery"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-semibold mb-2">Preferred Delivery Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-semibold mb-2">Preferred Delivery Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="time"
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="cuisinePreference" className="block text-sm font-semibold mb-2">Cuisine Preference</label>
                <select
                  id="cuisinePreference"
                  name="cuisinePreference"
                  value={formData.cuisinePreference}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                >
                  <option value="any">Any / No Preference</option>
                  <option value="italian">Italian</option>
                  <option value="chinese">Chinese</option>
                  <option value="indian">Indian</option>
                  <option value="mexican">Mexican</option>
                  <option value="fast-food">Fast Food</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold mb-2">Special Instructions / Dietary Needs (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-200"
                  placeholder="e.g., allergies, delivery instructions, restaurant preference"
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
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Utensils size={20} />
                <span>Order Food</span>
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
