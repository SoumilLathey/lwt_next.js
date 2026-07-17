"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sun, Scale, AlertCircle, User, LogOut, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('installations');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [user, setUser] = React.useState(null);
  
  // Data States
  const [profile, setProfile] = React.useState({ name: '', phone: '', address: '', pincode: '' });
  const [installations, setInstallations] = React.useState([]);
  const [equipment, setEquipment] = React.useState([]);
  const [complaints, setComplaints] = React.useState([]);
  
  // Action States
  const [newComplaint, setNewComplaint] = React.useState({ subject: '', description: '' });
  const [revealedOtps, setRevealedOtps] = React.useState({});
  
  // Loading & Notification states
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [notify, setNotify] = React.useState({ type: '', text: '' });

  React.useEffect(() => {
    const token = localStorage.getItem('lwt_token');
    const storedUser = localStorage.getItem('lwt_user');
    
    if (!token || !storedUser) {
      router.push('/login');
      return;
    }
    
    const parsed = JSON.parse(storedUser);
    if (parsed.isEmployee) {
      router.push('/employee/dashboard');
      return;
    }
    if (parsed.isAdmin) {
      router.push('/admin/dashboard');
      return;
    }
    
    setUser(parsed);
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token) => {
    setLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
      // 1. Fetch Profile
      const profileRes = await fetch('/api/users/profile', { headers });
      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData);
      }
      
      // 2. Fetch Installations
      const instRes = await fetch('/api/users/installations', { headers });
      if (instRes.ok) {
        const iData = await instRes.json();
        setInstallations(iData);
      }
      
      // 3. Fetch Weighing Equipment
      const eqRes = await fetch('/api/users/weighing-equipment', { headers });
      if (eqRes.ok) {
        const eData = await eqRes.json();
        setEquipment(eData);
      }
      
      // 4. Fetch Complaints
      const compRes = await fetch('/api/complaints', { headers });
      if (compRes.ok) {
        const cData = await compRes.json();
        setComplaints(cData);
      }

    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Error loading dashboard profiles. Please refresh.' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      if (response.ok) {
        setNotify({ type: 'success', text: 'Your business profile updated successfully.' });
      } else {
        const data = await response.json();
        setNotify({ type: 'danger', text: data.error || 'Failed to update profile.' });
      }
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Connection error. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegisterComplaint = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newComplaint)
      });
      
      if (response.ok) {
        setNotify({ type: 'success', text: 'Complaint registered successfully! An engineer will be assigned.' });
        setNewComplaint({ subject: '', description: '' });
        
        // Refresh complaints list
        const compRes = await fetch('/api/complaints', { headers: { 'Authorization': `Bearer ${token}` } });
        if (compRes.ok) {
          const cData = await compRes.json();
          setComplaints(cData);
        }
      } else {
        const data = await response.json();
        setNotify({ type: 'danger', text: data.error || 'Failed to file complaint.' });
      }
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Connection error. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleOtpReveal = (id) => {
    setRevealedOtps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('lwt_token');
    localStorage.removeItem('lwt_user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-body)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--surface-border-mid)', borderTopColor: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <div className="container" style={{ padding: '40px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header Title with User Name */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '8px', background: 'rgba(245,158,11,0.08)', padding: '6px 14px', borderRadius: '100px', border: '1px solid rgba(245,158,11,0.12)' }}>Client Workspace</span>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Hello, {profile.name || user?.name || 'Customer'}</h1>
            </div>
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          {notify.text && (
            <div style={{ 
              padding: '14px 18px', 
              borderRadius: '12px', 
              background: notify.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)', 
              color: notify.type === 'success' ? 'var(--success)' : 'var(--danger)', 
              border: `1px solid ${notify.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}`, 
              marginBottom: '32px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              {notify.type === 'success' ? '✓' : '✗'} {notify.text}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* Sidebar Tabs */}
            <div style={{ background: 'var(--surface-1)', borderRadius: '20px', padding: '16px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
              {[
                { id: 'installations', label: 'Solar Installations', icon: Sun },
                { id: 'equipment', label: 'Weighing Equipment', icon: Scale },
                { id: 'complaints', label: 'Support Tickets', icon: AlertCircle },
                { id: 'profile', label: 'Business Settings', icon: User },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '14px 16px', 
                      borderRadius: '12px', 
                      background: isActive ? 'var(--color-primary)' : 'transparent', 
                      color: isActive ? '#fff' : 'var(--text-muted)', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '14px', 
                      fontWeight: isActive ? 700 : 600, 
                      textAlign: 'left',
                      marginBottom: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} color={isActive ? '#fff' : 'var(--color-primary)'} />
                      {tab.label}
                    </div>
                    <ChevronRight size={14} opacity={isActive ? 1 : 0.4} />
                  </button>
                );
              })}
            </div>

            {/* Main Area */}
            <div style={{ background: 'var(--surface-grad-soft)', borderRadius: '24px', padding: '36px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-md)' }}>
              
              {/* installations tab */}
              {activeTab === 'installations' && (
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '24px' }}>Solar Plant Installations</h2>
                  {installations.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No solar installations active under your business profile.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {installations.map(inst => (
                        <div key={inst.id} style={{ background: 'var(--surface-1)', padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                          <div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity</span>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginTop: '4px' }}>{inst.capacity}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Commissioned On</span>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>{new Date(inst.installationDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Location</span>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>{inst.address}</div>
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px', background: inst.status === 'Active' ? 'rgba(16,185,129,0.08)' : 'rgba(148,163,184,0.08)', color: inst.status === 'Active' ? 'var(--success)' : 'var(--text-muted)', border: `1px solid ${inst.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(148,163,184,0.15)'}` }}>
                            {inst.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* equipment tab */}
              {activeTab === 'equipment' && (
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '24px' }}>Hardware & Weighing Scales</h2>
                  {equipment.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No weighing scales registered under your profile.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                      {equipment.map(eq => (
                        <div key={eq.id} style={{ background: 'var(--surface-1)', padding: '24px', borderRadius: '16px', border: '1px solid var(--surface-border)', position: 'relative' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--color-secondary)' }}>{eq.equipmentType}</span>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: '6px 0 16px' }}>{eq.model}</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Capacity:</span>
                              <strong style={{ color: 'var(--text-main)' }}>{eq.capacity}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Serial No:</span>
                              <code style={{ color: 'var(--text-main)', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: '4px' }}>{eq.serialNumber || 'N/A'}</code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* complaints tab */}
              {activeTab === 'complaints' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  
                  {/* File Support Ticket */}
                  <div style={{ background: 'var(--surface-1)', padding: '28px', borderRadius: '20px', border: '1px solid var(--surface-border)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '20px' }}>File Scale Support Ticket</h3>
                    <form onSubmit={handleRegisterComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Subject / Issue Summary</label>
                        <input 
                          type="text" 
                          value={newComplaint.subject}
                          onChange={e => setNewComplaint(prev => ({ ...prev, subject: e.target.value }))}
                          required
                          placeholder="e.g. Weighbridge weight fluctuation, calibration error..."
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Detailed Description</label>
                        <textarea 
                          value={newComplaint.description}
                          onChange={e => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
                          required
                          rows="3"
                          placeholder="Provide details about the issue..."
                          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        />
                      </div>
                      <button type="submit" disabled={actionLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--color-primary)', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', width: 'fit-content' }}>
                        {actionLoading ? "Registering..." : "File Complaint Ticket"}
                      </button>
                    </form>
                  </div>

                  {/* Complaint list */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Complaint History</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status:</span>
                        <select 
                          value={statusFilter}
                          onChange={e => setStatusFilter(e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--surface-border-mid)', background: 'var(--surface-2)', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="All">All Tickets</option>
                          <option value="Pending">Pending Allocation</option>
                          <option value="Assigned">Assigned Engineer</option>
                          <option value="Resolved">Resolved / Closed</option>
                        </select>
                      </div>
                    </div>

                    {complaints.filter(c => statusFilter === 'All' || c.status === statusFilter).length === 0 ? (
                      <p style={{ color: 'var(--text-muted)' }}>No support complaints matching "{statusFilter}".</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {complaints.filter(c => statusFilter === 'All' || c.status === statusFilter).map(c => (
                          <div key={c.id} style={{ background: 'var(--surface-1)', padding: '24px', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--heading-color)', margin: 0 }}>{c.subject}</h4>
                              <span style={{ 
                                fontSize: '11px', 
                                fontWeight: 700, 
                                padding: '4px 10px', 
                                borderRadius: '12px', 
                                background: c.status === 'Assigned' ? 'rgba(59,130,246,0.08)' : c.status === 'Resolved' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                                color: c.status === 'Assigned' ? 'var(--color-primary)' : c.status === 'Resolved' ? 'var(--success)' : 'var(--color-secondary)'
                              }}>{c.status}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>{c.description}</p>
                            
                            {/* Engineer card */}
                            {c.assignedEmployeeName ? (
                              <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-border)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(36,82,143,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                  {c.assignedEmployeePhoto ? <img src={c.assignedEmployeePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : '👤'}
                                </div>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--heading-color)' }}>Engineer: {c.assignedEmployeeName}</div>
                                  {c.assignedEmployeePhone && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>📞 Phone: {c.assignedEmployeePhone}</div>}
                                </div>
                              </div>
                            ) : (
                              <div style={{ background: 'rgba(245,158,11,0.05)', color: 'var(--color-secondary)', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', border: '1px solid rgba(245,158,11,0.1)' }}>
                                ⏳ Scheduling staff / allocating dispatch engineer...
                              </div>
                            )}

                            {/* Schedule metadata */}
                            {c.visitSchedule && (
                              <div style={{ background: 'var(--surface-2)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--surface-border)', fontSize: '13px', marginBottom: '16px', color: 'var(--text-main)' }}>
                                🗓️ <strong>Scheduled Visit:</strong> {new Date(c.visitSchedule.scheduledDate).toLocaleDateString()} at {c.visitSchedule.scheduledTime}
                                {c.visitSchedule.notes && <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Notes: {c.visitSchedule.notes}</div>}
                              </div>
                            )}

                            {/* OTP */}
                            {c.status !== 'Resolved' && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--surface-border-mid)' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Require closure OTP for engineer?</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <button onClick={() => toggleOtpReveal(c.id)} style={{ background: 'transparent', border: '1px solid var(--surface-border-mid)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-main)', fontWeight: 600 }}>
                                    {revealedOtps[c.id] ? 'Hide OTP' : 'Show OTP'}
                                  </button>
                                  {revealedOtps[c.id] && <strong style={{ color: 'var(--color-secondary)', fontSize: '15px', letterSpacing: '1px' }}>{c.closureOtp}</strong>}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* profile tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '24px' }}>Business Settings</h2>
                  <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Contact Person Name</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={labelStyle}>Mobile Number</label>
                        <input 
                          type="tel" 
                          value={profile.phone}
                          onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Registered Email</label>
                        <input 
                          type="email" 
                          value={profile.email}
                          disabled
                          style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={labelStyle}>Installation Address</label>
                        <input 
                          type="text" 
                          value={profile.address}
                          onChange={e => setProfile(prev => ({ ...prev, address: e.target.value }))}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Pincode</label>
                        <input 
                          type="text" 
                          value={profile.pincode}
                          onChange={e => setProfile(prev => ({ ...prev, pincode: e.target.value }))}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={actionLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--color-primary)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', width: 'fit-content' }}>
                      {actionLoading ? "Saving..." : "Save Settings"}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
