import React, { useState, useEffect } from 'react';
import { Home, Users, Briefcase, Bell, Eye, Edit, CheckCircle, Clock, LayoutGrid, Menu, AlertCircle } from 'lucide-react';
import { getFirestoreUsers, getFirestoreBookings, updateFirestoreUserRole, updateBookingProvider, addAuditLog, createExposureRecord, updateUserCovidStatus, removeExposureRecord } from '../utils/database'; // Import Firestore functions
import ServiceProviderManagement from './ServiceProviderManagement';
import { getCurrentUser } from '../utils/auth';

// DashboardHome component with clickable cards
const DashboardHome = ({ setActiveTab, usersCount, requestsCount, pendingRequestsCount, completedRequestsCount, serviceProvidersCount, loading }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* Cards remain the same */}
      <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between" onClick={() => setActiveTab('users')}>
        <div><h3 className="text-lg font-semibold text-gray-700">Total Users</h3><p className="text-3xl font-bold text-indigo-600">{loading ? '...' : usersCount}</p></div>
        <Users size={48} className="text-indigo-400 opacity-50" />
      </div>
      <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between" onClick={() => setActiveTab('requests')}>
        <div><h3 className="text-lg font-semibold text-gray-700">Total Requests</h3><p className="text-3xl font-bold text-blue-600">{loading ? '...' : requestsCount}</p></div>
        <Briefcase size={48} className="text-blue-400 opacity-50" />
      </div>
      <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between" onClick={() => setActiveTab('requests')}>
        <div><h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3><p className="text-3xl font-bold text-yellow-600">{loading ? '...' : pendingRequestsCount}</p></div>
        <Clock size={48} className="text-yellow-400 opacity-50" />
      </div>
      <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between" onClick={() => setActiveTab('requests')}>
        <div><h3 className="text-lg font-semibold text-gray-700">Completed Requests</h3><p className="text-3xl font-bold text-purple-600">{loading ? '...' : completedRequestsCount}</p></div>
        <CheckCircle size={48} className="text-purple-400 opacity-50" />
      </div>
      <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex items-center justify-between" onClick={() => setActiveTab('providers')}>
        <div><h3 className="text-lg font-semibold text-gray-700">Service Providers</h3><p className="text-3xl font-bold text-orange-600">{loading ? '...' : serviceProvidersCount}</p></div>
        <LayoutGrid size={48} className="text-orange-400 opacity-50" />
      </div>
    </div>
  </div>
);

const UserManagement = ({ users, setUsers, loading }) => {
  const currentUser = getCurrentUser();

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    const result = await updateFirestoreUserRole(userId, newRole);
    if (result.success) {
      await addAuditLog('User Role Changed', { targetUserId: userId, newRole: newRole });
      setUsers(users.map(user => (user.uid === userId ? { ...user, role: newRole } : user)));
      alert('User role updated successfully!');
    } else {
      alert(`Failed to update user role: ${result.error}`);
    }
  };

  const handleFreeFromQuarantine = async (userId) => {
    if (!window.confirm(`Are you sure you want to free this user from quarantine?`)) {
      return;
    }
    const result = await updateUserCovidStatus(userId, 'negative');
    if (result.success) {
      await removeExposureRecord(userId); // Also remove the exposure record
      await addAuditLog('User Freed from Quarantine', { targetUserId: userId });
      setUsers(users.map(user => (user.uid === userId ? { ...user, covidStatus: 'negative' } : user)));
      alert('User has been freed from quarantine.');
    } else {
      alert(`Failed to free user from quarantine: ${result.error}`);
    }
  };

  const handleView = (user) => {
    alert(`Viewing user: ${user.name || user.email}\nEmail: ${user.email}\nRole: ${user.role}`);
  };

  if (loading) return <div className="text-center">Loading users...</div>;
  if (!users || users.length === 0) return <div className="text-center">No users found.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Name</th>
              <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Email</th>
              <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">Role</th>
              <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">Status</th>
              <th className="sm:px-2 lg:px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.uid}>
                <td className="sm:px-2 lg:px-3 py-4 text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">{user.email}</td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500">
                  <select value={user.role} onChange={(e) => handleRoleChange(user.uid, e.target.value)} className="p-1 border rounded-md" disabled={user.uid === currentUser?.uid}>
                    <option value="user">User</option>
                    <option value="service-provider">Service Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.covidStatus === 'positive' ? 'bg-yellow-100 text-yellow-800' :
                    user.covidStatus === 'quarantined' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.covidStatus || 'Negative'}
                  </span>
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-right text-sm font-medium">
                  {user.covidStatus === 'quarantined' && (
                    <button onClick={() => handleFreeFromQuarantine(user.uid)} className="text-green-600 hover:text-green-900 mr-2" title="Free from Quarantine"><AlertTriangle size={18} /></button>
                  )}
                  <button onClick={() => handleView(user)} className="text-indigo-600 hover:text-indigo-900" title="View User"><Eye size={18} /></button>
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
    // This component remains largely the same
    const [localRequests, setLocalRequests] = useState(requests);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [loadingProviders, setLoadingProviders] = useState(true);

    useEffect(() => { setLocalRequests(requests); }, [requests]);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoadingProviders(true);
            const users = await getFirestoreUsers();
            const providers = users.filter(user => user.role === 'service-provider' || user.role === 'pending-provider');
            setServiceProviders(providers);
            setLoadingProviders(false);
        };
        fetchProviders();
    }, []);

    const handleAssignProvider = async (bookingId, newProviderId) => {
        const providerName = serviceProviders.find(p => p.uid === newProviderId)?.name || newProviderId;
        if (!window.confirm(`Are you sure you want to assign this booking to ${providerName}?`)) return;
        
        const result = await updateBookingProvider(bookingId, newProviderId);
        if (result.success) {
            await addAuditLog('Booking Assigned', { bookingId: bookingId, newProviderId: newProviderId });
            setLocalRequests(localRequests.map(req => (req.id === bookingId ? { ...req, providerId: newProviderId, status: 'assigned' } : req)));
            alert('Provider assigned successfully!');
        } else {
            alert(`Failed to assign provider: ${result.error}`);
        }
    };

    if (loading || loadingProviders) return <div className="text-center">Loading service requests...</div>;
    if (!localRequests || localRequests.length === 0) return <div className="text-center">No service requests found.</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Service Requests</h2>
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    {/* Table Head */}
                    <thead className="bg-gray-50"><tr>
                        <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Request ID</th>
                        <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Service Type</th>
                        <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">User</th>
                        <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Provider</th>
                        <th className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">Status</th>
                        <th className="sm:px-2 lg:px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                    </tr></thead>
                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">{localRequests.map((request) => (
                        <tr key={request.id}>
                            <td className="sm:px-2 lg:px-3 py-4 text-sm font-medium text-gray-900">{request.id}</td>
                            <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">{request.serviceType}</td>
                            <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">{request.userName}</td>
                            <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500">
                                { (request.providerId && request.providerId !== 'DUMMY_PROVIDER_UID_FOR_TESTING' && request.providerId !== 'unassigned') ? ( serviceProviders.find(p => p.uid === request.providerId)?.name || 'Assigned' ) : (
                                    <select value={'unassigned'} onChange={(e) => handleAssignProvider(request.id, e.target.value)} className="p-1 border rounded-md" disabled={loadingProviders || request.status !== 'confirmed'}>
                                        <option value="unassigned">Assign Provider</option>
                                        {serviceProviders.map(provider => (<option key={provider.uid} value={provider.uid}>{provider.name || provider.email}</option>))}
                                    </select>
                                )}
                            </td>
                            <td className="sm:px-2 lg:px-3 py-4 text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{request.status}</span></td>
                            <td className="sm:px-2 lg:px-3 py-4 text-right text-sm font-medium"><button onClick={() => alert('Viewing details')} className="text-indigo-600 hover:text-indigo-900" title="View Details"><Eye size={18} /></button></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};

const PositiveStatusReports = ({ users, loading, onUserQuarantined }) => {

  const handleQuarantineUser = async (user) => {
    if (!window.confirm(`Are you sure you want to quarantine user ${user.name || user.email}? This will restrict their account.`)) {
      return;
    }
    
    // 1. Create an exposure record to trigger client-side UI changes
    await createExposureRecord(user.id);
    
    // 2. Update the user's status to 'quarantined'
    await updateUserCovidStatus(user.id, 'quarantined');
    
    // 3. Log the admin action
    await addAuditLog('User Quarantined by Admin', { targetUserId: user.id });

    // 4. Update the local state via callback
    onUserQuarantined(user.id);

    alert(`User ${user.name || user.email} has been quarantined.`);
  };

  if (loading) return <div className="text-center">Loading positive status reports...</div>;
  if (!users || users.length === 0) return <div className="text-center p-6 bg-white rounded-lg shadow">No users have reported a positive status.</div>;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Positive Status Reports</h2>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Reported</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.covidStatusReportedAt ? new Date(user.covidStatusReportedAt.seconds * 1000).toLocaleString() : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'}> 
                    {user.covidStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleQuarantineUser(user)}
                    className="bg-indigo-600 text-white py-1 px-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    Acknowledge & Quarantine
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [positiveStatusUsers, setPositiveStatusUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [completedRequestsCount, setCompletedRequestsCount] = useState(0);
  const [serviceProvidersCount, setServiceProvidersCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getFirestoreUsers();
        setUsers(fetchedUsers);
        
        const positiveUsers = fetchedUsers.filter(u => u.covidStatus === 'positive');
        setPositiveStatusUsers(positiveUsers);

        const fetchedBookings = await getFirestoreBookings();
        setBookings(fetchedBookings);

        const pending = fetchedBookings.filter(b => b.status === 'confirmed' || b.status === 'assigned').length;
        const completed = fetchedBookings.filter(b => b.status === 'completed').length;
        const providers = fetchedUsers.filter(user => user.role === 'service-provider').length;

        setPendingRequestsCount(pending);
        setCompletedRequestsCount(completed);
        setServiceProvidersCount(providers);

      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserQuarantined = (quarantinedUserId) => {
    // Update the main user list to reflect the new 'quarantined' status
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === quarantinedUserId ? { ...u, covidStatus: 'quarantined' } : u)
    );
    // Remove the user from the 'positive' list as they have been processed
    setPositiveStatusUsers(prevUsers => 
      prevUsers.filter(u => u.id !== quarantinedUserId)
    );
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome setActiveTab={setActiveTab} usersCount={users.length} requestsCount={bookings.length} pendingRequestsCount={pendingRequestsCount} completedRequestsCount={completedRequestsCount} serviceProvidersCount={serviceProvidersCount} loading={loading} />;
      case 'users':
        return <UserManagement users={users} setUsers={setUsers} loading={loading} />;
      case 'requests':
        return <ServiceRequest requests={bookings} loading={loading} />;
      case 'providers':
        return <ServiceProviderManagement />;
      case 'positive-reports':
        return <PositiveStatusReports users={positiveStatusUsers} loading={loading} onUserQuarantined={handleUserQuarantined} />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} usersCount={users.length} requestsCount={bookings.length} loading={loading} />;
    }
  };

  if (loading) return <div className="text-center p-8">Loading Admin Dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 transition-transform duration-200 ease-in-out`}>
        <div className="p-6"><h1 className="text-2xl font-bold text-indigo-600">Admin</h1></div>
        <nav>
          <ul>
            <NavItem icon={Home} text="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} tabName="home" toggleSidebar={toggleSidebar} />
            <NavItem icon={Users} text="Users" activeTab={activeTab} setActiveTab={setActiveTab} tabName="users" toggleSidebar={toggleSidebar} />
            <NavItem icon={Briefcase} text="Service Requests" activeTab={activeTab} setActiveTab={setActiveTab} tabName="requests" toggleSidebar={toggleSidebar} />
            <NavItem icon={AlertCircle} text="Positive Reports" activeTab={activeTab} setActiveTab={setActiveTab} tabName="positive-reports" toggleSidebar={toggleSidebar} />
            <NavItem icon={LayoutGrid} text="Service Providers" activeTab={activeTab} setActiveTab={setActiveTab} tabName="providers" toggleSidebar={toggleSidebar} />
          </ul>
        </nav>
      </aside>
      <main className={`flex-1 p-6 ${isSidebarOpen ? 'hidden' : 'block'}`}>
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button className="md:hidden p-2" onClick={toggleSidebar}><Menu size={24} /></button>
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
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };
  return (
    <li className={`p-4 cursor-pointer flex items-center ${activeTab === tabName ? 'bg-indigo-100 text-indigo-600' : ''}`} onClick={handleClick}>
      {Icon && <Icon className="mr-3" />}
      {text}
    </li>
  );
};
