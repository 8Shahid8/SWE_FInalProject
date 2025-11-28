// safehands/src/utils/database.js

// Sample data to make the app feel real
const initialDB = {
  users: [
    {
      id: 1,
      email: 'user@safehands.com',
      // This is 'password' encoded with our fake hash
      passwordHash: 'cGFzc3dvcmRzYWZlaGFuZHNJbml0aWFsU2FsdA==',
      role: 'user',
      covidStatus: 'negative',
    },
    {
      id: 2,
      email: 'admin@safehands.com',
      // This is 'admin123' encoded with our fake hash
      passwordHash: 'YWRtaW4xMjNzYWZlaGFuZHNJbml0aWFsU2FsdA==',
      role: 'admin',
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
  }
};
