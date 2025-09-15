// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // set token globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserData(token); // restore session
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/me",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.User);
      setTenant(res.data.tenant);
    } catch (err) {
      console.error("❌ Failed to restore session:", err.response?.data || err.message);

      // only logout if token is truly invalid (401/403)
      if (err.response && [401, 403].includes(err.response.status)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(import.meta.env.VITE_LOGIN_USER, { email, password });
      const { accessToken, User, tenant } = res.data;

      localStorage.setItem("token", accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      setUser(User);
      setTenant(tenant);

      navigate("/");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setTenant(null);
    navigate("/login");
  };

  const value = { user, tenant, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
