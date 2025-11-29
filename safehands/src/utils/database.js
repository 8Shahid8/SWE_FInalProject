// safehands/src/utils/database.js
import { db } from '../firebase'; // Import Firestore instance
import { collection, getDocs, doc, getDoc, setDoc, addDoc, query, where } from 'firebase/firestore';

// --- Firestore Interaction Functions ---

// Function to get a single user's profile by UID
export const getFirestoreUserProfile = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return { id: userDocSnap.id, ...userDocSnap.data() };
  }
  return null;
};

// Function to get all users (e.g., for Admin Dashboard)
export const getFirestoreUsers = async () => {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return userList;
};

// Placeholder for other Firestore interactions (e.g., bookings, contact tracing)
export const getFirestoreBookings = async () => {
  const bookingsCol = collection(db, 'bookings');
  const bookingSnapshot = await getDocs(bookingsCol);
  const bookingList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return bookingList;
};

// Function to add a new booking
export const addFirestoreBooking = async (bookingData) => {
  try {
    const bookingsCol = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCol, bookingData);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to update a user's role
export const updateFirestoreUserRole = async (userId, newRole) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { role: newRole }, { merge: true }); // Merge to update only the role field
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }
};

// Function to get all bookings for a specific service provider
export const getFirestoreBookingsForProvider = async (providerId) => {
  try {
    const bookingsCol = collection(db, 'bookings');
    const q = query(bookingsCol, where("providerId", "==", providerId));
    const bookingSnapshot = await getDocs(q);
    const bookingList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return bookingList;
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    return []; // Return an empty array on error
  }
};

// Function to update the status of a booking
export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await setDoc(bookingDocRef, { status: newStatus }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: error.message };
  }
};
