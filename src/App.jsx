import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import FoodDetails from './pages/FoodDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Login from './pages/Login';
import TrackOrders from './pages/TrackOrders';
import CommunityFeed from './pages/CommunityFeed';
import NotificationToast from './components/NotificationToast';
import LiveChatbot from './components/LiveChatbot';
import { useApp } from './context/AppContext';

// Wrapper for Routes that require a specific Role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useApp();

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but wrong role, redirect to their default home page
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'delivery') return <Navigate to="/delivery" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Wrapper for public-only routes (like Login)
const PublicRoute = ({ children }) => {
  const { user } = useApp();

  if (user) {
    // Already logged in, redirect to their home page
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'delivery') return <Navigate to="/delivery" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        
        {/* Floating Notification Popups & Support Chatbots */}
        <NotificationToast />
        <LiveChatbot />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Public only route */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            {/* Protected Customer Routes */}
            <Route path="/" element={<ProtectedRoute allowedRoles={['customer']}><Home /></ProtectedRoute>} />
            <Route path="/menu" element={<ProtectedRoute allowedRoles={['customer']}><Menu /></ProtectedRoute>} />
            <Route path="/food/:id" element={<ProtectedRoute allowedRoles={['customer']}><FoodDetails /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={['customer']}><Checkout /></ProtectedRoute>} />
            <Route path="/track" element={<ProtectedRoute allowedRoles={['customer']}><TrackOrders /></ProtectedRoute>} />
            <Route path="/feed" element={<ProtectedRoute allowedRoles={['customer']}><CommunityFeed /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute allowedRoles={['customer']}><About /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute allowedRoles={['customer']}><Contact /></ProtectedRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

            {/* Protected Delivery Agent Routes */}
            <Route path="/delivery" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
