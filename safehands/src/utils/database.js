// safehands/src/utils/database.js

// Sample data to make the app feel real
const initialDB = {
  version: 5, // <-- Increment version number to force re-seed
  users: [
    {
      id: 1,
      email: 'user@safehands.com',
      passwordHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // "password" + "test"
      role: 'user',
      covidStatus: 'negative',
    },
    {
      id: 2,
      email: 'admin@safehands.com',
      passwordHash: '4e223c8810c95066444b037305d21098e9c0c169229f3d646b149b819f39e31d', // "admin123" + "test"
      role: 'admin',
      covidStatus: 'negative',
    },
    {
      id: 3,
      email: 'provider@safehands.com',
      passwordHash: '40b2f15e81f5c6978413b5ef213ae4c896940d9d683dd366914b306b8ed08b49', // "provider123" + "test"
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
