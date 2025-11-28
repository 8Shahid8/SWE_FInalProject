import React, { useState } from 'react';
import { Package, Menu, X } from 'lucide-react';

export default function Layout({ children, currentPage, onNavigateToHome, onNavigateToAuth, onNavigateToAdmin, onNavigateToContactTracing }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 relative z-20">
              <button onClick={() => { console.log('Logo clicked - Navigating to Home'); onNavigateToHome(); }} className="flex items-center space-x-3 focus:outline-none group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:text-indigo-800 transition-colors duration-200">
                  SafeHands
                </span>
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-3 relative z-20">
              <button
                onClick={() => { console.log('Login/Sign Up clicked'); onNavigateToAuth(); }}
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200`}
              >
                Login/Sign Up
              </button>
              <button
                onClick={() => { console.log('Admin clicked'); onNavigateToAdmin(); }}
                className={`bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200`}
              >
                Admin
              </button>
              <button
                onClick={() => { console.log('Contact Tracing clicked'); onNavigateToContactTracing(); }}
                className={`bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200`}
              >
                Contact Tracing
              </button>
            </div>

            <button
              className="md:hidden text-gray-700 relative z-20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-3 px-4 space-y-2 relative z-10">
            <button
              onClick={() => { console.log('Login/Sign Up clicked (mobile)'); onNavigateToAuth(); setIsMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600`}
            >
              Login/Sign Up
            </button>
            <button
              onClick={() => { console.log('Admin clicked (mobile)'); onNavigateToAdmin(); setIsMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600`}
            >
              Admin
            </button>
            <button
              onClick={() => { console.log('Contact Tracing clicked (mobile)'); onNavigateToContactTracing(); setIsMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:bg-blue-600`}
            >
              Contact Tracing
            </button>
          </div>
        )}
      </nav>

      {children}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">SafeHands</span>
          </div>
          <p className="text-gray-400 mb-6">Your trusted partner for everyday services</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact Us</a>
          </div>
          <p className="text-gray-500 mt-8">© 2025 SafeHands. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}