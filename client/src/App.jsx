import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import KumbhAIAssistant from './components/KumbhAIAssistant';
import Home from './pages/Home';
import FindStays from './pages/FindStays';
import PropertyDetails from './pages/PropertyDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import HealthAssistance from './pages/HealthAssistance';
import Emergency from './pages/Emergency';
import HowItWorks from './pages/HowItWorks';
import ForOwners from './pages/ForOwners';
import OwnerDashboard from './pages/OwnerDashboard';
import AddPropertyWizard from './pages/AddPropertyWizard';
import AdminDashboard from './pages/AdminDashboard';
import AdminPropertyReview from './pages/AdminPropertyReview';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export const App = () => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="stays" element={<FindStays />} />
                <Route path="stays/:id" element={<PropertyDetails />} />
                <Route path="health" element={<HealthAssistance />} />
                <Route path="emergency" element={<Emergency />} />
                <Route path="bookings/:id/confirmation" element={<BookingConfirmation />} />
                
                {/* Pilgrim Bookings Route */}
                <Route
                  path="bookings/my"
                  element={
                    <ProtectedRoute allowedRoles={['pilgrim', 'owner', 'admin']}>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />

                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="for-owners" element={<ForOwners />} />
                <Route path="help" element={<Help />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* Owner Protected Routes */}
                <Route
                  path="owner/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="owner/properties/new"
                  element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                      <AddPropertyWizard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="owner/properties/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                      <AddPropertyWizard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/verification-console"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/properties/:id"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPropertyReview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/verifications/:id"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPropertyReview />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>

            {/* Global Floating AI Assistant Guide */}
            <KumbhAIAssistant />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
};

export default App;


