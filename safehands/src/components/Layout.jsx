import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { Package, Menu, X, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth instance
import { firebaseLogout } from '../utils/auth'; // Our Firebase auth functions
import { getFirestoreUserProfile } from '../utils/database'; // Function to get user profile from Firestore
import { QuarantineContext } from '../context/QuarantineContext'; // Import the context

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Local state for the authenticated user profile
  const [loadingUser, setLoadingUser] = useState(true); // Loading state for user profile
  const { isQuarantined } = useContext(QuarantineContext); // Get quarantine status from context
  const navigate = useNavigate();

  useEffect(() => {
    // This listener handles the real-time authentication state from Firebase.
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log('[Layout Debug] Auth state changed. Firebase user:', firebaseUser);
      setLoadingUser(true); // Start loading whenever auth state changes.

      if (firebaseUser) {
        // If a Firebase user is detected, fetch their full profile from Firestore.
        // This is more reliable than relying on a separate listener.
        const profile = await getFirestoreUserProfile(firebaseUser.uid);
        console.log('[Layout Debug] Fetched user profile:', profile);
        setUser(profile);
      } else {
        // No user is logged in.
        console.log('[Layout Debug] No user logged in.');
        setUser(null);
      }
      
      setLoadingUser(false); // Stop loading once the profile is fetched or confirmed null.
    });

    return () => unsubscribe(); // Clean up the listener on component unmount.
  }, []);

  // R6: Session Management - Auto-logout after inactivity
  useEffect(() => {
    if (!user) return; // Don't run the timer if no user is logged in

    let activityTimeout;
    const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes for testing. Should be 30 mins in production.

    const resetTimer = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        alert("You have been logged out due to inactivity.");
        handleLogout();
      }, SESSION_TIMEOUT_MS);
    };

    const activityEvents = ['mousemove', 'keypress', 'click', 'scroll'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize timer

    return () => {
      // Cleanup: remove event listeners and clear timeout
      clearTimeout(activityTimeout);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]); // Rerun this effect if the user logs in or out

  const handleLogout = async () => {
    await firebaseLogout();
    navigate('/login');
  };

  if (loadingUser) {
    // While we are determining the auth state and fetching the profile,
    // it's better to show a neutral or loading state to prevent UI flashing.
    return <div>Loading User...</div>; // Or a more sophisticated spinner component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 relative z-20">
              <Link to={user && user.role === 'admin' ? '/admin' : (user && user.role === 'service-provider' ? '/provider-dashboard' : '/')} className="flex items-center space-x-3 focus:outline-none group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:text-indigo-800 transition-colors duration-200">
                  SafeHands
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-3 relative z-20">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-indigo-600 font-bold px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Login/Sign Up
                </Link>
              )}
              <Link
                to="/contact-tracing"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200"
              >
                Contact Tracing
              </Link>
            </div>

            <button
              className="md:hidden text-gray-700 relative z-20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-3 px-4 space-y-2 relative z-10">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-left py-2 px-3 rounded-lg text-red-700 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login/Sign Up
              </Link>
            )}
            <Link
              to="/contact-tracing"
              className="block w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Tracing
            </Link>
          </div>
        )}
      </nav>

      {isQuarantined && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold flex items-center"><AlertTriangle className="mr-2" />Quarantine Alert</p>
          <p>You have been identified as a recent contact of a COVID-19 positive individual. For the safety of the community, your ability to book new services has been temporarily disabled.</p>
        </div>
      )}

      <main className="p-4 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">SafeHands</span>
          </div>
          <p className="text-gray-400 mb-6">Your trusted partner for everyday services</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact Us</a>
          </div>
          <p className="text-gray-500 mt-8">© 2025 SafeHands. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}