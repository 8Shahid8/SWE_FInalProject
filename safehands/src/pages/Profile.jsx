import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Shield, Calendar, AlertCircle } from 'lucide-react';
import { auth } from '../firebase'; // Import Firebase auth instance
import { getFirestoreUserProfile, addAuditLog } from '../utils/database'; // Function to get user profile from Firestore and logging
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
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReportPositive = async () => {
    if (window.confirm("Are you sure you want to report a positive COVID-19 status? This action cannot be undone by you and will be sent for review.")) {
      setLoading(true);
      try {
        const newStatus = { 
          covidStatus: 'positive',
          covidStatusReportedAt: new Date()
        };
        const userDocRef = doc(db, 'users', userProfile.id);
        await setDoc(userDocRef, newStatus, { merge: true });
        
        // R7: Audit Log for self-reporting positive status
        await addAuditLog('User Reported Positive', { userId: userProfile.id });

        setUserProfile(prev => ({ ...prev, ...newStatus }));
        setFormData(prev => ({ ...prev, ...newStatus }));
        alert('Your status has been updated to positive.');
      } catch (err) {
        console.error("Error reporting positive status:", err);
        alert('Failed to report status: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (userProfile && userProfile.id) {
        // Ensure covidStatus is not overwritten by the edit form
        const { covidStatus, covidStatusReportedAt, ...updatableFormData } = formData;
        const userDocRef = doc(db, 'users', userProfile.id);
        await setDoc(userDocRef, updatableFormData, { merge: true }); // Merge to update only changed fields
        setUserProfile(prev => ({ ...prev, ...updatableFormData })); // Update local state
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
      case 'positive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quarantined': return 'bg-red-100 text-red-800 border-red-200';
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
          {userProfile.covidStatus === 'quarantined' && (
            <div className="bg-red-50 border-b border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-semibold">Active Quarantine</p>
                <p className="text-red-700 text-sm">
                  You are under quarantine. Please follow health guidelines and avoid booking new services.
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

                {/* COVID Status */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">COVID-19 Status</h2>
                  <div className={`p-4 rounded-lg border ${getQuarantineStatusColor(userProfile.covidStatus)}`}>
                    <div className="flex items-center gap-3">
                      <Shield size={20} />
                      <p className="font-semibold text-lg capitalize">
                        {userProfile.covidStatus || 'Not Reported'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                  {(!userProfile.covidStatus || userProfile.covidStatus === 'negative') && (
                    <button
                      onClick={handleReportPositive}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <AlertCircle size={20} /> Report Positive Status
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form inputs for personal info */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Address</label>
                  <textarea name="address" value={formData.address || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" required />
                </div>

                {/* Form buttons */}
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => { setIsEditing(false); setFormData(userProfile); }} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
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