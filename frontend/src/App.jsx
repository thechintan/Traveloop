import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import TripBudget from './pages/TripBudget';
import PackingChecklist from './pages/PackingChecklist';
import SharedItinerary from './pages/SharedItinerary';
import Profile from './pages/Profile';
import TripNotes from './pages/TripNotes';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="page-container"><div className="empty-state">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children ? children : <Outlet />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/shared/:code" element={<SharedItinerary />} />
        
        {/* Protected Routes inside Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/new" element={<CreateTrip />} />
          
          <Route path="/trips/:tripId/build" element={<ItineraryBuilder />} />
          <Route path="/trips/:tripId/itinerary" element={<ItineraryView />} />
          <Route path="/trips/:tripId/budget" element={<TripBudget />} />
          <Route path="/trips/:tripId/packing" element={<PackingChecklist />} />
          <Route path="/trips/:tripId/notes" element={<TripNotes />} />
          
          <Route path="/explore/cities" element={<CitySearch />} />
          <Route path="/explore/activities" element={<ActivitySearch />} />
          
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Route */}
        <Route element={<ProtectedRoute adminOnly><Layout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
