# GitHub Pages Deployment & Frontend Simulation Plan

This document outlines a complete solution to build and demonstrate a functional and secure-feeling application that can be deployed entirely on **GitHub Pages**. Since GitHub Pages cannot run a backend server, we will simulate all backend functionality (database, authentication, authorization) on the client-side using JavaScript and the browser's `localStorage`.

---

## 1. The "Fake" Database & Initial Data

We will use the browser's `localStorage` as our database. A seeding script will populate it with initial data, so the application feels live from the first moment.

### **File:** `safehands/src/utils/database.js`
Create this new file to manage all database interactions.

```javascript
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

// Call this function once when your app loads
export const seedDatabase = () => {
  if (!getDB()) {
    console.log('Seeding database with initial data...');
    saveDB(initialDB);
  }
};
```

### **Action:** Seed the Database
In your main application entry point, import and call `seedDatabase()` to ensure the data exists when the app loads.

#### **File:** `safehands/src/main.jsx`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { seedDatabase } from './utils/database'; // <-- Import

// Seed the database on initial load
seedDatabase(); // <-- Add this line

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 2. "Secure" Password Checking & Authentication

This logic will handle user login and simulate password hashing. This is crucial for demonstrating that you are not storing passwords in plain text.

### **File:** `safehands/src/utils/auth.js`
```javascript
// safehands/src/utils/auth.js
import { getDB } from './database';

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

export const logout = () => {
  sessionStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};
```

---

## 3. RBAC with a Protected Route

A `ProtectedRoute` component is the standard way to implement Role-Based Access Control (RBAC) in a React application. It will protect routes from unauthorized access.

### **File:** `safehands/src/components/ProtectedRoute.jsx`
```javascript
// safehands/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser, isAdmin } from '../utils/auth';

const ProtectedRoute = ({ adminOnly = false }) => {
  const currentUser = getCurrentUser();

  // 1. If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the route is for admins only and the user is not an admin, redirect
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />; // Or to an "Unauthorized" page
  }

  // 3. If checks pass, render the child component
  return <Outlet />;
};

export default ProtectedRoute;
```

### **Usage:** In Your Router
Update your router configuration (likely in `App.jsx`) to use the `ProtectedRoute` for both general and admin-only routes.

```javascript
// In your App.jsx or router file
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './components/Login';
import Profile from './pages/Profile';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        {/* Protected Routes for ALL logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          {/* Add other user routes here */}
        </Route>

        {/* Protected Routes for ADMINS ONLY */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 4. Conditional Checking & Admin View

These examples show how to use the authentication state and database to display conditional UI and create a privileged admin view.

### Example: Conditional UI in `Profile.jsx`
This shows a user-specific alert based on their data.

```javascript
// In your Profile.jsx component
import { getCurrentUser } from '../utils/auth';

const user = getCurrentUser();

return (
  <div>
    <h1>Profile for {user.email}</h1>
    {user.covidStatus === 'positive' && (
      <div style={{ color: 'red', border: '2px solid red', padding: '10px' }}>
        <h2>Quarantine Alert!</h2>
        <p>Your record indicates a positive status. Please follow health guidelines.</p>
      </div>
    )}
  </div>
);
```

### Example: `AdminDashboard.jsx` Component
This component reads the entire "database" to display information that only an admin should see.

```javascript
// safehands/src/components/AdminDashboard.jsx
import React from 'react';
import { getDB } from '../utils/database';

const AdminDashboard = () => {
  const db = getDB(); // Get the entire "database"

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <h2>All Users</h2>
      <pre>{JSON.stringify(db.users, null, 2)}</pre>

      <h2>All Bookings</h2>
      <pre>{JSON.stringify(db.bookings, null, 2)}</pre>
    </div>
  );
};

export default AdminDashboard;
```

---

## 5. How to Demo This Solution

Follow these steps to present your project effectively:

1.  **Run the app** and open it in your browser.
2.  **Open Browser DevTools** (`F12` or `Ctrl+Shift+I`) and go to the **Application** tab.
3.  Under `Storage > Local Storage`, click on your site's URL. Show the `safehandsDB` key and its JSON value. Point out that the `passwordHash` field is not plain text.
4.  **Log in as the regular user:**
    *   Email: `user@safehands.com`
    *   Password: `password`
5.  Navigate to the user's profile. Attempt to manually navigate to the `/admin` URL and show how you are redirected away, proving the admin route is protected.
6.  **Log out.**
7.  **Log in as the admin user:**
    *   Email: `admin@safehands.com`
    *   Password: `admin123`
8.  **Navigate to the `/admin` page.** Show the dashboard containing data for ALL users. This demonstrates successful Role-Based Access Control.
