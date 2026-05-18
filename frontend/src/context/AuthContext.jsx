import React from 'react';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('soccerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (formData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('soccerUser', JSON.stringify(data));
    setUser(data);
  };

  const login = async (formData) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('soccerUser', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('soccerUser');
    setUser(null);
  };

  const authFetch = async (url, options) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
      ...((options && options.headers) || {})
    };

    const response = await fetch(`${API_URL}${url}`, { ...options, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, authFetch, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
}
