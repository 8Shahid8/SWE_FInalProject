import React, { useState } from 'react';
import GroceryDelivery from './GroceryDelivery';
import FoodDelivery from './FoodDelivery';
import ParcelDelivery from './ParcelDelivery';

export default function DeliveryServices() {
  const [activeTab, setActiveTab] = useState('grocery');

  const renderContent = () => {
    switch (activeTab) {
      case 'grocery':
        return <GroceryDelivery />;
      case 'food':
        return <FoodDelivery />;
      case 'parcel':
        return <ParcelDelivery />;
      default:
        return <GroceryDelivery />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Delivery Services</h1>
              <p className="text-gray-600">Your one-stop shop for all delivery needs.</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('grocery')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'grocery'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Grocery Delivery
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'food'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Food Delivery
            </button>
            <button
              onClick={() => setActiveTab('parcel')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'parcel'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Parcel Delivery
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
