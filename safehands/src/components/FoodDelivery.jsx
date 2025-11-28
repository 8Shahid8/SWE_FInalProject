import React, { useState } from 'react';
import { Utensils, User, Phone, Home, Calendar, Clock, CookingPot } from 'lucide-react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Food Delivery request submitted!\n' + JSON.stringify(formData, null, 2));
    console.log('Food Delivery Request:', formData);
    // In a real application, this data would be sent to a backend.
    setFormData({
      customerName: '',
      contactNumber: '',
      deliveryAddress: '',
      preferredDate: '',
      preferredTime: '',
      cuisinePreference: 'any',
      notes: ''
    });
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="e.g., allergies, delivery instructions, restaurant preference"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center space-x-2"
            >
              <Utensils size={20} />
              <span>Order Food</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
