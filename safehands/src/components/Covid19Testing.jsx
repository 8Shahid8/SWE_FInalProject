import React, { useState } from 'react';
import { ShieldCheck, User, Phone, Calendar, Clock, Home, AlertCircle } from 'lucide-react';

export default function Covid19Testing() {
  const [formData, setFormData] = useState({
    patientName: '',
    contactNumber: '',
    preferredDate: '',
    preferredTime: '',
    testingAddress: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('COVID-19 Test request submitted!\n' + JSON.stringify(formData, null, 2));
    console.log('COVID-19 Test Request:', formData);
    // In a real application, this data would be sent to a backend.
    setFormData({
      patientName: '',
      contactNumber: '',
      preferredDate: '',
      preferredTime: '',
      testingAddress: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">COVID-19 Testing Request</h1>
              <p className="text-gray-600">Schedule a mobile COVID-19 test at your convenience.</p>
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter patient's full name"
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-semibold mb-2">Preferred Test Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="preferredTime" className="block text-sm font-semibold mb-2">Preferred Test Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="time"
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="testingAddress" className="block text-sm font-semibold mb-2">Testing Address</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <textarea
                  id="testingAddress"
                  name="testingAddress"
                  value={formData.testingAddress}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter full address for mobile testing"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold mb-2">Special Instructions / Symptoms (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., specific symptoms, preferred testing location details"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center space-x-2"
            >
              <ShieldCheck size={20} />
              <span>Request COVID-19 Test</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
