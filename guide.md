# 🎨 **FRONTEND-FIRST BUILD PLAN** (Backend-Ready Architecture)

Perfect approach! Let's build a **clean, modular frontend** with mock data that will be **super easy** to swap with Firebase later.

---

## 🏗️ **ARCHITECTURE STRATEGY**

```
Frontend (Now)          →    Backend (Later)
─────────────────────        ─────────────────
Mock Auth Service      →    Firebase Auth
Mock Data (useState)   →    Firestore queries
Local functions        →    Firebase functions
```

**Key principle:** All data operations go through **service files** that we'll swap later.

---

## ⚡ **HOUR-BY-HOUR FRONTEND BUILD**

### **HOUR 1: Fresh Setup**

```bash
# 1. Create project
npm create vite@latest everyday-services -- --template react
cd everyday-services

# 2. Install dependencies
npm install react-router-dom

# 3. Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Start dev server
npm run dev
```

**Configure Tailwind:**

**`tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**`src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

---

### **HOUR 2: Project Structure & Mock Services**

**Create this folder structure:**
```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── user/
│   │   ├── BookingForm.jsx
│   │   ├── BookingList.jsx
│   │   └── ExposureAlert.jsx
│   └── provider/
│       ├── ProviderBookings.jsx
│       └── CovidReport.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   └── NotFound.jsx
├── services/
│   ├── authService.js       ← Mock now, Firebase later
│   ├── bookingService.js    ← Mock now, Firebase later
│   └── tracingService.js    ← Mock now, Firebase later
├── context/
│   └── AuthContext.jsx
├── utils/
│   ├── mockData.js
│   └── tokenGenerator.js
├── App.jsx
└── main.jsx
```

**Create Mock Services (These will be swapped with Firebase later):**

**`src/services/authService.js`:**
```javascript
// MOCK SERVICE - Will be replaced with Firebase Auth later
let currentUser = null;

const mockUsers = [
  { id: '1', email: 'user@test.com', password: '123456', role: 'user', quarantineStatus: 'clear' },
  { id: '2', email: 'provider@test.com', password: '123456', role: 'provider', quarantineStatus: 'clear' },
  { id: '3', email: 'admin@test.com', password: '123456', role: 'admin', quarantineStatus: 'clear' },
];

export const authService = {
  // Register new user
  register: async (email, password, role) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      role,
      quarantineStatus: 'clear',
      createdAt: new Date()
    };

    mockUsers.push(newUser);
    currentUser = { ...newUser };
    delete currentUser.password;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return currentUser;
  },

  // Login
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    currentUser = { ...user };
    delete currentUser.password;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return currentUser;
  },

  // Logout
  logout: async () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
  },

  // Get current user
  getCurrentUser: () => {
    if (!currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    }
    return currentUser;
  },

  // Update user quarantine status
  updateQuarantineStatus: async (userId, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.quarantineStatus = status;
      if (currentUser && currentUser.id === userId) {
        currentUser.quarantineStatus = status;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    }
  }
};

// FIREBASE REPLACEMENT NOTES:
// register → createUserWithEmailAndPassword + setDoc(users collection)
// login → signInWithEmailAndPassword
// logout → signOut
// getCurrentUser → onAuthStateChanged
// updateQuarantineStatus → updateDoc
```

**`src/services/bookingService.js`:**
```javascript
// MOCK SERVICE - Will be replaced with Firestore later
let bookings = [];
let interactions = [];

export const bookingService = {
  // Create new booking
  createBooking: async (userId, service, userEmail) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const token = `TKN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const booking = {
      id: Date.now().toString(),
      userId,
      userEmail,
      providerId: 'mock-provider-123', // In real app, user selects
      service,
      interactionToken: token,
      bookingDate: new Date(),
      status: 'active',
      covidCompliant: true
    };

    bookings.push(booking);

    // Log interaction
    interactions.push({
      id: Date.now().toString(),
      userId,
      providerId: booking.providerId,
      token,
      timestamp: new Date(),
      service
    });

    return booking;
  },

  // Get user bookings
  getUserBookings: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return bookings.filter(b => b.userId === userId);
  },

  // Get provider bookings
  getProviderBookings: async (providerId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return bookings.filter(b => b.providerId === providerId);
  },

  // Get all interactions for a provider (for contact tracing)
  getProviderInteractions: async (providerId, daysBack = 14) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    return interactions.filter(i =>
      i.providerId === providerId &&
      new Date(i.timestamp) >= cutoffDate
    );
  }
};

// FIREBASE REPLACEMENT NOTES:
// createBooking → addDoc(bookings collection) + addDoc(interactions collection)
// getUserBookings → query(where('userId', '==', userId))
// getProviderBookings → query(where('providerId', '==', providerId))
// getProviderInteractions → query(where('providerId', '==', providerId), where('timestamp', '>=', cutoffDate))
```

**`src/services/tracingService.js`:**
```javascript
// MOCK SERVICE - Will be replaced with Firestore later
let exposures = [];

export const tracingService = {
  // Report COVID positive and flag exposures
  reportCovidPositive: async (providerId, authService, bookingService) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get all interactions from last 14 days
    const recentInteractions = await bookingService.getProviderInteractions(providerId, 14);

    // Flag all exposed users
    const exposedUserIds = new Set();

    for (const interaction of recentInteractions) {
      exposures.push({
        id: Date.now().toString() + Math.random(),
        userId: interaction.userId,
        exposureToken: interaction.token,
        exposureDate: interaction.timestamp,
        reportedBy: providerId,
        reportedAt: new Date()
      });

      exposedUserIds.add(interaction.userId);
    }

    // Update quarantine status for exposed users
    for (const userId of exposedUserIds) {
      await authService.updateQuarantineStatus(userId, 'quarantined');
    }

    // Update provider status
    await authService.updateQuarantineStatus(providerId, 'positive');

    return {
      exposedCount: exposedUserIds.size,
      exposures: Array.from(exposedUserIds)
    };
  },

  // Check if user has exposure alerts
  getUserExposures: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return exposures.filter(e => e.userId === userId);
  }
};

// FIREBASE REPLACEMENT NOTES:
// reportCovidPositive → batch write to exposures collection + updateDoc on users
// getUserExposures → query(where('userId', '==', userId))
```

**`src/utils/mockData.js`:**
```javascript
export const SERVICES = [
  { id: '1', name: 'Home Cleaning', icon: '🧹' },
  { id: '2', name: 'Plumbing', icon: '🔧' },
  { id: '3', name: 'Electrician', icon: '⚡' },
  { id: '4', name: 'Pest Control', icon: '🐛' },
  { id: '5', name: 'Carpentry', icon: '🔨' },
];

export const MOCK_PROVIDERS = [
  { id: '1', name: 'John Doe', service: 'Home Cleaning', rating: 4.8 },
  { id: '2', name: 'Jane Smith', service: 'Plumbing', rating: 4.9 },
  { id: '3', name: 'Mike Johnson', service: 'Electrician', rating: 4.7 },
];
```

---

### **HOUR 3: Authentication Context**

**`src/context/AuthContext.jsx`:**
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
    return user;
  };

  const register = async (email, password, role) => {
    const user = await authService.register(email, password, role);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isUser: user?.role === 'user',
    isProvider: user?.role === 'provider',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// FIREBASE REPLACEMENT NOTES:
// useEffect → onAuthStateChanged listener
// login/register/logout → Firebase Auth methods
// user state → automatically managed by onAuthStateChanged
```

---

### **HOUR 4: Authentication Components**

**`src/components/auth/Login.jsx`:**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Everyday Services</h1>
          <p className="text-gray-600">Safe services during COVID-19</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Register
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">Test Accounts:</p>
          <p className="text-xs text-gray-500">User: user@test.com / 123456</p>
          <p className="text-xs text-gray-500">Provider: provider@test.com / 123456</p>
          <p className="text-xs text-gray-500">Admin: admin@test.com / 123456</p>
        </div>
      </div>
    </div>
  );
}
```

**`src/components/auth/Register.jsx`:**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-teal-500 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join Everyday Services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User (Book Services)</option>
              <option value="provider">Service Provider</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 hover:underline font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### **HOUR 5: Layout Components**

**`src/components/layout/Navbar.jsx`:**
```javascript
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Everyday Services</h1>
            <span className="px-3 py-1 bg-blue-700 rounded-full text-sm">
              {user?.role === 'user' && '👤 User'}
              {user?.role === 'provider' && '🔧 Provider'}
              {user?.role === 'admin' && '👨‍💼 Admin'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**`src/components/layout/ProtectedRoute.jsx`:**
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
```

---

I'll continue with the remaining components in the next message. Should I proceed with:
- User components (BookingForm, BookingList, ExposureAlert)
- Provider components
- Dashboard page
- App routing setup

Let me know and I'll continue! 🚀
