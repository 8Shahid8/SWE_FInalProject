import { useState } from 'react';
import { Package, MapPin, AlertTriangle } from 'lucide-react';
import { addFirestoreBooking } from '../utils/database';
import { getCurrentUser } from '../utils/auth';
import { addAuditLog } from '../utils/database'; // Import addAuditLog
import { useQuarantine } from '../context/QuarantineContext.jsx'; // Import the quarantine hook

const generateAnonymousToken = () => {
    return 'TKN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default function ParcelDelivery() {
  const initialFormState = {
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    packageType: 'document',
    packageWeight: '',
    packageValue: '',
    deliverySpeed: 'standard',
    pickupDate: '',
    pickupTime: '',
    specialHandling: [],
    description: '',
    insurance: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const { isQuarantined } = useQuarantine(); // Get quarantine status

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSpecialHandlingToggle = (option) => {
    const handling = formData.specialHandling.includes(option)
      ? formData.specialHandling.filter(h => h !== option)
      : [...formData.specialHandling, option];
    setFormData({ ...formData, specialHandling: handling });
  };

  const calculateEstimatedCost = () => {
    let baseCost = 5.99;
    if (formData.packageType === 'document') baseCost = 5.99; // Added explicit value for document
    if (formData.packageType === 'small') baseCost = 8.99;
    if (formData.packageType === 'medium') baseCost = 12.99;
    if (formData.packageType === 'large') baseCost = 19.99;
    if (formData.deliverySpeed === 'express') baseCost *= 1.5;
    if (formData.deliverySpeed === 'overnight') baseCost *= 2;
    if (formData.insurance) baseCost += 3.99;
    return baseCost.toFixed(2);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isQuarantined) {
      alert("You cannot book new services while under quarantine.");
      return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('You must be logged in to book a delivery.');
        return;
    }

    const DUMMY_PROVIDER_UID = 'DUMMY_PROVIDER_UID_FOR_TESTING';
    const bookingDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime.split('-')[0]}`);

    const bookingData = {
        clientId: currentUser.uid,
        userName: currentUser.name || currentUser.email,
        providerId: DUMMY_PROVIDER_UID,
        serviceType: 'Parcel Delivery',
        bookingDate: bookingDateTime,
        contactToken: generateAnonymousToken(),
        status: 'confirmed',
        details: { ...formData, estimatedCost: calculateEstimatedCost() }
    };

    const result = await addFirestoreBooking(bookingData);

    if (result.success) {
        // R7: Audit Log for Booking Creation
        await addAuditLog('Booking Created', { bookingId: result.id, serviceType: bookingData.serviceType, clientId: bookingData.clientId });
        alert(`Parcel delivery booked successfully!`);
        setFormData(initialFormState);
    } else {
        alert(`Failed to book delivery: ${result.error}`);
    }
  };

  const specialHandlingOptions = ['Fragile', 'Keep Upright', 'Keep Dry', 'Temperature Sensitive'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Parcel Delivery</h1>
              <p className="text-gray-600">Send parcels with contactless pickup and delivery</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={isQuarantined} className="space-y-6">
              {/* Sender Information */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-purple-500" size={20} />
                  <h2 className="text-lg font-semibold">Sender Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Sender Name</label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Sender Phone</label>
                    <input
                      type="tel"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">Pickup Address</label>
                  <textarea
                    name="senderAddress"
                    value={formData.senderAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                    rows="3"
                    required
                  />
                </div>
              </div>

              {/* Recipient Information */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-purple-500" size={20} />
                  <h2 className="text-lg font-semibold">Recipient Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Recipient Name</label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Recipient Phone</label>
                    <input
                      type="tel"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">Delivery Address</label>
                  <textarea
                    name="recipientAddress"
                    value={formData.recipientAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                    rows="3"
                    required
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Package Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Package Type</label>
                    <select
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      required
                    >
                      <option value="document">Document (Envelope)</option>
                      <option value="small">Small Package (up to 5kg)</option>
                      <option value="medium">Medium Package (5-15kg)</option>
                      <option value="large">Large Package (15-30kg)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      name="packageWeight"
                      value={formData.packageWeight}
                      onChange={handleChange}
                      step="0.1"
                      min="0.1"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Declared Value ($)</label>
                    <input
                      type="number"
                      name="packageValue"
                      value={formData.packageValue}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Delivery Speed</label>
                    <select
                      name="deliverySpeed"
                      value={formData.deliverySpeed}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      required
                    >
                      <option value="standard">Standard (3-5 days)</option>
                      <option value="express">Express (1-2 days)</option>
                      <option value="overnight">Overnight (Next day)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">Package Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                    rows="2"
                    placeholder="Brief description of contents"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">Special Handling</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {specialHandlingOptions.map(option => (
                      <label key={option} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50 disabled:opacity-50">
                        <input
                          type="checkbox"
                          checked={formData.specialHandling.includes(option)}
                          onChange={() => handleSpecialHandlingToggle(option)}
                          className="w-4 h-4 text-purple-500 disabled:bg-gray-200"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer disabled:opacity-50">
                    <input
                      type="checkbox"
                      name="insurance"
                      checked={formData.insurance}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-500 disabled:bg-gray-200"
                    />
                    <span className="text-sm font-semibold">Add Insurance Coverage (+$3.99)</span>
                  </label>
                </div>
              </div>

              {/* Pickup Schedule */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Pickup Schedule</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Pickup Date</label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Pickup Time</label>
                    <select
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      required
                    >
                      <option value="">Select time slot</option>
                      <option value="09:00-12:00">9:00 AM - 12:00 PM</option>
                      <option value="12:00-15:00">12:00 PM - 3:00 PM</option>
                      <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Estimated Cost:</span>
                  <span className="text-2xl font-bold text-purple-600">${calculateEstimatedCost()}</span>
                </div>
                <p className="text-sm text-gray-600">Final cost may vary based on actual weight and dimensions</p>
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
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Book Parcel Delivery
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
