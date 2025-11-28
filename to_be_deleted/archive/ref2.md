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
    <header className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 text-white shadow-xl">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-2xl font-bold hover:text-teal-100 transition-all">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Home size={28} />
          </div>
          SafeHands
        </button>
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')} className="hover:text-teal-100 flex items-center gap-2 transition-all hover:scale-105">
                <User size={18} />
                Dashboard
              </button>
              <button onClick={onLogout} className="hover:text-teal-100 flex items-center gap-2 transition-all hover:scale-105">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="hover:text-teal-100 transition-all hover:scale-105">Login</button>
              <button onClick={() => navigate('/register')} className="bg-white text-teal-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-50 transition-all hover:scale-105 shadow-lg">
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
    { name: 'Plumbing', icon: Droplet, color: 'bg-teal-100 text-teal-700', desc: 'Emergency repairs & maintenance' },
    { name: 'Cleaning', icon: Sparkles, color: 'bg-cyan-100 text-cyan-700', desc: 'Professional sanitization' },
    { name: 'Elder Care', icon: Heart, color: 'bg-emerald-100 text-emerald-700', desc: 'Compassionate caregiving' },
    { name: 'Tutoring', icon: BookOpen, color: 'bg-sky-100 text-sky-700', desc: 'Online & in-home lessons' },
    { name: 'Grocery Helper', icon: ShoppingBag, color: 'bg-teal-100 text-teal-700', desc: 'Contactless delivery' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🛡️ Privacy-First Platform
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SafeHands – Privacy-First Home Services During Pandemic
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with verified service providers while protecting your privacy and health with cutting-edge contact tracing technology
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-cyan-700 shadow-xl transform hover:scale-105 transition-all"
          >
            Get Started →
          </button>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service) => (
            <div key={service.name} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 text-center transform hover:scale-105 border border-teal-100">
              <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                <service.icon size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">🔒 Privacy-First Approach</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">Anonymous Tokens</h3>
              <p className="text-sm text-teal-50">Your identity is protected with unique booking tokens</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">Contact Tracing</h3>
              <p className="text-sm text-teal-50">Automated exposure alerts without revealing personal data</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">Secure Platform</h3>
              <p className="text-sm text-teal-50">All data encrypted and handled with care</p>
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-teal-100">
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-3 rounded-2xl mb-4">
            <User size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join SafeHands today</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Role</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value="client"
                  checked={formData.role === 'client'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="sr-only"
                />
                <div className={`border-2 rounded-xl p-4 text-center transition-all ${formData.role === 'client' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-teal-300'}`}>
                  <p className="font-semibold">Client</p>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value="provider"
                  checked={formData.role === 'provider'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="sr-only"
                />
                <div className={`border-2 rounded-xl p-4 text-center transition-all ${formData.role === 'provider' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-teal-300'}`}>
                  <p className="font-semibold">Service Provider</p>
                </div>
              </label>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Register
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-teal-100">
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-3 rounded-2xl mb-4">
            <User size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to your SafeHands account</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline">Forgot password?</button>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Login
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-teal-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-2xl">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Howdy, {user.name}! 👋</h1>
              <p className="text-gray-600 mt-1">
                Role: <span className="font-semibold capitalize text-teal-700">{user.role}</span>
              </p>
            </div>
          </div>

          {user.role === 'client' ? (
            <div className="space-y-6">
              <button
                onClick={() => navigate('/book')}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-5 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                📅 Book a Service
              </button>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                  <BookOpen size={24} className="text-teal-600" />
                  Your Bookings
                </h3>
                {storage.getBookings().length === 0 ? (
                  <p className="text-gray-600 text-center py-6">No bookings yet. Book your first service!</p>
                ) : (
                  <div className="space-y-3">
                    {storage.getBookings().map((booking, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border-2 border-teal-100 hover:border-teal-300 transition-all shadow-sm">
                        <p className="font-bold text-lg text-gray-900">{booking.service}</p>
                        <p className="text-sm text-gray-600 mt-1">📅 Date: {booking.date}</p>
                        <p className="text-sm text-teal-700 font-mono mt-2 bg-teal-50 px-3 py-1 rounded inline-block">
                          🎫 Token: {booking.token}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-lg font-semibold text-gray-900">Mark as Available for Work</span>
                </label>
                {isAvailable && (
                  <p className="mt-3 text-teal-700 flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-lg">
                    <CheckCircle size={20} />
                    You are now visible to clients
                  </p>
                )}
              </div>

              <button
                onClick={handleReportPositive}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-5 rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-teal-100">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-3 rounded-2xl mb-4">
              <BookOpen size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Book a Service</h2>
            <p className="text-gray-600 mt-2">Schedule your appointment</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
              >
                <option value="">Select a service...</option>
                {services.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book Now
            </button>
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <CheckCircle size={28} />
            <div>
              <p className="font-bold text-lg">Booking Confirmed!</p>
              <p className="text-sm text-emerald-50">Token: {token}</p>
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
