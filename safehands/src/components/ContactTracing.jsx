import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ContactTracing() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [checkIns, setCheckIns] = useState([]);
  const [exposures, setExposures] = useState([]);

  // Check-in form state
  const [checkInData, setCheckInData] = useState({
    locationName: '',
    locationType: 'restaurant',
    address: '',
    visitDate: '',
    visitTime: '',
    duration: '30',
    peopleCount: '1'
  });

  // Exposure report form state
  const [exposureData, setExposureData] = useState({
    testDate: '',
    testResult: 'positive',
    symptomsStartDate: '',
    isolationStatus: 'yes'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedCheckIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    const savedExposures = JSON.parse(localStorage.getItem('exposures') || '[]');
    setCheckIns(savedCheckIns);
    setExposures(savedExposures);
  };

  const handleCheckInSubmit = (e) => {
    e.preventDefault();

    const newCheckIn = {
      id: Date.now(),
      ...checkInData,
      createdAt: new Date().toISOString(),
      user: JSON.parse(localStorage.getItem('user') || '{}').email
    };

    const updatedCheckIns = [...checkIns, newCheckIn];
    localStorage.setItem('checkIns', JSON.stringify(updatedCheckIns));
    setCheckIns(updatedCheckIns);

    // Check for potential exposures
    checkForExposures(newCheckIn);

    alert('Location check-in recorded successfully!');
    setCheckInData({
      locationName: '',
      locationType: 'restaurant',
      address: '',
      visitDate: '',
      visitTime: '',
      duration: '30',
      peopleCount: '1'
    });
  };

  const handleExposureSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const newExposure = {
      id: Date.now(),
      ...exposureData,
      reportedBy: user.email,
      reportedAt: new Date().toISOString()
    };

    const updatedExposures = [...exposures, newExposure];
    localStorage.setItem('exposures', JSON.stringify(updatedExposures));
    setExposures(updatedExposures);

    // Update user quarantine status
    user.quarantineStatus = 'active';
    user.quarantineStartDate = exposureData.testDate;
    user.quarantineEndDate = new Date(new Date(exposureData.testDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    localStorage.setItem('user', JSON.stringify(user));

    // Notify potential contacts
    notifyContacts(newExposure);

    alert('Exposure reported. Contacts will be notified. Please follow quarantine guidelines.');
    setExposureData({
      testDate: '',
      testResult: 'positive',
      symptomsStartDate: '',
      isolationStatus: 'yes'
    });
  };

  const checkForExposures = (newCheckIn) => {
    const allExposures = JSON.parse(localStorage.getItem('exposures') || '[]');
    const allCheckIns = JSON.parse(localStorage.getItem('checkIns') || '[]');

    // Simple exposure detection: same location within 24 hours
    allExposures.forEach(exposure => {
      const exposureDate = new Date(exposure.testDate);
      const visitDate = new Date(newCheckIn.visitDate);

      allCheckIns.forEach(checkIn => {
        if (checkIn.user !== newCheckIn.user &&
            checkIn.locationName === newCheckIn.locationName &&
            Math.abs(new Date(checkIn.visitDate) - exposureDate) < 24 * 60 * 60 * 1000) {

          // Potential exposure detected
          console.log('Potential exposure detected at:', newCheckIn.locationName);
        }
      });
    });
  };

  const notifyContacts = (exposure) => {
    const allCheckIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    const exposureDate = new Date(exposure.testDate);

    // Find check-ins within 14 days before test
    const potentialContacts = allCheckIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.visitDate);
      const daysDiff = (exposureDate - checkInDate) / (1000 * 60 * 60 * 24);
      return daysDiff >= 0 && daysDiff <= 14 && checkIn.user === exposure.reportedBy;
    });

    console.log(`Notifying ${potentialContacts.length} potential contacts`);
  };

  const getPotentialExposures = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userCheckIns = checkIns.filter(c => c.user === user.email);

    let potentialExposures = [];

    exposures.forEach(exposure => {
      const exposureDate = new Date(exposure.testDate);

      userCheckIns.forEach(checkIn => {
        const checkInDate = new Date(checkIn.visitDate);
        const daysDiff = (checkInDate - exposureDate) / (1000 * 60 * 60 * 24);

        if (daysDiff >= -14 && daysDiff <= 0) {
          potentialExposures.push({
            location: checkIn.locationName,
            date: checkIn.visitDate,
            riskLevel: daysDiff >= -7 ? 'high' : 'medium'
          });
        }
      });
    });

    return potentialExposures;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Manual Contact Tracing</h1>
              <p className="text-gray-600">Track your visits and report exposures</p>
            </div>
          </div>

          {/* Exposure Warnings */}
          {getPotentialExposures().length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-yellow-800 font-semibold">Potential Exposure Detected</p>
                <p className="text-yellow-700 text-sm">
                  You may have visited a location where a positive case was reported. Please monitor symptoms and consider testing.
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'checkin'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Location Check-In
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'report'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Report Exposure
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My History
            </button>
          </div>

          {/* Check-In Tab */}
          {activeTab === 'checkin' && (
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Location Name</label>
                  <input
                    type="text"
                    value={checkInData.locationName}
                    onChange={(e) => setCheckInData({ ...checkInData, locationName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., City Mall, Green Park"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Location Type</label>
                  <select
                    value={checkInData.locationType}
                    onChange={(e) => setCheckInData({ ...checkInData, locationType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="grocery">Grocery Store</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="park">Park</option>
                    <option value="mall">Shopping Mall</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  value={checkInData.address}
                  onChange={(e) => setCheckInData({ ...checkInData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Visit Date</label>
                  <input
                    type="date"
                    value={checkInData.visitDate}
                    onChange={(e) => setCheckInData({ ...checkInData, visitDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Visit Time</label>
                  <input
                    type="time"
                    value={checkInData.visitTime}
                    onChange={(e) => setCheckInData({ ...checkInData, visitTime: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={checkInData.duration}
                    onChange={(e) => setCheckInData({ ...checkInData, duration: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Record Check-In
              </button>
            </form>
          )}

          {/* Report Exposure Tab */}
          {activeTab === 'report' && (
            <form onSubmit={handleExposureSubmit} className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-800 font-semibold">Report Positive COVID-19 Test</p>
                    <p className="text-red-700 text-sm">
                      This will notify people who may have been in contact with you. All information is kept confidential.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Test Date</label>
                  <input
                    type="date"
                    value={exposureData.testDate}
                    onChange={(e) => setExposureData({ ...exposureData, testDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Test Result</label>
                  <select
                    value={exposureData.testResult}
                    onChange={(e) => setExposureData({ ...exposureData, testResult: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="positive">Positive</option>
                    <option value="presumed-positive">Presumed Positive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">When did symptoms start? (Optional)</label>
                <input
                  type="date"
                  value={exposureData.symptomsStartDate}
                  onChange={(e) => setExposureData({ ...exposureData, symptomsStartDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Are you in isolation?</label>
                <select
                  value={exposureData.isolationStatus}
                  onChange={(e) => setExposureData({ ...exposureData, isolationStatus: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="yes">Yes, I am isolating</option>
                  <option value="no">No, not yet</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Submit Exposure Report
              </button>
            </form>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Check-In History */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-blue-500" />
                  Recent Check-Ins
                </h3>
                {checkIns.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No check-ins recorded yet</p>
                ) : (
                  <div className="space-y-3">
                    {checkIns.slice(-10).reverse().map(checkIn => (
                      <div key={checkIn.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{checkIn.locationName}</p>
                            <p className="text-sm text-gray-600 capitalize">{checkIn.locationType}</p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {checkIn.duration} mins
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{checkIn.address}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {checkIn.visitDate} at {checkIn.visitTime}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exposure Notifications */}
              {getPotentialExposures().length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-500" />
                    Potential Exposures
                  </h3>
                  <div className="space-y-3">
                    {getPotentialExposures().map((exposure, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${
                        exposure.riskLevel === 'high'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{exposure.location}</p>
                            <p className="text-sm text-gray-600">Date: {exposure.date}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${
                            exposure.riskLevel === 'high'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {exposure.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
