// safehands/src/utils/auth.js
import { auth, db } from '../firebase'; // Import Firebase auth and db instances
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { addAuditLog } from './database'; // Import addAuditLog

// --- Firebase Authentication Functions ---

// Register a new user with email and password
export const firebaseRegister = async (userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: userData.name || '',
      role: userData.role || 'user', // Default role 'user'
      covidStatus: 'negative',
      uid: user.uid,
    });
    
    // R7: Audit Log for Registration
    await addAuditLog('User Registration', { email: userData.email, role: userData.role || 'user' });

    // Optionally update the user's display name in Firebase Auth profile
    // await updateProfile(user, { displayName: userData.name });

    return { success: true, user: { uid: user.uid, email: user.email, role: userData.role || 'user' } };
  } catch (error) {
    // console.error('Firebase Register Error:', error.code, error.message);
    return { success: false, error: error.message };
  }
};

// Log in an existing user with email and password
export const firebaseLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user role from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      // R7: Audit Log for Login
      await addAuditLog('User Login', { email: email, role: userData.role });
      return { success: true, user: { uid: user.uid, email: user.email, role: userData.role } };
    } else {
      // console.warn('User data not found in Firestore for UID:', user.uid);
      return { success: false, error: 'User profile not found.' };
    }
  } catch (error) {
    // console.error('Firebase Login Error:', error.code, error.message);
    return { success: false, error: error.message };
  }
};

// Log out the current user
export const firebaseLogout = async () => {
  try {
    // R7: Audit Log for Logout
    await addAuditLog('User Logout');
    await signOut(auth);
    return { success: true };
  } catch (error) {
    // console.error('Firebase Logout Error:', error.code, error.message);
    return { success: false, error: error.message };
  }
};

// --- Authentication State Management and Helpers ---

let currentAuthUser = null; // Firebase Auth user object
let currentProfile = null; // Full user profile from Firestore

// Listener for Firebase Auth state changes
onAuthStateChanged(auth, async (user) => {
  currentAuthUser = user;
  if (user) {
    // Fetch user profile from Firestore on login
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      currentProfile = userDocSnap.data();
      currentProfile.uid = user.uid; // Add UID to profile for convenience
    } else {
      currentProfile = { uid: user.uid, email: user.email, role: 'user' }; // Fallback if profile not found
      // console.warn('Firestore profile not found for new user, using default:', currentProfile);
    }
  } else {
    currentProfile = null; // Clear profile on logout
  }
  // console.log("Auth state changed:", currentProfile); // For debugging
});

// Check if a user is currently authenticated
export const checkAuth = () => {
  return !!currentAuthUser;
};

// Get the currently authenticated user's profile (including role)
export const getCurrentUser = () => {
  return currentProfile; // Returns null if not authenticated, or the full profile
};

// Check if the current user has a specific role
export const hasRole = (requiredRoles) => {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }
  return user.role === requiredRoles;
};

// Export isAdmin for backward compatibility, now uses hasRole
export const isAdmin = () => {
  return hasRole('admin');
};

export const isServiceProvider = () => {
  return hasRole('service-provider');
};
