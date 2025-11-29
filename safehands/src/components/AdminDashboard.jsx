import React, { useState, useEffect } from 'react';
import { Home, Users, Briefcase, Bell, Eye, Edit, PlusCircle, CheckSquare, XSquare, CheckCircle, Clock, LayoutGrid, Menu } from 'lucide-react';
import { getFirestoreUsers, getFirestoreBookings, updateFirestoreUserRole } from '../utils/database'; // Import Firestore functions
import ServiceProviderManagement from './ServiceProviderManagement'; // Assuming this component exists and needs data
import { getCurrentUser } from '../utils/auth'; // Import getCurrentUser to display admin email

// DashboardHome component with clickable cards
const DashboardHome = ({ setActiveTab, usersCount, requestsCount, loading }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('users')}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">{loading ? '...' : usersCount}</p>
        </div>
        <Users size={48} className="text-indigo-400 opacity-50" />
      </div>
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('requests')} // Navigate to requests tab for Total Requests details
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Total Requests</h3>
          <p className="text-3xl font-bold text-blue-600">{loading ? '...' : requestsCount}</p>
        </div>
        <Briefcase size={48} className="text-blue-400 opacity-50" />
      </div>
      {/* Other cards can be updated similarly to use dynamic data */}
      {/* For now, keeping mock values for other dashboard cards if no Firestore data exists */}
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('requests')}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">...</p>
        </div>
        <Clock size={48} className="text-yellow-400 opacity-50" />
      </div>
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('requests')}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Completed Requests</h3>
          <p className="text-3xl font-bold text-purple-600">...</p>
        </div>
        <CheckCircle size={48} className="text-purple-400 opacity-50" />
      </div>
      <div
        className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
        onClick={() => setActiveTab('providers')}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Service Providers</h3>
          <p className="text-3xl font-bold text-orange-600">...</p>
        </div>
        <LayoutGrid size={48} className="text-orange-400 opacity-50" />
      </div>
    </div>
  </div>
);

const UserManagement = ({ users, setUsers, loading }) => { // setUsers prop added
  const currentUser = getCurrentUser(); // Get current admin user details

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    const result = await updateFirestoreUserRole(userId, newRole);
    if (result.success) {
      // Update local state to reflect the change immediately
      setUsers(users.map(user => (user.uid === userId ? { ...user, role: newRole } : user)));
      alert('User role updated successfully!');
    } else {
      alert(`Failed to update user role: ${result.error}`);
    }
  };

  const handleView = (user) => {
    alert(`Viewing user: ${user.name || user.email}\nEmail: ${user.email}\nRole: ${user.role}`);
    console.log('View user:', user);
  };

  if (loading) return <div className="text-center">Loading users...</div>;
  if (!users || users.length === 0) return <div className="text-center">No users found.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        {/* Removed Add New User button as per simplified plan */}
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
            {users.map((user) => (
              <tr key={user.uid}> {/* Use uid as key */}
                <td className="sm:px-2 lg:px-3 py-4 text-sm font-medium text-gray-900">
                  {user.name || 'N/A'}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">
                  {user.email}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                    className="p-1 border rounded-md"
                    disabled={user.uid === currentUser?.uid} // Disable for current admin user
                  >
                    <option value="user">User</option>
                    <option value="service-provider">Service Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                    user.covidStatus === 'positive' ? 'bg-red-100 text-red-800' :
                    user.covidStatus === 'negative' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800' // Assuming other status
                  }`}> 
                    {user.covidStatus}
                  </span>
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleView(user)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View User"
                  >
                    <Eye size={18} />
                  </button>
                  {/* Edit button removed as role change is handled by select */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ServiceRequest = ({ requests, loading }) => {
  if (loading) return <div className="text-center">Loading service requests...</div>;
  if (!requests || requests.length === 0) return <div className="text-center">No service requests found.</div>;

  const [localRequests, setLocalRequests] = useState(requests); // Use local state for updates

  useEffect(() => {
    setLocalRequests(requests); // Update local state if requests prop changes
  }, [requests]);


  const handleViewDetails = (request) => {
    alert(`Viewing request ${request.id}:\nService: ${request.serviceType}\nUser: ${request.userName}\nStatus: ${request.status}`);
    console.log('View request details:', request);
  };

  const handleUpdateStatus = (id, newStatus) => {
    // In a real app, this would update Firestore
    setLocalRequests(localRequests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    alert(`Request ${id} status updated to ${newStatus}`);
    console.log(`Update request ${id} to ${newStatus}`);
  };

  const handleAddRequest = () => {
    alert('Adding a new service request (form would appear here)');
    console.log('Add new request');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Service Requests</h2>
        {/* Removed Add New Request button as per simplified plan */}
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
            {localRequests.map((request) => (
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
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getFirestoreUsers();
        setUsers(fetchedUsers);
        const fetchedBookings = await getFirestoreBookings();
        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome setActiveTab={setActiveTab} usersCount={users.length} requestsCount={bookings.length} loading={loading} />;
      case 'users':
        return <UserManagement users={users} setUsers={setUsers} loading={loading} />;
      case 'requests':
        return <ServiceRequest requests={bookings} loading={loading} />;
      case 'providers':
        // ServiceProviderManagement component might need to be updated to use Firestore data too
        return <ServiceProviderManagement />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} usersCount={users.length} requestsCount={bookings.length} loading={loading} />;
    }
  };

  if (loading) return <div className="text-center p-8">Loading Admin Dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;


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