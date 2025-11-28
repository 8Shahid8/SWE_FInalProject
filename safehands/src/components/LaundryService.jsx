import React, { useState } from 'react';
import { Shirt, User, Phone, Home, Calendar, Clock, WashingMachine } from 'lucide-react';

export default function LaundryService() {
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    pickupAddress: '',
    preferredPickupDate: '',
    preferredPickupTime: '',
    serviceType: 'wash-fold',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Laundry Service request submitted!\n' + JSON.stringify(formData, null, 2));
    console.log('Laundry Service Request:', formData);
    // In a real application, this data would be sent to a backend.
    setFormData({
      customerName: '',
      contactNumber: '',
      pickupAddress: '',
      preferredPickupDate: '',
      preferredPickupTime: '',
      serviceType: 'wash-fold',
      notes: ''
    });
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., delicate items, specific detergent, delivery instructions"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition flex items-center justify-center space-x-2"
            >
              <Shirt size={20} />
              <span>Request Laundry Service</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
