import React, { useState } from 'react';
import { ChevronDown, Package, Pill, ShieldCheck, Utensils, MapPin, Calendar, ArrowRight, Truck, Clock, Shield, Star } from 'lucide-react';
import SafeHandsAuth from './components/SafeHandsAuth';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'auth'
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const services = [
    {
      id: 'grocery',
      name: 'Grocery Delivery',
      icon: Package,
      color: 'from-red-400 to-pink-400',
      bgColor: 'bg-red-50',
      description: 'Get various grocery delivery from us.'
    },
    {
      id: 'medication',
      name: 'Medication Delivery',
      icon: Truck,
      color: 'from-blue-400 to-indigo-400',
      bgColor: 'bg-blue-50',
      description: 'Any medical facility can be available from home.'
    },
    {
      id: 'covid',
      name: 'Covid 19 Testing',
      icon: ShieldCheck,
      color: 'from-yellow-400 to-amber-400',
      bgColor: 'bg-yellow-50',
      description: 'Test your covid status from professional covid testers'
    },
    {
      id: 'food',
      name: 'Food Delivery',
      icon: Utensils,
      color: 'from-red-400 to-rose-400',
      bgColor: 'bg-rose-50',
      description: 'Wanna eat? We have your back!'
    },
    {
      id: 'parcel',
      name: 'Parcel Delivery',
      icon: MapPin,
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-50',
      description: 'Send or Receive parcel from/to anywhere in the country.'
    }
  ];

  const handleSubmit = () => {
    if (selectedService && selectedDate) {
      alert(`Service: ${services.find(s => s.id === selectedService)?.name}\nDate: ${selectedDate}`);
    }
  };

  const handleServiceCardClick = (serviceId) => {
    setSelectedService(serviceId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (currentPage === 'auth') {
    return <SafeHandsAuth setCurrentPage={setCurrentPage} />;
  }

  return (
    <Layout
      currentPage={currentPage}
      onNavigateToHome={() => setCurrentPage('home')}
      onNavigateToAuth={() => setCurrentPage('auth')}
      onNavigateToAdmin={() => setCurrentPage('admin')}
    >
      {currentPage === 'admin' ? (
        <AdminDashboard />
      ) : (
        <>
          {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob [animation-delay:2s]"></div>
          <div className="absolute top-40 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob [animation-delay:4s]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                Your Daily Essentials, Delivered with Care
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SafeHands
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
              Discover amazing features and services that await you. Your trusted partner for everyday convenience.
            </p>
          </div>

          {/* Service Selection Card */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12">
              <div>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Service Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Choose a Service
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full px-5 py-4 text-left bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-indigo-400 focus:border-indigo-500 focus:outline-none transition-all duration-200 flex items-center justify-between group"
                      >
                        <span className={selectedService ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                          {selectedService
                            ? services.find(s => s.id === selectedService)?.name
                            : 'Choose a Service'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                          {services.map((service) => {
                            const Icon = service.icon;
                            return (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => {
                                  setSelectedService(service.id);
                                  setDropdownOpen(false);
                                }}
                                className="w-full px-5 py-4 flex items-center space-x-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                              >
                                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-gray-800 font-medium group-hover:text-indigo-600">
                                  {service.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        placeholder="mm/dd/yyyy"
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-indigo-400 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!selectedService || !selectedDate}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Book Service</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div id="services" className="py-16 px-4 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Choose from our wide range of convenient services</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceCardClick(service.id)}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                >
                  <div className={`w-20 h-20 ${service.bgColor} rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SafeHands?</h2>
            <p className="text-lg text-gray-600">We're committed to providing the best service experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fast Delivery',
                desc: 'Lightning-fast service at your doorstep. Get your essentials delivered in minutes, not hours.',
                icon: Clock,
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Secure & Safe',
                desc: 'Your safety is our priority. Contactless delivery options and verified service providers.',
                icon: Shield,
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Trusted Quality',
                desc: 'Rated 4.8/5 by thousands of happy customers. Excellence in every delivery.',
                icon: Star,
                gradient: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '100K+', label: 'Deliveries Made' },
              { number: '500+', label: 'Service Partners' },
              { number: '4.8/5', label: 'Average Rating' }
            ].map((stat, idx) => (
              <div key={idx} className="p-6">
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg text-indigo-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
