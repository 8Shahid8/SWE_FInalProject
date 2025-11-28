import React, { useState } from 'react';
import { Home, Users, Briefcase, Bell, Eye, Edit, PlusCircle, CheckSquare, XSquare, CheckCircle, Clock, LayoutGrid, Menu } from 'lucide-react';
import ServiceProviderManagement from './ServiceProviderManagement'; // Import the new component

// Mock User Data
const mockUsers = [
  { id: '1', name: 'Alice Smith', email: 'alice.smith@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'Service Provider', status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'User', status: 'Inactive' },
  { id: '4', name: 'Diana Prince', email: 'diana.prince@example.com', role: 'Admin', status: 'Active' },
  { id: '5', name: 'Eve Adams', email: 'eve.adams@example.com', role: 'User', status: 'Active' },
  { id: '6', name: 'Frank White', email: 'frank.white@example.com', role: 'Service Provider', status: 'Suspended' },
];

// Mock Service Request Data
const mockServiceRequests = [
  { id: 'SR001', serviceType: 'Grocery Delivery', userName: 'Bob Johnson', requestDate: '2025-11-25', status: 'Pending', assignedTo: 'Delivery Team' },
  { id: 'SR002', serviceType: 'Home Cleaning', userName: 'Alice Smith', requestDate: '2025-11-26', status: 'Completed', assignedTo: 'Cleaning Crew A' },
  { id: 'SR003', serviceType: 'Medication Delivery', userName: 'Charlie Brown', requestDate: '2025-11-26', status: 'In Progress', assignedTo: 'Pharmacy Partner' },
  { id: 'SR004', serviceType: 'Laundry Service', userName: 'Diana Prince', requestDate: '2025-11-27', status: 'Pending', assignedTo: 'Laundry Hub' },
  { id: 'SR005', serviceType: 'Covid 19 Testing', userName: 'Eve Adams', requestDate: '2025-11-27', status: 'Cancelled', assignedTo: 'Testing Mobile Unit' },
];

// Helper functions for DashboardHome calculations
const getTotalUsers = () => mockUsers.length;
const getActiveUsers = () => mockUsers.filter(user => user.status === 'Active').length;
const getTotalServiceRequests = () => mockServiceRequests.length;
const getPendingServiceRequests = () => mockServiceRequests.filter(req => req.status === 'Pending').length;
const getCompletedServiceRequests = () => mockServiceRequests.filter(req => req.status === 'Completed').length;


// DashboardHome component with clickable cards
const DashboardHome = ({ setActiveTab }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('users')}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">{getTotalUsers()}</p>
        </div>
        <Users size={48} className="text-indigo-400 opacity-50" />
      </div>
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('users')} // Navigate to users tab for Active Users details
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">{getActiveUsers()}</p>
        </div>
        <Users size={48} className="text-green-400 opacity-50" />
      </div>
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('requests')} // Navigate to requests tab for Total Requests details
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Total Requests</h3>
          <p className="text-3xl font-bold text-blue-600">{getTotalServiceRequests()}</p>
        </div>
        <Briefcase size={48} className="text-blue-400 opacity-50" />
      </div>
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('requests')} // Navigate to requests tab for Pending Requests details
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">{getPendingServiceRequests()}</p>
        </div>
        <Clock size={48} className="text-yellow-400 opacity-50" />
      </div>
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('requests')} // Navigate to requests tab for Completed Requests details
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Completed Requests</h3>
          <p className="text-3xl font-bold text-purple-600">{getCompletedServiceRequests()}</p>
        </div>
        <CheckCircle size={48} className="text-purple-400 opacity-50" />
      </div>

      {/* New Card for Service Providers */} 
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('providers')}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Service Providers</h3>
          <p className="text-3xl font-bold text-orange-600">6</p> {/* Mock count for now */} 
        </div>
        <LayoutGrid size={48} className="text-orange-400 opacity-50" />
      </div>
    </div>
  </div>
);

const UserManagement = () => {
  const handleView = (user) => {
    alert(`Viewing user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
    console.log('View user:', user);
  };

  const handleEdit = (user) => {
    alert(`Editing user: ${user.name}\n(Details for editing would go here)`);
    console.log('Edit user:', user);
  };

  const handleAddUser = () => {
    alert('Adding a new user (form would appear here)');
    console.log('Add new user');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={handleAddUser}
          className="bg-indigo-600 text-white sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <PlusCircle size={18} />
          <span>Add New User</span>
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Name
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Email
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
                Role
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
                Status
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td className="sm:px-2 lg:px-3 py-4 text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">
                  {user.email}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500">
                  {user.role}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                    user.status === 'Active' ? 'bg-green-100 text-green-800' :
                    user.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}> 
                    {user.status}
                  </span>
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleView(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="View User"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-green-600 hover:text-green-900"
                    title="Edit User"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ServiceRequest = () => {
  const [requests, setRequests] = useState(mockServiceRequests);

  const handleViewDetails = (request) => {
    alert(`Viewing request ${request.id}:\nService: ${request.serviceType}\nUser: ${request.userName}\nStatus: ${request.status}`);
    console.log('View request details:', request);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    alert(`Request ${id} status updated to ${newStatus}`);
    console.log(`Update request ${id} to ${newStatus}`);
  };

  const handleAddRequest = () => {
    alert('Adding a new service request (form would appear here)');
    console.log('Add new service request');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Service Requests</h2>
        <button
          onClick={handleAddRequest}
          className="bg-indigo-600 text-white sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <PlusCircle size={18} />
          <span>Add New Request</span>
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Request ID
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Service Type
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                User
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Request Date
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Status
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="sm:px-2 lg:px-3 py-4 text-sm font-medium text-gray-900">
                  {request.id}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">
                  {request.serviceType}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">
                  {request.userName}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500">
                  {request.requestDate}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}> 
                    {request.status}
                  </span>
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(request)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  {request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'Completed')}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Mark as Completed"
                      >
                        <CheckSquare size={18} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'Cancelled')}
                        className="text-red-600 hover:text-red-900"
                        title="Mark as Cancelled"
                      >
                        <XSquare size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome setActiveTab={setActiveTab} />;
      case 'users':
        return <UserManagement />;
      case 'requests':
        return <ServiceRequest />;
      case 'providers':
        return <ServiceProviderManagement />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform ${ 
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:w-64 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Admin</h1>
        </div>
        <nav>
          <ul>
            <NavItem icon={Home} text="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} tabName="home" toggleSidebar={toggleSidebar} />
            <NavItem icon={Users} text="Users" activeTab={activeTab} setActiveTab={setActiveTab} tabName="users" toggleSidebar={toggleSidebar} />
            <NavItem icon={Briefcase} text="Service Requests" activeTab={activeTab} setActiveTab={setActiveTab} tabName="requests" toggleSidebar={toggleSidebar} />
            <NavItem icon={LayoutGrid} text="Service Providers" activeTab={activeTab} setActiveTab={setActiveTab} tabName="providers" toggleSidebar={toggleSidebar} />
          </ul>
        </nav>
      </aside>
      <main className={`flex-1 p-6 ${isSidebarOpen ? 'hidden' : 'block'}`}>
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button className="md:hidden p-2" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
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
  );
}

const NavItem = ({ icon: Icon, text, activeTab, setActiveTab, tabName, toggleSidebar }) => {
  const handleClick = () => {
    setActiveTab(tabName);
    // Only close sidebar on mobile after clicking an item
    if (window.innerWidth < 768) { // Assuming 768px is the 'md' breakpoint
      toggleSidebar();
    }
  };
  return (
    <li
      className={`p-4 cursor-pointer flex items-center ${activeTab === tabName ? 'bg-indigo-100 text-indigo-600' : ''}`}
      onClick={handleClick}
    >
      {Icon && <Icon className="mr-3" />}
      {text}
    </li>
  );
};
