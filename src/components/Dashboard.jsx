// src/components/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user,tenant } = useAuth();
  console.log(tenant);
  
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-indigo-800 mb-2">Welcome, {user?.name}</h2>
            <p className="text-indigo-600">You are logged in as a <span className="font-medium">{user?.role}</span> at <span className="font-medium">{tenant?.name}</span>.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Subscription Status</h2>
            <p className="text-green-600">Current plan: <span className="font-medium capitalize">{tenant?.plan}</span></p>
            {user?.role === 'admin' && tenant?.plan === 'free' && (
              <Link 
                to="/upgrade" 
                className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/notes"
              className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 font-medium text-gray-900">Manage Notes</h3>
            </Link>
            
            {user?.role === 'admin' && (
              <>
                <Link
                  to="/users"
                  className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 font-medium text-gray-900">Manage Users</h3>
                </Link>
                
                <Link
                  to="/upgrade"
                  className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 font-medium text-gray-900">Upgrade Plan</h3>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;