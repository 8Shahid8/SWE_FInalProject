// safehands/src/utils/auth.js
import { getDB, saveDB } from './database';

// A real cryptographic hashing function using the browser's built-in Crypto API
const securePasswordHash = async (password) => {
  console.log('  --- Hashing Process ---');
  console.log('  Raw password received:', password);
  const encoder = new TextEncoder();
  // A "pepper" is a secret value added to the password before hashing.
  const pepper = 'test';
  const stringToHash = password + pepper;
  console.log('  String to hash (password + pepper):', stringToHash);
  const data = encoder.encode(stringToHash);
  console.log('  Encoded data (Uint8Array):', data); // Log the encoded data
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // Convert the buffer to a hex string for easy storage
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('  Generated hashHex:', hashHex);
  console.log('  -----------------------');
  return hashHex;
};

export const mockLogin = async (email, password) => {
  console.log('--- Login Attempt ---');
  console.log('Attempting to log in with Email:', email);
  
  const db = getDB();
  // Hash the entered password to compare it with the stored hash
  const passwordHash = await securePasswordHash(password);
  console.log('Generated Hash from input password:', passwordHash);

  console.log('Searching in Users:', db.users);

  const user = db.users.find(
    (u) => u.email === email && u.passwordHash === passwordHash
  );

  if (user) {
    console.log('SUCCESS: User found!', user);
    console.log('---------------------');
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  
  console.log('FAILURE: User not found with matching email and password hash.');
  console.log('---------------------');
  return { success: false, error: 'Invalid credentials' };
};

export const mockRegister = async (userData) => {
  const db = getDB();
  // Await the result of the secure hashing function
  const passwordHash = await securePasswordHash(userData.password);

  const existingUser = db.users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, error: 'User with this email already exists.' };
  }

  const newUser = {
    id: Date.now(),
    email: userData.email,
    passwordHash, // Store the new secure hash
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
