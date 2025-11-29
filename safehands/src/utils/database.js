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
