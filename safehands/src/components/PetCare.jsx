import React, { useState } from 'react';
import { PawPrint, User, Phone, Calendar, Clock, Dog, Cat, Home, AlertTriangle } from 'lucide-react';
import { addFirestoreBooking } from '../utils/database';
import { getCurrentUser } from '../utils/auth';
import { addAuditLog } from '../utils/database';
import { useQuarantine } from '../context/QuarantineContext.jsx'; // Import the quarantine hook

const generateAnonymousToken = () => {
    return 'TKN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default function PetCare() {
  const initialFormState = {
    ownerName: '',
    contactNumber: '',
    petName: '',
    petType: 'dog',
    serviceType: 'dog-walking',
    preferredDate: '',
    preferredTime: '',
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
    const bookingDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);

    const bookingData = {
        clientId: currentUser.uid,
        userName: currentUser.name || currentUser.email,
        providerId: DUMMY_PROVIDER_UID,
        serviceType: 'Pet Care Services',
        bookingDate: bookingDateTime,
        contactToken: generateAnonymousToken(),
        status: 'confirmed',
        details: { ...formData }
    };
    
    const result = await addFirestoreBooking(bookingData);

    if (result.success) {
        await addAuditLog('Booking Created', { bookingId: result.id, serviceType: bookingData.serviceType, clientId: bookingData.clientId });
        alert('Pet Care service request submitted successfully!');
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
            <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <PawPrint className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pet Care Service Request</h1>
              <p className="text-gray-600">Request reliable and caring services for your beloved pets.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={isQuarantined} className="space-y-4">
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
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
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
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
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
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
                      className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
                  placeholder="e.g., pet's habits, specific feeding instructions, leash location"
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
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <PawPrint size={20} />
                <span>Request Pet Care</span>
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}