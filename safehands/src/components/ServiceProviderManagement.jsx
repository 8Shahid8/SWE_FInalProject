import React, { useState } from 'react';
import { Users, Briefcase, PlusCircle, Eye, Edit } from 'lucide-react';

// Mock Service Provider Data
const mockServiceProviders = [
  { id: 'SP001', name: 'CleanSweep Services', serviceType: 'Home Cleaning', status: 'Active', contact: 'clean@example.com' },
  { id: 'SP002', name: 'QuickWash Laundry', serviceType: 'Laundry Service', status: 'Active', contact: 'wash@example.com' },
  { id: 'SP003', name: 'MediDeliver Pharmacy', serviceType: 'Medication Delivery', status: 'Active', contact: 'medi@example.com' },
  { id: 'SP004', name: 'PetPals Care', serviceType: 'Pet Care Services', status: 'Active', contact: 'pet@example.com' },
  { id: 'SP005', name: 'FastTrack Logistics', serviceType: 'Parcel Delivery', status: 'Active', contact: 'fast@example.com' },
  { id: 'SP006', name: 'GourmetGo Foods', serviceType: 'Food Delivery', status: 'Inactive', contact: 'gourmet@example.com' },
];

export default function ServiceProviderManagement() {
  const [providers, setProviders] = useState(mockServiceProviders);

  const handleView = (provider) => {
    alert(`Viewing provider: ${provider.name}\nService: ${provider.serviceType}\nStatus: ${provider.status}\nContact: ${provider.contact}`);
    console.log('View provider:', provider);
  };

  const handleEdit = (provider) => {
    alert(`Editing provider: ${provider.name}\n(Details for editing would go here)`);
    console.log('Edit provider:', provider);
  };

  const handleAddProvider = () => {
    alert('Adding a new service provider (form would appear here)');
    console.log('Add new provider');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Service Provider Management</h2>
        <button
          onClick={handleAddProvider}
          className="bg-indigo-600 text-white sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <PlusCircle size={18} />
          <span>Add New Provider</span>
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Name
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Service Type
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Contact
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Status
              </th>
              <th scope="col" className="sm:px-2 lg:px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td className="sm:px-2 lg:px-3 py-4 text-sm font-medium text-gray-900 truncate">
                  {provider.name}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">
                  {provider.serviceType}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm text-gray-500 truncate">
                  {provider.contact}
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${provider.status === 'Active' ? 'bg-green-100 text-green-800' : provider.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {provider.status}
                  </span>
                </td>
                <td className="sm:px-2 lg:px-3 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleView(provider)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="View Provider"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(provider)}
                    className="text-green-600 hover:text-green-900"
                    title="Edit Provider"
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
}
