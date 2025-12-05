import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';

// Public Pages
import Landing from './pages/Landing';

// Farmer Pages
import FarmerDashboard from './pages/farmers/FarmerDashboard';
import Listings from './pages/farmers/Listings';
import Offers from './pages/farmers/Offers';
import AIInsights from './pages/farmers/AIInsights';
import Deliveries from './pages/farmers/Deliveries';
import Earnings from './pages/farmers/Earnings';
import Orders from './pages/farmers/Orders';
import Profile from './pages/farmers/Profile';

// Driver Pages (ONLY 3 pages)

import DeliveryDetail from './pages/Driver/DeliveryDetail';
import DriverEarnings from './pages/Driver/DriverEarnings';
import DriverProfile from './pages/Driver/DriverProfile';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import Marketplace from './pages/buyer/Marketplace';
import BuyerOrders from './pages/buyer/BuyerOrders';
import BuyerProfile from './pages/buyer/BuyerProfile';

// NGO Pages
import NGODashboard from './pages/ngo/NGODashboard';

// Shared
import LearningHub from './pages/shared/LearningHub';
import Messages from './pages/shared/Messages';
import Sustainability from './pages/shared/Sustainability';

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status"></div>
          <p className="text-secondary fw-semibold">Loading...</p>
        </div>
      </div>
    );

  const withLayoutIfAuth = (page, allowedRoles = null) => {
    if (!user) return <Navigate to="/" replace />;

   if (allowedRoles && !allowedRoles.includes(user.role)) {
  if (user.role === 'farmer') return <Navigate to="/dashboard" replace />;
  if (user.role === 'buyer') return <Navigate to="/buyer/dashboard" replace />;
  if (user.role === 'ngo') return <Navigate to="/ngo/dashboard" replace />;
  if (user.role === 'driver') return <Navigate to="/driver/delivery/default" replace />;

  return <Navigate to="/" replace />;
}

    return <Layout>{page}</Layout>;
  };

  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Landing />} />

      {/* Farmer */}
      <Route path="/dashboard" element={withLayoutIfAuth(<FarmerDashboard />, ['farmer'])} />
      <Route path="/listings" element={withLayoutIfAuth(<Listings />, ['farmer'])} />
      <Route path="/offers" element={withLayoutIfAuth(<Offers />, ['farmer'])} />
      <Route path="/insights" element={withLayoutIfAuth(<AIInsights />, ['farmer'])} />
      <Route path="/deliveries" element={withLayoutIfAuth(<Deliveries />, ['farmer'])} />
      <Route path="/earnings" element={withLayoutIfAuth(<Earnings />, ['farmer'])} />
      <Route path="/orders" element={withLayoutIfAuth(<Orders />, ['farmer'])} />
      <Route path="/profile" element={withLayoutIfAuth(<Profile />, ['farmer'])} />

      {/* Buyer */}
      <Route path="/buyer/dashboard" element={withLayoutIfAuth(<BuyerDashboard />, ['buyer'])} />
      <Route path="/marketplace" element={withLayoutIfAuth(<Marketplace />, ['buyer'])} />
      <Route path="/buyer/orders" element={withLayoutIfAuth(<BuyerOrders />, ['buyer'])} />
      <Route path="/buyer/profile" element={withLayoutIfAuth(<BuyerProfile />, ['buyer'])} />

      {/* NGO */}
      <Route path="/ngo/dashboard" element={withLayoutIfAuth(<NGODashboard />, ['ngo'])} />

      {/* Shared */}
      <Route path="/learning" element={withLayoutIfAuth(<LearningHub />)} />
      <Route path="/messages" element={withLayoutIfAuth(<Messages />)} />
      <Route path="/sustainability" element={withLayoutIfAuth(<Sustainability />)} />

      {/* DRIVER — only 3 pages */}
      {/* DRIVER — only 3 pages */}
<Route path="/driver/delivery" element={withLayoutIfAuth(<DeliveryDetail />, ['driver'])} />
<Route path="/driver/earnings" element={withLayoutIfAuth(<DriverEarnings />, ['driver'])} />
<Route path="/driver/profile" element={withLayoutIfAuth(<DriverProfile />, ['driver'])} />


      {/* Fallback */}
      <Route
        path="*"
        element={
          user
            ? user.role === 'farmer'
              ? <Navigate to="/dashboard" replace />
              : user.role === 'buyer'
              ? <Navigate to="/buyer/dashboard" replace />
           :user.role === 'driver'
  ? <Navigate to="/driver/delivery" replace />

              : <Navigate to="/" replace />
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
