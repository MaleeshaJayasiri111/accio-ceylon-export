import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_BUYERS = {
  oliver: {
    id: 'usr_demo_oliver',
    email: 'oliver.wright@londonorganics.co.uk',
    full_name: 'Oliver Wright',
    company_name: 'London Organic Snacks Ltd',
    country: 'United Kingdom',
    phone: '+44 20 7946 0912',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  sophia: {
    id: 'usr_demo_sophia',
    email: 'sophia.chen@sydneyfinefoods.com.au',
    full_name: 'Sophia Chen',
    company_name: 'Sydney Fine Foods Importers',
    country: 'Australia',
    phone: '+61 2 9123 4567',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  }
};

async function parseJsonResponse(res) {
  try {
    const text = await res.text();
    if (!text) return {};
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('accio_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('accio_customer_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token validation with backend when available
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(async (res) => {
          if (!res.ok) return null;
          return parseJsonResponse(res);
        })
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('accio_current_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please enter both your email address and password.');
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      const data = await parseJsonResponse(res);

      if (res.ok && data?.user && data?.token) {
        localStorage.setItem('accio_customer_token', data.token);
        localStorage.setItem('accio_current_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data.user;
      }

      if (data?.error && (res.status === 400 || res.status === 401)) {
        throw new Error(data.error);
      }

      // If server returned non-JSON/404 (e.g. static host without API route), check local accounts
      return loginLocalFallback(cleanEmail, cleanPassword);
    } catch (err) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('JSON')) {
        throw err;
      }
      return loginLocalFallback(cleanEmail, cleanPassword);
    }
  };

  const loginLocalFallback = (cleanEmail, cleanPassword) => {
    // Check locally registered users
    let registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('accio_registered_users') || '[]');
    } catch (e) {
      registeredUsers = [];
    }

    const matchedUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (matchedUser) {
      const userPayload = {
        id: matchedUser.id,
        email: matchedUser.email,
        full_name: matchedUser.full_name,
        company_name: matchedUser.company_name || 'Individual Buyer',
        country: matchedUser.country || 'International',
        phone: matchedUser.phone || '',
        role: 'customer',
        avatar_url: matchedUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      const mockToken = 'tok_loc_' + Date.now();
      localStorage.setItem('accio_customer_token', mockToken);
      localStorage.setItem('accio_current_user', JSON.stringify(userPayload));
      setToken(mockToken);
      setUser(userPayload);
      return userPayload;
    }

    // Check demo buyer presets
    const demo = Object.values(DEMO_BUYERS).find((d) => d.email.toLowerCase() === cleanEmail);
    if (demo) {
      const mockToken = 'tok_demo_' + Date.now();
      localStorage.setItem('accio_customer_token', mockToken);
      localStorage.setItem('accio_current_user', JSON.stringify(demo));
      setToken(mockToken);
      setUser(demo);
      return demo;
    }

    throw new Error('Invalid email or password. Please check your credentials or register a new account.');
  };

  const register = async (formData) => {
    const cleanEmail = (formData.email || '').trim().toLowerCase();
    const cleanPassword = (formData.password || '').trim();
    const cleanName = (formData.full_name || formData.name || '').trim();
    const cleanCompany = (formData.company_name || '').trim();
    const cleanCountry = (formData.country || 'United Kingdom').trim();
    const cleanPhone = (formData.phone || '').trim();

    if (!cleanName) {
      throw new Error('Please enter your name.');
    }
    if (!cleanEmail) {
      throw new Error('Please enter a valid email address.');
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    const payload = {
      email: cleanEmail,
      password: cleanPassword,
      full_name: cleanName,
      company_name: cleanCompany,
      country: cleanCountry,
      phone: cleanPhone,
      role: 'customer'
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await parseJsonResponse(res);

      if (res.ok && data?.user && data?.token) {
        localStorage.setItem('accio_customer_token', data.token);
        localStorage.setItem('accio_current_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        saveToLocalUserStore(payload, data.user.id);
        return data.user;
      }

      if (data?.error && (res.status === 400 || res.status === 409)) {
        throw new Error(data.error);
      }

      return registerLocalFallback(payload);
    } catch (err) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('JSON')) {
        throw err;
      }
      return registerLocalFallback(payload);
    }
  };

  const registerLocalFallback = (payload) => {
    let registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('accio_registered_users') || '[]');
    } catch (e) {
      registeredUsers = [];
    }

    const exists = registeredUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const newId = 'usr_' + Date.now();
    const newUser = {
      id: newId,
      email: payload.email,
      password: payload.password,
      full_name: payload.full_name,
      company_name: payload.company_name || 'Individual Buyer',
      country: payload.country || 'International',
      phone: payload.phone || '',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    registeredUsers.push(newUser);
    localStorage.setItem('accio_registered_users', JSON.stringify(registeredUsers));

    const userPayload = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      company_name: newUser.company_name,
      country: newUser.country,
      phone: newUser.phone,
      role: newUser.role,
      avatar_url: newUser.avatar_url
    };

    const mockToken = 'tok_loc_' + Date.now();
    localStorage.setItem('accio_customer_token', mockToken);
    localStorage.setItem('accio_current_user', JSON.stringify(userPayload));
    setToken(mockToken);
    setUser(userPayload);
    return userPayload;
  };

  const saveToLocalUserStore = (payload, id) => {
    try {
      const users = JSON.parse(localStorage.getItem('accio_registered_users') || '[]');
      if (!users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
        users.push({ ...payload, id });
        localStorage.setItem('accio_registered_users', JSON.stringify(users));
      }
    } catch (e) {}
  };

  const demoBuyerLogin = async (preset = 'oliver') => {
    const demo = DEMO_BUYERS[preset] || DEMO_BUYERS.oliver;

    try {
      const res = await fetch('/api/auth/google-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demo)
      });
      const data = await parseJsonResponse(res);
      if (res.ok && data?.user && data?.token) {
        localStorage.setItem('accio_customer_token', data.token);
        localStorage.setItem('accio_current_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data.user;
      }
    } catch (err) {}

    // Fallback to demo object
    const mockToken = 'tok_demo_' + Date.now();
    localStorage.setItem('accio_customer_token', mockToken);
    localStorage.setItem('accio_current_user', JSON.stringify(demo));
    setToken(mockToken);
    setUser(demo);
    return demo;
  };

  const logout = () => {
    localStorage.removeItem('accio_customer_token');
    localStorage.removeItem('accio_current_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoBuyerLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
