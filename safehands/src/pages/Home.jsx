import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Package, Pill, ShieldCheck, Utensils, MapPin, Calendar, ArrowRight, Menu, X, Truck, Clock, Shield, Star, Shirt, Sparkles, PawPrint } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { addFirestoreBooking } from '../utils/database';

const generateAnonymousToken = () => {
    return 'TKN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default function Home() {
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const currentUser = getCurrentUser();
    const navigate = useNavigate();

    const services = [
        { id: 'delivery-services', name: 'Delivery Services', icon: Package, color: 'from-red-400 to-pink-400', bgColor: 'bg-red-50', description: 'Groceries, food, and parcels delivered to your door.' },
        { id: 'medication', name: 'Medication Delivery', icon: Truck, color: 'from-blue-400 to-indigo-400', bgColor: 'bg-blue-50', description: 'Any medical facility can be available from home.' },
        { id: 'covid', name: 'Covid 19 Testing', icon: ShieldCheck, color: 'from-yellow-400 to-amber-400', bgColor: 'bg-yellow-50', description: 'Test your covid status from professional covid testers' },
        { id: 'home-cleaning', name: 'Home Cleaning', icon: Sparkles, color: 'from-green-400 to-teal-400', bgColor: 'bg-green-50', description: 'Professional home cleaning services.' },
        { id: 'laundry', name: 'Laundry Service', icon: Shirt, color: 'from-purple-400 to-indigo-400', bgColor: 'bg-purple-50', description: 'Convenient laundry and dry cleaning services.' },
        { id: 'pet-care', name: 'Pet Care Services', icon: PawPrint, color: 'from-orange-400 to-amber-400', bgColor: 'bg-orange-50', description: 'Reliable and caring services for your beloved pets.' }
    ];

    const handleServiceCardClick = (serviceId) => {
        navigate(`/${serviceId}`);
    };

    return (
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
                            { title: 'Fast Delivery', desc: 'Lightning-fast service at your doorstep. Get your essentials delivered in minutes, not hours.', icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
                            { title: 'Secure & Safe', desc: 'Your safety is our priority. Contactless delivery options and verified service providers.', icon: Shield, gradient: 'from-green-500 to-emerald-500' },
                            { title: 'Trusted Quality', desc: 'Rated 4.8/5 by thousands of happy customers. Excellence in every delivery.', icon: Star, gradient: 'from-yellow-500 to-orange-500' }
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
        </>
    );
}
