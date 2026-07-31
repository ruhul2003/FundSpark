'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const fetchUser = async () => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data.user);
    } catch (error) {
      console.error('Failed to load user session:', error);
      if (typeof window !== 'undefined') localStorage.removeItem('access_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: jwtToken, user: userData } = res.data;

    if (typeof window !== 'undefined') localStorage.setItem('access_token', jwtToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async ({ name, email, password, photoURL, role }) => {
    const res = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      photoURL,
      role
    });
    const { token: jwtToken, user: userData } = res.data;

    if (typeof window !== 'undefined') localStorage.setItem('access_token', jwtToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const googleLogin = async (payload) => {
    const res = await axios.post(`${API_URL}/auth/google-login`, payload);
    const { token: jwtToken, user: userData } = res.data;

    if (typeof window !== 'undefined') localStorage.setItem('access_token', jwtToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const refreshUserData = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        login,
        register,
        googleLogin,
        logout,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
