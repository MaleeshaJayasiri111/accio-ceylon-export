import React, { useState, useEffect } from 'react';
import {
  User, Shield, Lock, Building, Phone, Mail, MapPin, Database,
  Download, RefreshCw, CheckCircle2, AlertCircle, Save, Trash2,
  Search, Truck, Sparkles, Anchor, HelpCircle, Camera, Upload
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminSettings() {
  const { adminUser, token, updateAdminUser } = useAdminAuth();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const fileInputRef = React.useRef(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: adminUser?.full_name || 'Kavindu Jayasiri',
    email: adminUser?.email || 'admin@accio-ceylon.com',
    phone: adminUser?.phone || '+94 77 123 4567',
    company_name: adminUser?.company_name || 'Accio Export Ltd (Colombo HQ)',
    country: adminUser?.country || 'Sri Lanka',
    avatar_url: adminUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });

  useEffect(() => {
    if (adminUser) {
      setProfileForm({
        full_name: adminUser.full_name || 'Kavindu Jayasiri',
        email: adminUser.email || 'admin@accio-ceylon.com',
        phone: adminUser.phone || '+94 77 123 4567',
        company_name: adminUser.company_name || 'Accio Export Ltd (Colombo HQ)',
        country: adminUser.country || 'Sri Lanka',
        avatar_url: adminUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
    }
  }, [adminUser]);

  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Handle Avatar Image File Upload
  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload photo');

      const newAvatarUrl = uploadData.url;
      const updatedForm = { ...profileForm, avatar_url: newAvatarUrl };
      setProfileForm(updatedForm);

      // Save immediately to profile
      const saveRes = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedForm)
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Failed to save updated avatar');

      if (saveData.user) {
        updateAdminUser(saveData.user, saveData.token);
      }
      setProfileMsg({ type: 'success', text: 'Admin profile picture updated & saved successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Avatar upload failed' });
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Company Settings Form State
  const [companyForm, setCompanyForm] = useState({
    company_name: 'Accio Ceylon (Pvt) Ltd',
    tagline: 'Colombo’s Premier Dehydrated Tropical Fruits & Botanical Infusions Exporter',
    address: 'Port Road, Colombo 01, Sri Lanka',
    phone: '+94 11 258 4930',
    whatsapp: '+94 77 123 4567',
    email: 'export@accio-ceylon.com',
    vessel_notice: 'MSC ANNA (FCL Departure to London Gateway & Hamburg in 48h)',
    export_target_kg: 50000
  });
  const [companySaving, setCompanySaving] = useState(false);
  const [companyMsg, setCompanyMsg] = useState({ type: '', text: '' });

  // Database Tools State
  const [dbStats, setDbStats] = useState(null);
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState({ type: '', text: '' });

  // Order Tracking Inspector State
  const [searchTracking, setSearchTracking] = useState('ACC-EXP-2026-7841');
  const [inspectedOrder, setInspectedOrder] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Fetch company settings & DB stats on mount
  useEffect(() => {
    fetchCompanyInfo();
    fetchStats();
  }, [token]);

  const fetchCompanyInfo = async () => {
    try {
      const res = await fetch('/api/company');
      const data = await res.json();
      if (data.settings) {
        setCompanyForm((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      console.error('Failed to load company settings:', e);
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/stats/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.metrics) {
        setDbStats(data.metrics);
      }
    } catch (e) {
      console.error('Failed to fetch DB stats:', e);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      setProfileMsg({ type: 'success', text: 'Admin profile updated successfully.' });
      if (data.token) {
        localStorage.setItem('accio_admin_token', data.token);
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMsg({ type: '', text: '' });

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      setPasswordMsg({ type: 'success', text: 'Password changed successfully! Keep your new credentials safe.' });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    setCompanySaving(true);
    setCompanyMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(companyForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update company settings');
      setCompanyMsg({ type: 'success', text: 'Company details updated and synchronized with the Public Customer Store!' });
    } catch (err) {
      setCompanyMsg({ type: 'error', text: err.message });
    } finally {
      setCompanySaving(false);
    }
  };

  const handleDownloadBackupSqlite = () => {
    window.open('/api/company/backup/sqlite', '_blank');
  };

  const handleDownloadBackupJson = () => {
    window.open('/api/company/backup/json', '_blank');
  };

  const handleResetDemoData = async () => {
    if (resetConfirm !== 'RESET_ACCIO_DEMO') {
      setResetMsg({ type: 'error', text: 'Please type "RESET_ACCIO_DEMO" in the text box below to confirm.' });
      return;
    }
    setResetLoading(true);
    setResetMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/company/reset-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ confirmation: resetConfirm })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setResetMsg({ type: 'success', text: 'Demo orders and chat history have been cleared cleanly. You can now start with live buyer orders!' });
      setResetConfirm('');
      fetchStats();
    } catch (err) {
      setResetMsg({ type: 'error', text: err.message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleInspectTrack = async (e) => {
    e?.preventDefault();
    if (!searchTracking.trim()) return;
    setTrackLoading(true);
    setTrackError('');
    setInspectedOrder(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(searchTracking.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.order) {
        throw new Error(data.error || 'Shipment tracking reference not found');
      }
      setInspectedOrder(data.order);
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Settings Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          className={activeSubTab === 'profile' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveSubTab('profile')}
          style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}
        >
          <User size={16} />
          <span>Admin Profile & Password</span>
        </button>

        <button
          className={activeSubTab === 'company' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveSubTab('company')}
          style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}
        >
          <Building size={16} />
          <span>Company & Public Store Contact</span>
        </button>

        <button
          className={activeSubTab === 'database' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveSubTab('database')}
          style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}
        >
          <Database size={16} />
          <span>Database & Backup Tools</span>
        </button>

        <button
          className={activeSubTab === 'tracking' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveSubTab('tracking')}
          style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}
        >
          <Truck size={16} />
          <span>Integrated Shipment Tracker</span>
        </button>
      </div>

      {/* Tab 1: Profile & Security */}
      {activeSubTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {/* Edit Profile */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Admin Personal Details</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Managing Director & Colombo Export Administrator</p>
              </div>
            </div>

            {profileMsg.text && (
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', background: profileMsg.type === 'success' ? 'rgba(4, 120, 87, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: profileMsg.type === 'success' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {profileMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Profile Photo Uploader */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={profileForm.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="Admin Avatar"
                    style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', background: '#1E293B' }}
                  />
                  {avatarUploading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem' }}>
                      <RefreshCw size={18} className="spin" />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Profile Photo / Avatar
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    Upload your official picture (PNG, JPG, WebP) to appear on the admin panel & export console.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarFileSelect}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      <Camera size={14} />
                      <span>{avatarUploading ? 'Uploading...' : 'Upload New Photo'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        const defaultMale = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
                        setProfileForm({ ...profileForm, avatar_url: defaultMale });
                      }}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
                    >
                      Corporate Portrait
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-control"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Admin Email Address
                </label>
                <input
                  type="email"
                  className="input-control"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Direct Phone / WhatsApp
                </label>
                <input
                  type="text"
                  className="input-control"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Company Designation
                </label>
                <input
                  type="text"
                  className="input-control"
                  value={profileForm.company_name}
                  onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={profileSaving}
                style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}
              >
                <Save size={16} />
                <span>{profileSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(4, 120, 87, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Change Admin Password</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Secure authentication for your admin console</p>
              </div>
            </div>

            {passwordMsg.text && (
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', background: passwordMsg.type === 'success' ? 'rgba(4, 120, 87, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: passwordMsg.type === 'success' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {passwordMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  className="input-control"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  required
                  placeholder="Enter current password (e.g. Admin@Accio2026)"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  New Password
                </label>
                <input
                  type="password"
                  className="input-control"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  required
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="input-control"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  required
                  placeholder="Repeat new password"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={passwordSaving}
                style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}
              >
                <Shield size={16} />
                <span>{passwordSaving ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Company & Public Store Contact */}
      {activeSubTab === 'company' && (
        <div className="card" style={{ padding: '2rem', maxWidth: '850px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Company Contact & Public Store Synchronization</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                These contact details are dynamically broadcast to the Public Customer Store (Header, Footer, and Contact sections).
              </p>
            </div>
          </div>

          {companyMsg.text && (
            <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.88rem', background: companyMsg.type === 'success' ? 'rgba(4, 120, 87, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: companyMsg.type === 'success' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {companyMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{companyMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCompany} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Company Registered Name
              </label>
              <input
                type="text"
                className="input-control"
                value={companyForm.company_name}
                onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Company Tagline / Bio
              </label>
              <input
                type="text"
                className="input-control"
                value={companyForm.tagline}
                onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Colombo Facility / Harbor Export Address
              </label>
              <input
                type="text"
                className="input-control"
                value={companyForm.address}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Official Phone
              </label>
              <input
                type="text"
                className="input-control"
                value={companyForm.phone}
                onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Official WhatsApp Hotline
              </label>
              <input
                type="text"
                className="input-control"
                value={companyForm.whatsapp}
                onChange={(e) => setCompanyForm({ ...companyForm, whatsapp: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Official Export Email
              </label>
              <input
                type="email"
                className="input-control"
                value={companyForm.email}
                onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Annual Export Target Goal (KG)
              </label>
              <input
                type="number"
                className="input-control"
                value={companyForm.export_target_kg}
                onChange={(e) => setCompanyForm({ ...companyForm, export_target_kg: e.target.value })}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Live Top Ticker Shipping Announcement
              </label>
              <input
                type="text"
                className="input-control"
                value={companyForm.vessel_notice}
                onChange={(e) => setCompanyForm({ ...companyForm, vessel_notice: e.target.value })}
                placeholder="e.g. MSC ANNA (FCL Departure to London Gateway & Hamburg in 48h)"
              />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={companySaving}
                style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}
              >
                <Save size={18} />
                <span>{companySaving ? 'Syncing...' : 'Save & Synchronize Public Site'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Database & Backup Tools */}
      {activeSubTab === 'database' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* DB Health Card */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(4, 120, 87, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Database Storage & Backup Engine</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Location: <code style={{ background: 'var(--bg-surface-elevated)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>server/src/db/accio.db</code> (SQLite WAL Mode with Foreign Keys)
                </p>
              </div>
            </div>

            {/* Metrics Snapshot */}
            {dbStats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Total Export Orders</span>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{dbStats.totalOrders}</strong>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Export Volume (KG)</span>
                  <strong style={{ fontSize: '1.5rem', color: '#10B981' }}>{dbStats.totalKgExported} kg</strong>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Catalog Products</span>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{dbStats.totalProducts}</strong>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Registered Importers</span>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{dbStats.totalCustomers}</strong>
                </div>
              </div>
            )}

            {/* 1-Click Backups */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={handleDownloadBackupSqlite}
                style={{ padding: '0.75rem 1.4rem' }}
              >
                <Download size={16} />
                <span>Download SQLite Database (.db file)</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleDownloadBackupJson}
                style={{ padding: '0.75rem 1.4rem' }}
              >
                <Download size={16} />
                <span>Export Full Data Dump (.json file)</span>
              </button>
            </div>
          </div>

          {/* Reset Demo Data Card */}
          <div className="card" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#EF4444' }}>Reset Demo Transactions (Fresh Live Start)</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Clear all test buyer inquiries and test chat messages so you start with 0 live orders. (Product catalog and Kavindu admin profile are safely preserved).
                </p>
              </div>
            </div>

            {resetMsg.text && (
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', background: resetMsg.type === 'success' ? 'rgba(4, 120, 87, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: resetMsg.type === 'success' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {resetMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{resetMsg.text}</span>
              </div>
            )}

            <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Type <code style={{ color: '#EF4444', fontWeight: 700 }}>RESET_ACCIO_DEMO</code> below to confirm:
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="input-control"
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                  placeholder="RESET_ACCIO_DEMO"
                />
                <button
                  className="btn"
                  onClick={handleResetDemoData}
                  disabled={resetLoading || resetConfirm !== 'RESET_ACCIO_DEMO'}
                  style={{ background: '#EF4444', color: '#FFFFFF', whiteSpace: 'nowrap', opacity: resetConfirm === 'RESET_ACCIO_DEMO' ? 1 : 0.5 }}
                >
                  <RefreshCw size={16} />
                  <span>{resetLoading ? 'Clearing...' : 'Clear Demo Data'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Integrated Shipment Tracker */}
      {activeSubTab === 'tracking' && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Admin In-Portal Shipment Logistics Tracker</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Inspect any export consignment tracking timeline directly inside the admin console.
              </p>
            </div>
          </div>

          <form onSubmit={handleInspectTrack} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px', marginBottom: '2rem' }}>
            <input
              type="text"
              className="input-control"
              value={searchTracking}
              onChange={(e) => setSearchTracking(e.target.value)}
              placeholder="e.g. ACC-EXP-2026-7841"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={trackLoading}>
              <Search size={16} />
              <span>{trackLoading ? 'Searching...' : 'Inspect Shipment'}</span>
            </button>
          </form>

          {trackError && (
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <AlertCircle size={18} />
              <span>{trackError}</span>
            </div>
          )}

          {inspectedOrder && (
            <div style={{ borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <span className="badge badge-amber" style={{ marginBottom: '0.35rem' }}>
                    {inspectedOrder.order_type === 'sample' ? 'Sample Pack Consignment' : 'Wholesale Ocean Freight (FOB)'}
                  </span>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {inspectedOrder.tracking_number}
                  </h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                    Current Status: {inspectedOrder.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Importer / Buyer</span>
                  <strong>{inspectedOrder.customer_name} ({inspectedOrder.customer_company || 'Private'})</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Destination Port</span>
                  <strong>{inspectedOrder.destination_port} ({inspectedOrder.destination_country})</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Shipping Method</span>
                  <strong>{inspectedOrder.shipping_method || 'Ocean Freight'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Declared Value</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>${Number(inspectedOrder.total_amount).toLocaleString()} USD</strong>
                </div>
              </div>

              {inspectedOrder.notes && (
                <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Port Logistics Log: </span>
                  <span>{inspectedOrder.notes}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
