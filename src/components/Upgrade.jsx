// src/components/Upgrade.js
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Upgrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user,tenant } = useAuth();

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_UPDATE_PLAN}${tenant.slug}/upgrade`
      );

      if (res.status == 200) {
        setSuccess("Your subscription has been upgraded to Pro successfully!");
        // Refresh user data to reflect the new subscription
        window.location.reload();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to upgrade subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Upgrade Subscription
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Free Plan
            </h2>
            <p className="text-gray-600 mb-4">Current plan</p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Maximum of 3 notes</li>
              <li>Basic note management</li>
              <li>Limited functionality</li>
            </ul>
            <button
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md cursor-not-allowed"
              disabled
            >
              Current Plan
            </button>
          </div>

          <div className="border-2 border-indigo-500 rounded-lg p-6 bg-indigo-50">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">
              Pro Plan
            </h2>
            <p className="text-indigo-600 mb-4">Unlock full potential</p>
            <ul className="list-disc list-inside text-indigo-600 mb-6">
              <li>Unlimited notes</li>
              <li>Advanced note management</li>
              <li>Priority support</li>
              <li>All features included</li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Upgrading..." : "Upgrade to Pro"}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This is a demo application. No real payment is processed.
                Clicking "Upgrade to Pro" will immediately upgrade your
                subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
