import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home, Package, MapPin, User, LogOut, Menu, X, Shield } from 'lucide-react';

// Pages
import HomePage from './pages/Home';
import ServicesPage from './pages/Services';
import ProfilePage from './pages/Profile';

// Components
import Login from './components/Login';
import ContactTracing from './components/ContactTracing';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

// Service Components
import GroceryDelivery from './components/GroceryDelivery';
import MedicationDelivery from './components/MedicationDelivery';
import Covid19Testing from './components/Covid19Testing';
import FoodDelivery from './components/FoodDelivery';
import ParcelDelivery from './components/ParcelDelivery';

// Utils
import { isAuthenticated, logout, getCurrentUser, isAdmin } from './utils/auth';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setUser(null);
    window.location.href = '/login';
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuth) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Navigation Component
  const Navigation = () => {
    const navLinks = [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/services', icon: Package, label: 'Services' },
      { path: '/contact-tracing', icon: MapPin, label: 'Contact Tracing' },
      { path: '/profile', icon: User, label: 'Profile' }
    ];

    if (isAdmin()) {
      navLinks.push({ path: '/admin', icon: Shield, label: 'Admin' });
    }

    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <Shield size={28} />
              <span className="hidden md:block">Quarantine Manager</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600"
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  };

  return (
    <BrowserRouter>
      {isAuth && <Navigation />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/" /> : <Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        {/* Service Booking Routes */}
        <Route
          path="/services/grocery"
          element={
            <ProtectedRoute>
              <GroceryDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/medication"
          element={
            <ProtectedRoute>
              <MedicationDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/testing"
          element={
            <ProtectedRoute>
              <Covid19Testing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/food"
          element={
            <ProtectedRoute>
              <FoodDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/parcel"
          element={
            <ProtectedRoute>
              <ParcelDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact-tracing"
          element={
            <ProtectedRoute>
              <ContactTracing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;