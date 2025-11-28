import React, { useState } from 'react';
import { Sparkles, User, Phone, Home, Calendar, Clock, Bath, Bed } from 'lucide-react';

export default function HomeCleaning() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Home Cleaning request submitted!\n' + JSON.stringify(formData, null, 2));
    console.log('Home Cleaning Request:', formData);
    // In a real application, this data would be sent to a backend.
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., focus on kitchen, specific areas to avoid"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center space-x-2"
            >
              <Sparkles size={20} />
              <span>Request Home Cleaning</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
