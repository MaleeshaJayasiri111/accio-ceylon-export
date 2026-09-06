import React, { useState, useEffect } from 'react';
import {
  Sun, Moon, ShoppingBag, MessageSquare, User, Globe,
  ShieldCheck, Anchor, Truck, Menu, X, ChevronDown, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';

export default function Header({ onOpenAuth, theme, toggleTheme, currentPath, navigate }) {
  const { user, logout } = useAuth();
  const { currency, setCurrency, CURRENCIES } = useCurrency();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const { unreadCount, setIsOpen: setChatOpen } = useChat();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [vesselNotice, setVesselNotice] = useState('MSC ANNA (FCL Departure to London Gateway & Hamburg in 48h)');

  useEffect(() => {
    fetch('/api/company')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.vessel_notice) {
          setVesselNotice(data.settings.vessel_notice);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Port & Export', path: '/port-export' },
    { label: 'Buyer Reviews', path: '/reviews' },
    { label: 'Factory Story', path: '/factory-story' },
    { label: 'Track Order', path: '/track' }
  ];

  return (
    <>
      {/* Top Colombo Port Logistics Announcement */}
      <div className="announcement-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span className="badge badge-amber" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
              <Anchor size={12} /> PORT OF COLOMBO LIVE
            </span>
            <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>
              🚢 Next Vessel: <strong>{vesselNotice}</strong> • Sub-48°C Solar Dehydration Active
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', opacity: 0.9 }}>
              <ShieldCheck size={13} color="#10B981" /> 100% Pure Ceylon • Direct Farm Sourced
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="navbar">
        <div className="container nav-wrapper">
          {/* Brand Logo */}
          <div
            className="brand-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12a10 10 0 0 1 10-10z" stroke="rgba(255,255,255,0.4)" fill="none" />
                <path d="M12 6 C8 10 7 15 12 18 C17 15 16 10 12 6 Z" fill="#FDFBF7" />
                <circle cx="12" cy="12" r="2.5" fill="#D97706" />
              </svg>
            </div>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 900 }}>ACCIO</span>
              <span style={{ fontSize: '0.8rem', display: 'block', fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1 }}>
                CEYLON DRY FOODS EXPORT
              </span>
            </div>
          </div>

          {/* Desktop Nav links */}
          <nav className="nav-links" style={{ display: 'none', '@media (min-width: 900px)': { display: 'flex' } }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  fontWeight: currentPath === item.path ? '700' : '500',
                  color: currentPath === item.path ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Bar */}
          <div className="nav-actions">
            {/* Currency Selector */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn-secondary btn-sm"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.75rem' }}
                title="Change Export Currency"
              >
                <span>{CURRENCIES[currency]?.flag}</span>
                <span style={{ fontWeight: 600 }}>{currency}</span>
                <ChevronDown size={14} />
              </button>

              {isCurrencyOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '140px',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.35rem',
                    zIndex: 200,
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setIsCurrencyOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        color: currency === c.code ? 'var(--primary)' : 'var(--text-primary)',
                        background: currency === c.code ? 'rgba(217, 119, 6, 0.1)' : 'transparent',
                        fontWeight: currency === c.code ? '700' : '500'
                      }}
                    >
                      <span>{c.flag} {c.code}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              className="btn-secondary btn-sm"
              onClick={toggleTheme}
              style={{ width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={17} color="#F59E0B" /> : <Moon size={17} color="#4B5563" />}
            </button>

            {/* Live Chat Launcher button */}
            <button
              className="btn-secondary btn-sm"
              onClick={() => setChatOpen(true)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: unreadCount > 0 ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
              }}
              title="Live Chat with Export Manager"
            >
              <MessageSquare size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Live Chat</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#EF4444',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Cart / Export Quote Drawer */}
            <button
              className="btn-primary btn-sm"
              onClick={() => setIsDrawerOpen(true)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <ShoppingBag size={16} />
              <span>Quote Cart</span>
              {totalItemsCount > 0 && (
                <span
                  style={{
                    background: '#064E3B',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '0.1rem 0.45rem',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.full_name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      top: '120%',
                      right: 0,
                      width: '210px',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem',
                      zIndex: 200,
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.full_name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.company_name || user.email}</p>
                      <span className="badge badge-green" style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
                        {user.country} • Verified Buyer
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/track');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <Truck size={15} /> My Export Shipments
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.85rem',
                        color: '#EF4444'
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn-secondary btn-sm"
                onClick={onOpenAuth}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <User size={15} />
                <span>Buyer Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="btn-secondary btn-sm mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="glass-panel" style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '0.6rem 0.75rem',
                    fontSize: '1rem',
                    fontWeight: currentPath === item.path ? 700 : 500,
                    color: currentPath === item.path ? 'var(--primary)' : 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                    background: currentPath === item.path ? 'rgba(217,119,6,0.1)' : 'transparent'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
