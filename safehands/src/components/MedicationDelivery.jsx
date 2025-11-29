import React, { useState } from 'react';
import { Truck, Calendar, Home, Pill, User, AlertTriangle } from 'lucide-react';
import { addFirestoreBooking } from '../utils/database';
import { getCurrentUser } from '../utils/auth';
import { addAuditLog } from '../utils/database'; // Import addAuditLog
import { useQuarantine } from '../context/QuarantineContext.jsx'; // Import the quarantine hook

const generateAnonymousToken = () => {
    return 'TKN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default function MedicationDelivery() {
  const initialFormState = {
    patientName: '',
    medicationName: '',
    quantity: 1,
    deliveryAddress: '',
    deliveryDate: '',
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
        alert('You must be logged in to request a delivery.');
        return;
    }

    const DUMMY_PROVIDER_UID = 'DUMMY_PROVIDER_UID_FOR_TESTING';

    const bookingData = {
        clientId: currentUser.uid,
        userName: currentUser.name || currentUser.email,
        providerId: DUMMY_PROVIDER_UID,
        serviceType: 'Medication Delivery',
        bookingDate: new Date(formData.deliveryDate),
        contactToken: generateAnonymousToken(),
        status: 'confirmed',
        details: { ...formData }
    };
    
    const result = await addFirestoreBooking(bookingData);

    if (result.success) {
        // R7: Audit Log for Booking Creation
        await addAuditLog('Booking Created', { bookingId: result.id, serviceType: bookingData.serviceType, clientId: bookingData.clientId });
        alert('Medication delivery request submitted successfully!');
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
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <Pill className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Medication Delivery Request</h1>
              <p className="text-gray-600">Request your essential medications delivered to your doorstep.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={isQuarantined} className="space-y-4">
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
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
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                  placeholder="e.g., leave at doorstep, contact upon arrival"
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
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Truck size={20} />
                <span>Request Delivery</span>
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
