import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accio_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.role === 'admin') {
            setAdminUser(data.user);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.user.role !== 'admin') {
      throw new Error('Access denied: You do not have export administrative credentials.');
    }

    localStorage.setItem('accio_admin_token', data.token);
    setToken(data.token);
    setAdminUser(data.user);
    return data.user;
  };

  const updateAdminUser = (updatedUser, newToken) => {
    setAdminUser(updatedUser);
    if (newToken) {
      localStorage.setItem('accio_admin_token', newToken);
      setToken(newToken);
    }
  };

  const logout = () => {
    localStorage.removeItem('accio_admin_token');
    setToken(null);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, token, loading, login, logout, updateAdminUser }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
