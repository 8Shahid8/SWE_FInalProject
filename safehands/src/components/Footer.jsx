import React from 'react';
import { Package } from 'lucide-react';

export default function Footer() {
  return (
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
  );
}
