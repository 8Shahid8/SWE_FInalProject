import React, { useState } from 'react';
import { Home, Users, Briefcase, Bell } from 'lucide-react';
import Layout from './Layout';

// Placeholder components for the different sections
const DashboardHome = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">User Management</h3>
        <p className="text-gray-600">Manage users and their roles.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Service Provider</h3>
        <p className="text-gray-600">Manage service providers.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Service Request</h3>
        <p className="text-gray-600">View and manage service requests.</p>
      </div>
    </div>
  </div>
);

const UserManagement = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">User Management</h2>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>User management table goes here.</p>
    </div>
  </div>
);

const ServiceRequest = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Service Requests</h2>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Service request table goes here.</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'users':
        return <UserManagement />;
      case 'requests':
        return <ServiceRequest />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-indigo-600">Admin</h1>
          </div>
          <nav>
            <ul>
              <li
                className={`p-4 cursor-pointer flex items-center ${activeTab === 'home' ? 'bg-indigo-100 text-indigo-600' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Home className="mr-3" />
                Dashboard
              </li>
              <li
                className={`p-4 cursor-pointer flex items-center ${activeTab === 'users' ? 'bg-indigo-100 text-indigo-600' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users className="mr-3" />
                Users
              </li>
              <li
                className={`p-4 cursor-pointer flex items-center ${activeTab === 'requests' ? 'bg-indigo-100 text-indigo-600' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                <Briefcase className="mr-3" />
                Service Requests
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Bell />
              <div>
                <p className="font-semibold">Admin User</p>
                <p className="text-sm text-gray-500">admin@safehands.com</p>
              </div>
            </div>
          </header>
          {renderContent()}
        </main>
      </div>
    </Layout>
  );
}
