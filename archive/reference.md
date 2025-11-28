import React, { useState, useEffect } from 'react';
import { Home, Droplet, Sparkles, Heart, BookOpen, ShoppingBag, AlertCircle, CheckCircle, User, LogOut } from 'lucide-react';

// Utility functions for localStorage
const storage = {
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('user'),
  getBookings: () => JSON.parse(localStorage.getItem('bookings') || '[]'),
  addBooking: (booking) => {
    const bookings = storage.getBookings();
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
  },
  getExposure: () => JSON.parse(localStorage.getItem('exposure') || 'null'),
  setExposure: (date) => localStorage.setItem('exposure', JSON.stringify(date)),
  clearExposure: () => localStorage.removeItem('exposure')
};

// Simple Router Component
function Router({ children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return React.Children.map(children, child =>
    React.cloneElement(child, { currentPath, navigate })
  );
}

function Route({ path, component: Component, currentPath, navigate }) {
  return currentPath === path ? <Component navigate={navigate} /> : null;
}

// Header Component
function Header({ navigate, user, onLogout }) {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-2xl font-bold hover:text-blue-100">
          <Home size={28} />
          SafeHands
        </button>
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')} className="hover:text-blue-100 flex items-center gap-1">
                <User size={18} />
                Dashboard
              </button>
              <button onClick={onLogout} className="hover:text-blue-100 flex items-center gap-1">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="hover:text-blue-100">Login</button>
              <button onClick={() => navigate('/register')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50">
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

// Home Page
function HomePage({ navigate }) {
  const services = [
    { name: 'Plumbing', icon: Droplet, color: 'bg-blue-100 text-blue-600', desc: 'Emergency repairs & maintenance' },
    { name: 'Cleaning', icon: Sparkles, color: 'bg-purple-100 text-purple-600', desc: 'Professional sanitization' },
    { name: 'Elder Care', icon: Heart, color: 'bg-red-100 text-red-600', desc: 'Compassionate caregiving' },
    { name: 'Tutoring', icon: BookOpen, color: 'bg-green-100 text-green-600', desc: 'Online & in-home lessons' },
    { name: 'Grocery Helper', icon: ShoppingBag, color: 'bg-yellow-100 text-yellow-600', desc: 'Contactless delivery' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SafeHands – Privacy-First Home Services During Pandemic
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with verified service providers while protecting your privacy and health
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg transform hover:scale-105 transition"
          >
            Get Started →
          </button>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service) => (
            <div key={service.name} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 text-center">
              <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <service.icon size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔒 Privacy-First Approach</h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Anonymous Tokens</h3>
              <p className="text-sm">Your identity is protected with unique booking tokens</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Tracing</h3>
              <p className="text-sm">Automated exposure alerts without revealing personal data</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Secure Platform</h3>
              <p className="text-sm">All data encrypted and handled with care</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Register Page
function RegisterPage({ navigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client'
  });

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.password) {
      storage.setUser(formData);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="client"
                  checked={formData.role === 'client'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="mr-2"
                />
                Client
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="provider"
                  checked={formData.role === 'provider'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="mr-2"
                />
                Service Provider
              </label>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-semibold">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

// Login Page
function LoginPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    const user = storage.getUser();
    if (user && user.email === email && user.password === password) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials. Please register first.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button className="text-sm text-blue-600 hover:underline">Forgot password?</button>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-blue-600 hover:underline font-semibold">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

// Dashboard Page
function DashboardPage({ navigate }) {
  const user = storage.getUser();
  const exposure = storage.getExposure();
  const [isAvailable, setIsAvailable] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleReportPositive = () => {
    const exposureDate = new Date();
    storage.setExposure(exposureDate.toISOString());
    navigate('/exposure');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Howdy, {user.name}! 👋</h1>
          <p className="text-gray-600 mb-8">Role: <span className="font-semibold capitalize">{user.role}</span></p>

          {user.role === 'client' ? (
            <div className="space-y-4">
              <button
                onClick={() => navigate('/book')}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
              >
                📅 Book a Service
              </button>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">Your Bookings</h3>
                {storage.getBookings().length === 0 ? (
                  <p className="text-gray-600">No bookings yet.</p>
                ) : (
                  <div className="space-y-2">
                    {storage.getBookings().map((booking, idx) => (
                      <div key={idx} className="bg-white p-4 rounded border">
                        <p className="font-semibold">{booking.service}</p>
                        <p className="text-sm text-gray-600">Date: {booking.date}</p>
                        <p className="text-sm text-blue-600 font-mono">Token: {booking.token}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg font-semibold">Mark as Available for Work</span>
                </label>
                {isAvailable && (
                  <p className="mt-2 text-green-600 flex items-center gap-2">
                    <CheckCircle size={18} />
                    You are now visible to clients
                  </p>
                )}
              </div>

              <button
                onClick={handleReportPositive}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                🦠 Report Positive COVID-19 Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Book Service Page
function BookServicePage({ navigate }) {
  const user = storage.getUser();
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [token, setToken] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const services = ['Plumbing', 'Cleaning', 'Elder Care', 'Tutoring', 'Grocery Helper'];

  const handleSubmit = () => {
    if (service && date) {
      const newToken = `TKN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      const booking = { service, date, token: newToken, timestamp: new Date().toISOString() };
      storage.addBooking(booking);
      setToken(newToken);
      setShowToast(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Book a Service</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a service...</option>
                {services.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
            >
              Book Now
            </button>
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle size={24} />
            <div>
              <p className="font-bold">Booking Confirmed!</p>
              <p className="text-sm">Token: {token}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Exposure Alert Page
function ExposureAlertPage({ navigate }) {
  const exposure = storage.getExposure();
  const quarantineEnd = exposure ? new Date(new Date(exposure).getTime() + 5 * 24 * 60 * 60 * 1000) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-red-50 border-2 border-red-600 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <AlertCircle size={48} className="text-red-600" />
            <h1 className="text-3xl font-bold text-red-900">⚠️ Exposure Alert</h1>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">You've been exposed to COVID-19</h2>
            <p className="text-gray-700 mb-4">
              Based on contact tracing, you may have been exposed to someone who tested positive for COVID-19.
            </p>
            <p className="text-lg font-semibold text-red-900">
              You are in quarantine until: <span className="text-red-600">{quarantineEnd?.toLocaleDateString()}</span>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 mb-6">
            <p className="text-yellow-900 font-semibold">🚫 Bookings are disabled during quarantine</p>
            <p className="text-yellow-800 text-sm mt-2">
              All existing bookings have been notified. You can resume services after your quarantine period ends.
            </p>
          </div>

          <div className="space-y-3 text-gray-700">
            <h3 className="font-bold text-gray-900">What to do:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Stay home and monitor your symptoms</li>
              <li>Get tested for COVID-19</li>
              <li>Contact your healthcare provider if symptoms develop</li>
              <li>Notify close contacts</li>
            </ul>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(storage.getUser());

  const handleLogout = () => {
    storage.clearUser();
    setUser(null);
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      <Router>
        <Header navigate={(path) => {}} user={user} onLogout={handleLogout} />
        <Route path="/" component={HomePage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/book" component={BookServicePage} />
        <Route path="/exposure" component={ExposureAlertPage} />
      </Router>
    </div>
  );
}
