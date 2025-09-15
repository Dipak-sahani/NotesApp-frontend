// src/App.js (updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './components/LandingPage'; // Add this import
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Notes from './components/Notes';
import Users from './components/Users';
import Upgrade from './components/Upgrade';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  console.log(user);
  
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Add this route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upgrade" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Upgrade />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;