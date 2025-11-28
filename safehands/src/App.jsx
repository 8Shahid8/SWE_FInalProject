// In your App.jsx or router file
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SafeHandsAuth from './components/SafeHandsAuth';
import Profile from './pages/Profile';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';
import ContactTracing from './components/ContactTracing';
import DeliveryServices from './components/DeliveryServices';
import MedicationDelivery from './components/MedicationDelivery';
import Covid19Testing from './components/Covid19Testing';
import HomeCleaning from './components/HomeCleaning';
import LaundryService from './components/LaundryService';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import PetCare from './components/PetCare';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<SafeHandsAuth />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact-tracing" element={<ContactTracing />} />
          <Route path="/delivery-services" element={<DeliveryServices />} />
          <Route path="/medication" element={<MedicationDelivery />} />
          <Route path="/covid" element={<Covid19Testing />} />
          <Route path="/home-cleaning" element={<HomeCleaning />} />
          <Route path="/laundry" element={<LaundryService />} />
          <Route path="/pet-care" element={<PetCare />} />


          {/* Protected Routes for ALL logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            {/* Add other user routes here */}
          </Route>

          {/* Protected Route for Service Providers */}
          <Route element={<ProtectedRoute roles={['service-provider']} />}>
            <Route path="/provider-dashboard" element={<ServiceProviderDashboard />} />
          </Route>

          {/* Protected Route for ADMINS ONLY */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;