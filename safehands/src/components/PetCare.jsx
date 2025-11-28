import React, { useState } from 'react';
import { PawPrint, User, Phone, Calendar, Clock, Dog, Cat, Home } from 'lucide-react';

export default function PetCare() {
  const [formData, setFormData] = useState({
    ownerName: '',
    contactNumber: '',
    petName: '',
    petType: 'dog',
    serviceType: 'dog-walking',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Pet Care Service request submitted!\n' + JSON.stringify(formData, null, 2));
    console.log('Pet Care Service Request:', formData);
    // In a real application, this data would be sent to a backend.
    setFormData({
      ownerName: '',
      contactNumber: '',
      petName: '',
      petType: 'dog',
      serviceType: 'dog-walking',
      preferredDate: '',
      preferredTime: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <PawPrint className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pet Care Service Request</h1>
              <p className="text-gray-600">Request reliable and caring services for your beloved pets.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ownerName" className="block text-sm font-semibold mb-2">Pet Owner Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter pet owner's full name"
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
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="petName" className="block text-sm font-semibold mb-2">Pet Name</label>
                <div className="relative">
                  <PawPrint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="petName"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter pet's name"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="petType" className="block text-sm font-semibold mb-2">Pet Type</label>
                <select
                  id="petType"
                  name="petType"
                  value={formData.petType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-sm font-semibold mb-2">Service Type</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="dog-walking">Dog Walking</option>
                <option value="pet-sitting">Pet Sitting</option>
                <option value="grooming">Grooming</option>
                <option value="vet-visit">Vet Visit Assistance</option>
              </select>
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., pet's habits, specific feeding instructions, leash location"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center space-x-2"
            >
              <PawPrint size={20} />
              <span>Request Pet Care</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
