// safehands/src/utils/auth.js
import { getDB, saveDB } from './database';

// This is our FAKE hashing function for the demo.
// It uses Base64 to make it look like a hash.
const simulatePasswordHash = (password) => {
  // In a real app, this would be a slow, strong hashing algorithm like bcrypt.
  // We use btoa (Base64) which is NOT secure, but demonstrates the principle.
  return btoa(password + 'safehandsInitialSalt');
};

export const mockLogin = (email, password) => {
  const db = getDB();
  const passwordHash = simulatePasswordHash(password);

  const user = db.users.find(
    (u) => u.email === email && u.passwordHash === passwordHash
  );

  if (user) {
    // On successful login, save user to sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: 'Invalid credentials' };
};

export const mockRegister = (userData) => {
  const db = getDB();
  const passwordHash = simulatePasswordHash(userData.password);

  const existingUser = db.users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, error: 'User with this email already exists.' };
  }

  const newUser = {
    id: Date.now(),
    email: userData.email,
    passwordHash,
    name: userData.name,
    phone: userData.phone,
    address: userData.address,
    role: 'user',
    covidStatus: 'negative',
  };

  db.users.push(newUser);
  saveDB(db);

  sessionStorage.setItem('currentUser', JSON.stringify(newUser));
  return { success: true, user: newUser };
};

export const logout = () => {
  sessionStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Check if a user is an admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};