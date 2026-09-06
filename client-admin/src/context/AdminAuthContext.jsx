import React, { createContext, useContext, useState, useEffect } from 'react';

<<<<<<< HEAD
import { DEFAULT_ADMIN_USER } from '../data/initialData';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('accio_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
=======
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
  const [token, setToken] = useState(localStorage.getItem('accio_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
<<<<<<< HEAD
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user && data.user.role === 'admin') {
            setAdminUser(data.user);
            localStorage.setItem('accio_admin_user', JSON.stringify(data.user));
          } else if (token === 'demo_admin_jwt_token_2026') {
            setAdminUser(DEFAULT_ADMIN_USER);
          } else {
            logout();
          }
        })
        .catch(() => {
          if (token === 'demo_admin_jwt_token_2026' || adminUser) {
            setAdminUser(adminUser || DEFAULT_ADMIN_USER);
=======
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.role === 'admin') {
            setAdminUser(data.user);
>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
          } else {
            logout();
          }
        })
<<<<<<< HEAD
=======
        .catch(() => logout())
>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
<<<<<<< HEAD
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user.role !== 'admin') {
          throw new Error('Access denied: You do not have export administrative credentials.');
        }
        localStorage.setItem('accio_admin_token', data.token);
        localStorage.setItem('accio_admin_user', JSON.stringify(data.user));
        setToken(data.token);
        setAdminUser(data.user);
        return data.user;
      }
    } catch (e) {
      console.warn('Backend API unreachable, checking demo credentials...');
    }

    // Demo / Static Fallback Authentication
    if (email.trim().toLowerCase() === 'admin@accio-ceylon.com' && password === 'Admin@Accio2026') {
      const demoToken = 'demo_admin_jwt_token_2026';
      localStorage.setItem('accio_admin_token', demoToken);
      localStorage.setItem('accio_admin_user', JSON.stringify(DEFAULT_ADMIN_USER));
      setToken(demoToken);
      setAdminUser(DEFAULT_ADMIN_USER);
      return DEFAULT_ADMIN_USER;
    }

    throw new Error('Invalid email or password. Please use default demo credentials.');
=======
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
>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
  };

  const updateAdminUser = (updatedUser, newToken) => {
    setAdminUser(updatedUser);
<<<<<<< HEAD
    localStorage.setItem('accio_admin_user', JSON.stringify(updatedUser));
=======
>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
    if (newToken) {
      localStorage.setItem('accio_admin_token', newToken);
      setToken(newToken);
    }
  };

  const logout = () => {
    localStorage.removeItem('accio_admin_token');
<<<<<<< HEAD
    localStorage.removeItem('accio_admin_user');
=======
>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
    setToken(null);
    setAdminUser(null);
  };

<<<<<<< HEAD

=======
>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
  return (
    <AdminAuthContext.Provider value={{ adminUser, token, loading, login, logout, updateAdminUser }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
