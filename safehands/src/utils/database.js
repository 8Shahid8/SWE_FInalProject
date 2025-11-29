// safehands/src/utils/database.js

// Sample data to make the app feel real
const initialDB = {
  version: 4, // <-- Increment version number to force re-seed
  users: [
    {
      id: 1,
      email: 'user@safehands.com',
      passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "password"
      role: 'user',
      covidStatus: 'negative',
    },
    {
      id: 2,
      email: 'admin@safehands.com',
      passwordHash: '3a34027438218423e84915b225739e1b5850654be8e05c865778018a164b2848', // "admin123"
      role: 'admin',
      covidStatus: 'negative',
    },
    {
      id: 3,
      email: 'provider@safehands.com',
      passwordHash: 'e6f3a7434c8922c2069772373333a8d16d41470562e847a984572287f7a26f63', // "provider123"
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
  console.log('--- Aggressive Database Seeding (TEMP DEBUG MODE) ---');
  console.log('Clearing old database and re-seeding...');
  localStorage.removeItem('safehandsDB'); // Aggressively remove old DB
  saveDB(initialDB);
  console.log('Database re-seeded with version:', initialDB.version);
  console.log('----------------------------------------------------');
};
