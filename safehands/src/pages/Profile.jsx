import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Shield, Calendar, AlertCircle } from 'lucide-react';
import { auth } from '../firebase'; // Import Firebase auth instance
import { getFirestoreUserProfile } from '../utils/database'; // Function to get user profile from Firestore
import { doc, setDoc } from 'firebase/firestore'; // Import setDoc for updating Firestore
import { db } from '../firebase'; // Import Firestore db instance

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null); // Full user profile from Firestore
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const profile = await getFirestoreUserProfile(user.uid);
          setUserProfile(profile);
          setFormData(profile);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load profile.");
          setLoading(false);
        }
      } else {
        // Not authenticated, should be redirected by ProtectedRoute
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuarantineChange = (e) => {
    const status = e.target.value;
    setFormData({
      ...formData,
      quarantineStatus: status,
      quarantineStartDate: status === 'active' ? new Date().toISOString().split('T')[0] : '',
      quarantineEndDate: status === 'active' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (userProfile && userProfile.id) {
        const userDocRef = doc(db, 'users', userProfile.id);
        await setDoc(userDocRef, formData, { merge: true }); // Merge to update only changed fields
        setUserProfile(formData); // Update local state
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
      alert('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getQuarantineStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!userProfile) {
    // This case should ideally be handled by ProtectedRoute redirecting to login
    return <div className="min-h-screen flex items-center justify-center">No user profile found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userProfile.name || 'User Name'}</h1>
                <p className="text-blue-100">{userProfile.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Quarantine Status Alert */}
          {userProfile.covidStatus === 'positive' && (
            <div className="bg-red-50 border-b border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-semibold">Active Quarantine</p>
                <p className="text-red-700 text-sm">
                  Your status is positive. Please follow health guidelines.
                  {/* End Date: {userProfile.quarantineEndDate || 'Not set'} */}
                </p>
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-semibold">{userProfile.name || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold">{userProfile.phone || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold">{userProfile.email || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-semibold">{userProfile.address || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quarantine Status - now Covid Status */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">COVID Status</h2>
                  <div className={`p-4 rounded-lg border ${getQuarantineStatusColor(userProfile.covidStatus)}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Shield size={20} />
                      <p className="font-semibold text-lg capitalize">
                        {userProfile.covidStatus || 'None'}
                      </p>
                    </div>
                    {/* Simplified for now, quarantineEndDate was not directly stored on user profile in Firestore */}
                    {userProfile.covidStatus === 'positive' && (
                      <div className="space-y-1 mt-3">
                        <p className="text-sm">You are advised to self-isolate.</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled // Email usually can't be changed via profile form in Firebase Auth
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">COVID Status</label>
                  <select
                    name="covidStatus"
                    value={formData.covidStatus || 'negative'} // Renamed from quarantineStatus
                    onChange={handleQuarantineChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="negative">Negative</option>
                    <option value="positive">Positive</option>
                  </select>
                </div>

                {/* Removed quarantine start/end date logic for simplicity with Firestore */}
                {/* {formData.quarantineStatus === 'active' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Start Date</label>
                      <input
                        type="date"
                        name="quarantineStartDate"
                        value={formData.quarantineStartDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">End Date</label>
                      <input
                        type="date"
                        name="quarantineEndDate"
                        value={formData.quarantineEndDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </>
                )} */}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(userProfile); // Revert to original profile
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}