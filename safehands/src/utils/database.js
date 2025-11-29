// safehands/src/utils/database.js

// Sample data to make the app feel real
const initialDB = {
  // Removed versioning for simplicity in this demo.
  users: [
    {
      id: 1,
      email: 'user@safehands.com',
      password: 'password', // Plain text for demo
      role: 'user',
      covidStatus: 'negative',
    },
    {
      id: 2,
      email: 'admin@safehands.com',
      password: 'admin123', // Plain text for demo
      role: 'admin',
      covidStatus: 'negative',
    },
    {
      id: 3,
      email: 'provider@safehands.com',
      password: 'provider123', // Plain text for demo
      role: 'service-provider',
      covidStatus: 'negative',
    },
  ],
  bookings: [
    { id: 1, userId: 1, service: 'Grocery Delivery', date: '2025-12-10' },
  ],
  contactTrace: [
    { id: 1, userId: 1, location: 'Central Mall', date: '2025-12-09' },
  ],
};

// Function to get the database from localStorage
export const getDB = () => {
  const db = localStorage.getItem('safehandsDB');
  return db ? JSON.parse(db) : null;
};

// Function to save the database to localStorage
export const saveDB = (db) => {
  localStorage.setItem('safehandsDB', JSON.stringify(db));
};

// Call this function once when your app loads (e.g., in main.jsx)
export const seedDatabase = () => {
  if (!getDB()) {
    console.log('Seeding database with initial data...');
    saveDB(initialDB);
  } else {
    console.log('Database already exists. No re-seeding required.');
  }
};