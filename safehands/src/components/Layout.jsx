import React, { useState } from 'react';
import { Package, Menu, X } from 'lucide-react';

export default function Layout({ children, onNavigateToHome, onNavigateToAuth, onNavigateToAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button onClick={onNavigateToHome} className="flex items-center space-x-3 focus:outline-none">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SafeHands
                </span>
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={onNavigateToAuth}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-4 py-2 rounded-lg"
              >
                Login/Sign Up
              </button>
              <button
                onClick={onNavigateToAdmin}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-4 py-2 rounded-lg"
              >
                Admin
              </button>
            </div>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-3 px-4 space-y-2">
            <button
              onClick={() => { onNavigateToAuth(); setIsMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Login/Sign Up
            </button>
            <button
              onClick={() => { onNavigateToAdmin(); setIsMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600"
            >
              Admin
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
