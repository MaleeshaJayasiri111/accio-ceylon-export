import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, Globe, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, demoBuyerLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          email,
          password,
          full_name: fullName,
          company_name: companyName,
          country,
          phone,
          role: 'customer'
        });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (buyerType) => {
    setError('');
    setLoading(true);
    try {
      await demoBuyerLogin(buyerType);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    'United Kingdom', 'Germany', 'Australia', 'United Arab Emirates',
    'United States', 'Japan', 'France', 'Netherlands', 'Singapore', 'Canada', 'Saudi Arabia'
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(5px)' }}
      />

      {/* Modal Dialog */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          padding: '2rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          zIndex: 510,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 0.75rem', width: '42px', height: '42px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 6 C8 10 7 15 12 18 C17 15 16 10 12 6 Z" fill="#FDFBF7" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {isRegister ? 'Register as Export Buyer' : 'Sign In to Accio Portal'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Access wholesale FOB price lists, sample tracking & order history
          </p>
        </div>

        {/* Quick Demo Buyer Buttons */}
        <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={13} /> Quick Demo Buyer Sign-In:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => handleDemoLogin('oliver')}
              style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.4rem 0.6rem' }}
            >
              🇬🇧 Oliver (London)
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => handleDemoLogin('sophia')}
              style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.4rem 0.6rem' }}
            >
              🇦🇺 Sophia (Sydney)
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', color: '#DC2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {isRegister && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Klaus Meyer"
                    style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Company / Organization</label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Hamburg Bio Import GmbH"
                    style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Destination Country *</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@company.com"
                style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Buyer Account' : 'Sign In')}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New international importer?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Register Here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
