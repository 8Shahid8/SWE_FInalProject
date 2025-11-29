// safehands/src/utils/database.js
import { db, auth } from '../firebase'; // Import Firestore instance
import { collection, getDocs, doc, getDoc, setDoc, addDoc, query, where, onSnapshot } from 'firebase/firestore';

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

// Function to update a user's covid status
export const updateUserCovidStatus = async (userId, newStatus) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { covidStatus: newStatus }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating user covid status:", error);
    return { success: false, error: error.message };
  }
};

// Real-time listener for a provider's bookings
export const onBookingsUpdateForProvider = (providerId, callback) => {
  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, where("providerId", "==", providerId));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const bookingList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(bookingList);
  }, (error) => {
    console.error("Error listening to bookings:", error);
    callback([]); // Send empty array on error
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
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

// Function to update the provider assigned to a booking
export const updateBookingProvider = async (bookingId, newProviderId) => {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await setDoc(bookingDocRef, { providerId: newProviderId, status: 'assigned' }, { merge: true }); // Also update status to 'assigned'
    return { success: true };
  } catch (error) {
    console.error("Error updating booking provider:", error);
    return { success: false, error: error.message };
  }
};

// --- R7: Audit Logging ---
export const addAuditLog = async (action, details = {}) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("Audit log attempted without authenticated user.");
      return; // Or handle as an error
    }

    const auditCol = collection(db, 'audit_logs');
    await addDoc(auditCol, {
      action: action,
      userId: user.uid,
      timestamp: new Date(),
      details: details
    });
  } catch (error) {
    console.error("Error writing to audit log:", error);
  }
};

// Function for providers to report a positive test
export const addExposureReport = async (reportData) => {
    try {
        const reportsCol = collection(db, 'exposure_reports');
        await addDoc(reportsCol, reportData);
        return { success: true };
    } catch (error) {
        console.error("Error creating exposure report:", error);
        return { success: false, error: error.message };
    }
};

// Function for admins to get all exposure reports
export const getExposureReports = async () => {
  const reportsCol = collection(db, 'exposure_reports');
  const reportSnapshot = await getDocs(reportsCol);
  const reportList = reportSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return reportList;
};

// Function to get recent bookings for a provider (for contact tracing)
export const getRecentBookingsForProvider = async (providerId) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, where("providerId", "==", providerId), where("bookingDate", ">=", twoWeeksAgo));
  const bookingSnapshot = await getDocs(q);
  const bookingList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return bookingList;
};

// Function to create an exposure record for a user
export const createExposureRecord = async (clientId) => {
    try {
        const exposureRef = doc(db, 'exposures', clientId);
        await setDoc(exposureRef, {
            status: 'active',
            exposureDate: new Date(),
            lastUpdated: new Date(),
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error creating exposure record:", error);
        return { success: false, error: error.message };
    }
};

// Function to update the status of an exposure report
export const updateExposureReportStatus = async (reportId, status) => {
    try {
        const reportRef = doc(db, 'exposure_reports', reportId);
        await setDoc(reportRef, { status: status }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error updating exposure report status:", error);
        return { success: false, error: error.message };
    }
};

// Real-time listener for a user's exposure status
export const onExposureUpdateForUser = (userId, callback) => {
  const exposureDocRef = doc(db, 'exposures', userId);

  const unsubscribe = onSnapshot(exposureDocRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null); // No exposure record found
    }
  }, (error) => {
    console.error("Error listening to exposure status:", error);
    callback(null);
  });

  return unsubscribe;
};
