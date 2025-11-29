// safehands/src/utils/auth.js
import { getDB, saveDB } from './database';

const users = JSON.parse(localStorage.getItem('safehands_users') || '[]'); // This line needs to be updated to use getDB()
// For now, we will directly modify getDB() in database.js to return initialDB.users for simplicity.

export const simpleLogin = (email, password) => {
  const db = getDB(); // Get the entire database including users array
  const allUsers = db.users; // Access the users array

  // Just check if email and password match exactly
  const user = allUsers.find(u => u.email === email && u.password === password);

  if (user) {
    // Create simple session
    const session = {
      userId: user.id,
      email: user.email,
      role: user.role,
      loggedIn: true,
      timestamp: Date.now()
    };
    sessionStorage.setItem('currentSession', JSON.stringify(session));
    return { success: true, user };
  }
  return { success: false, error: 'Invalid email or password' };
};

export const simpleRegister = (userData) => {
  const db = getDB(); // Get the entire database including users array
  const allUsers = db.users; // Access the users array

  // Check if user already exists
  if (allUsers.find(u => u.email === userData.email)) {
    return { success: false, error: 'User with this email already exists.' };
  }

  const newUser = {
    id: Date.now(), // Generate a unique ID
    email: userData.email,
    password: userData.password, // Store plain text for demo
    name: userData.name,
    phone: userData.phone,
    address: userData.address,
    role: userData.role || 'user', // Default role to 'user'
    covidStatus: 'negative',
  };

  allUsers.push(newUser);
  db.users = allUsers; // Update the users array in the db object
  saveDB(db); // Save the entire database

  // Auto-login after registration
  const session = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    loggedIn: true,
    timestamp: Date.now()
  };
  sessionStorage.setItem('currentSession', JSON.stringify(session));

  return { success: true, user: newUser };
};

export const checkAuth = () => {
  const session = JSON.parse(sessionStorage.getItem('currentSession') || 'null');
  return session && session.loggedIn === true;
};

export const logout = () => {
  sessionStorage.removeItem('currentSession');
};

// Adapted from old getCurrentUser for the new session structure
export const getCurrentUser = () => {
  const session = JSON.parse(sessionStorage.getItem('currentSession') || 'null');
  if (session && session.loggedIn) {
    // For getting full user data, we need to find it from the main database
    const db = getDB();
    const user = db.users.find(u => u.id === session.userId);
    return user || null;
  }
  return null;
};

// Check if a user is an admin - adapted for new session structure
export const isAdmin = () => {
  const currentUser = getCurrentUser(); // Get full user data
  return currentUser && currentUser.role === 'admin';
};