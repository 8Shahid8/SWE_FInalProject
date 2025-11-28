import React, { useState } from 'react';
import { Truck, Calendar, Home, Pill, User } from 'lucide-react';

export default function MedicationDelivery() {
  const [formData, setFormData] = useState({
    patientName: '',
    medicationName: '',
    quantity: 1,
    deliveryAddress: '',
    deliveryDate: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Medication delivery request submitted!\n' + JSON.stringify(formData, null, 2));
    console.log('Medication Request:', formData);
    // In a real application, this data would be sent to a backend.
    setFormData({
      patientName: '',
      medicationName: '',
      quantity: 1,
      deliveryAddress: '',
      deliveryDate: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <Pill className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Medication Delivery Request</h1>
              <p className="text-gray-600">Request your essential medications delivered to your doorstep.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="patientName" className="block text-sm font-semibold mb-2">Patient Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient's full name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="medicationName" className="block text-sm font-semibold mb-2">Medication Name</label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="medicationName"
                  name="medicationName"
                  value={formData.medicationName}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Paracetamol, Insulin"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold mb-2">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full delivery address"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-semibold mb-2">Preferred Delivery Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., leave at doorstep, contact upon arrival"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center space-x-2"
            >
              <Truck size={20} />
              <span>Request Delivery</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
