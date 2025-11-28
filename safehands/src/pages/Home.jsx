import { Link } from 'react-router-dom';
import { ShoppingCart, Pill, TestTube, Utensils, Package, MapPin, Shield } from 'lucide-react';

export default function Home() {
  const services = [
    { icon: ShoppingCart, name: 'Grocery Delivery', path: '/services/grocery', color: 'bg-green-500' },
    { icon: Pill, name: 'Medication Delivery', path: '/services/medication', color: 'bg-blue-500' },
    { icon: TestTube, name: 'COVID-19 Testing', path: '/services/testing', color: 'bg-red-500' },
    { icon: Utensils, name: 'Food Delivery', path: '/services/food', color: 'bg-orange-500' },
    { icon: Package, name: 'Parcel Delivery', path: '/services/parcel', color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Quarantine Management System</h1>
          <p className="text-xl mb-8">Safe, contactless services for those in quarantine</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/services" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Book Services
            </Link>
            <Link to="/contact-tracing" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
              Contact Tracing
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.path}
              to={service.path}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <service.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
              <p className="text-gray-600">Quick and contactless delivery to your doorstep</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Contactless</h3>
              <p className="text-gray-600">All deliveries follow strict safety protocols</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Tracing</h3>
              <p className="text-gray-600">Manual check-in system to track exposure</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Essential Services</h3>
              <p className="text-gray-600">Everything you need delivered to you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
