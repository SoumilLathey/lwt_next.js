"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, LogOut, FileText, Calendar, CheckCircle2, ChevronRight, Activity, Image as ImageIcon, Briefcase, Wrench, Lock, Plus, Edit2, Trash2, ExternalLink, Globe, Eye, FileEdit } from 'lucide-react';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [employee, setEmployee] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('complaints');
  const [statusFilter, setStatusFilter] = React.useState('All');
  
  // Data States
  const [complaints, setComplaints] = React.useState([]);
  const [enquiries, setEnquiries] = React.useState([]);
  const [empProfile, setEmpProfile] = React.useState(null);
  
  // Loading & Notification states
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [notify, setNotify] = React.useState({ type: '', text: '' });
  
  // Modals / Input states
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [actionType, setActionType] = React.useState(''); // 'status', 'schedule', 'image'
  
  // Action inputs
  const [statusVal, setStatusVal] = React.useState('');
  const [otpVal, setOtpVal] = React.useState('');
  const [schedVal, setSchedVal] = React.useState({ date: '', time: '', notes: '' });
  const [imageVal, setImageVal] = React.useState({ file: null, type: 'action_photo', description: '' });
  const [empPhotoFile, setEmpPhotoFile] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('lwt_token');
    const storedUser = localStorage.getItem('lwt_user');
    
    if (!token || !storedUser) {
      router.push('/login');
      return;
    }
    
    const parsed = JSON.parse(storedUser);
    if (!parsed.isEmployee) {
      router.push('/login');
      return;
    }
    
    setEmployee(parsed);
    fetchEmployeeData(token);
  }, []);

  const fetchEmployeeData = async (token) => {
    setLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const compRes = await fetch('/api/employees/complaints', { headers });
      if (compRes.ok) {
        const cData = await compRes.json();
        setComplaints(cData);
      }
      
      const enqRes = await fetch('/api/employees/enquiries', { headers });
      if (enqRes.ok) {
        const eData = await enqRes.json();
        setEnquiries(eData);
      }

      const profRes = await fetch('/api/employees/profile', { headers });
      if (profRes.ok) {
        const pData = await profRes.json();
        setEmpProfile(pData);
      }
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Failed to load assigned jobs.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');
    
    const body = { status: statusVal };
    if (statusVal === 'Resolved') {
      body.otp = otpVal;
    }

    try {
      const endpoint = activeTab === 'complaints'
        ? `/api/employees/complaints/${selectedTicket.id}/status`
        : `/api/employees/enquiries/${selectedTicket.id}/status`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNotify({ type: 'success', text: `Status updated to ${statusVal} successfully!` });
        closeActions();
        fetchEmployeeData(token);
      } else {
        setNotify({ type: 'danger', text: data.error || 'Failed to update status.' });
      }
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Network error. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');

    try {
      const response = await fetch(`/api/employees/complaints/${selectedTicket.id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scheduledDate: schedVal.date,
          scheduledTime: schedVal.time,
          notes: schedVal.notes
        })
      });
      
      if (response.ok) {
        setNotify({ type: 'success', text: 'Field visit scheduled successfully!' });
        closeActions();
        fetchEmployeeData(token);
      } else {
        const data = await response.json();
        setNotify({ type: 'danger', text: data.error || 'Failed to schedule visit.' });
      }
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Network error. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageVal.file) return;
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    
    const token = localStorage.getItem('lwt_token');
    const formData = new FormData();
    formData.append('image', imageVal.file);
    
    if (activeTab === 'complaints') {
      formData.append('type', imageVal.type);
      formData.append('description', imageVal.description);
    } else {
      formData.append('description', imageVal.description || 'Photo with client');
    }

    try {
      const endpoint = activeTab === 'complaints'
        ? `/api/employees/complaints/${selectedTicket.id}/images`
        : `/api/employees/enquiries/${selectedTicket.id}/images`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        setNotify({ type: 'success', text: 'Action photo uploaded successfully!' });
        closeActions();
        fetchEmployeeData(token);
      } else {
        const data = await response.json();
        setNotify({ type: 'danger', text: data.error || 'Failed to upload photo.' });
      }
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Network error. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const openAction = (ticket, type) => {
    setSelectedTicket(ticket);
    setActionType(type);
    
    // Reset values
    setStatusVal(ticket.status);
    setOtpVal('');
    
    if (ticket.visitSchedule) {
      setSchedVal({
        date: ticket.visitSchedule.scheduledDate,
        time: ticket.visitSchedule.scheduledTime,
        notes: ticket.visitSchedule.notes || ''
      });
    } else {
      setSchedVal({ date: '', time: '', notes: '' });
    }
    
    setImageVal({ file: null, type: 'action_photo', description: '' });
  };

  const closeActions = () => {
    setSelectedTicket(null);
    setActionType('');
  };

  const handleSelfPhotoUpdate = async (e) => {
    e.preventDefault();
    if (!empPhotoFile) return;
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');
    const formData = new FormData();
    formData.append('photo', empPhotoFile);
    try {
      const response = await fetch('/api/employees/profile/photo', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setNotify({ type: 'success', text: 'Profile photo updated successfully!' });
        setEmpPhotoFile(null);
        setEmpProfile(prev => ({ ...prev, photoPath: data.photoPath }));
      } else {
        setNotify({ type: 'danger', text: data.error || 'Failed to update photo.' });
      }
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Connection error. Please try again.' });
    } finally {
      setActionLoading(false);
    }
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

  if (employee && employee.department === 'Blog Editorial') {
    return <BlogEditorialDashboard employee={employee} handleLogout={handleLogout} router={router} />;
  }

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <div className="container" style={{ padding: '40px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Dashboard Header with profile avatar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Avatar */}
              <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(36,82,143,0.1)', border: '3px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {empProfile?.photoPath
                    ? <img src={empProfile.photoPath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <User size={28} color="var(--color-primary)" />
                  }
                </div>
              </div>
              <div>
                <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '4px', background: 'rgba(245,158,11,0.08)', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(245,158,11,0.12)' }}>Staff Operations Portal</span>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Hello, {employee?.name || 'Staff Member'}</h1>
                {empProfile?.department && <p style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600, margin: '2px 0 0' }}>{empProfile.department}</p>}
              </div>
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

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', background: 'var(--surface-1)', borderRadius: '16px', padding: '6px', border: '1px solid var(--surface-border)', width: 'fit-content', marginBottom: '32px', gap: '8px' }}>
            <button 
              onClick={() => { setActiveTab('complaints'); closeActions(); }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 20px', 
                borderRadius: '10px', 
                background: activeTab === 'complaints' ? 'var(--color-primary)' : 'transparent', 
                color: activeTab === 'complaints' ? '#fff' : 'var(--text-muted)', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: 700,
                transition: 'all 0.2s ease'
              }}
            >
              <Wrench size={16} /> Assigned Complaints ({complaints.length})
            </button>
            <button 
              onClick={() => { setActiveTab('enquiries'); closeActions(); }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 20px', 
                borderRadius: '10px', 
                background: activeTab === 'enquiries' ? 'var(--color-primary)' : 'transparent', 
                color: activeTab === 'enquiries' ? '#fff' : 'var(--text-muted)', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: 700,
                transition: 'all 0.2s ease'
              }}
            >
              <Briefcase size={16} /> Assigned Leads ({enquiries.length})
            </button>
            <button 
              onClick={() => { setActiveTab('profile'); closeActions(); }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 20px', 
                borderRadius: '10px', 
                background: activeTab === 'profile' ? 'var(--color-primary)' : 'transparent', 
                color: activeTab === 'profile' ? '#fff' : 'var(--text-muted)', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: 700,
                transition: 'all 0.2s ease'
              }}
            >
              <User size={16} /> My Profile
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 450px' : '1fr', gap: '32px', alignItems: 'start', transition: 'all 0.3s ease' }}>
            
            {/* Left/Main List Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Dropdown status selector */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--surface-border)', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--heading-color)' }}>
                  Filter {activeTab === 'complaints' ? 'Complaints' : 'Leads'} List:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid var(--surface-border-mid)', background: 'var(--surface-2)', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="All">All Jobs</option>
                    <option value="Assigned">Assigned / Allocated</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved / Completed</option>
                  </select>
                </div>
              </div>

              {activeTab === 'complaints' ? (
                complaints.filter(c => statusFilter === 'All' || c.status === statusFilter).length === 0 ? (
                  <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '48px', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No active scale failure complaints matching "{statusFilter}".</p>
                  </div>
                ) : (
                  complaints.filter(c => statusFilter === 'All' || c.status === statusFilter).map(c => (
                    <div key={c.id} style={{ background: 'var(--surface-1)', borderRadius: '20px', padding: '28px', border: selectedTicket?.id === c.id && activeTab === 'complaints' ? '2.5px solid var(--color-primary)' : '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>{c.subject}</h3>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          padding: '4px 10px', 
                          borderRadius: '12px', 
                          background: c.status === 'Assigned' ? 'rgba(59,130,246,0.08)' : c.status === 'Resolved' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                          color: c.status === 'Assigned' ? 'var(--color-primary)' : c.status === 'Resolved' ? 'var(--success)' : 'var(--color-secondary)'
                        }}>{c.status}</span>
                      </div>
                      
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>{c.description}</p>
                      
                      <div style={{ background: 'var(--surface-2)', padding: '16px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', border: '1px solid var(--surface-border)', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--heading-color)' }}>Client:</strong> {c.userName} | 📞 {c.userPhone || 'No phone'} | ✉️ {c.userEmail}<br/>
                        {c.visitSchedule ? (
                          <span style={{ color: 'var(--color-primary)', display: 'inline-block', marginTop: '6px', fontWeight: 700 }}>
                            🗓️ Visit Scheduled: {new Date(c.visitSchedule.scheduledDate).toLocaleDateString()} at {c.visitSchedule.scheduledTime}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-secondary)', display: 'inline-block', marginTop: '6px', fontWeight: 700 }}>
                            ⚠️ Field visit not scheduled yet.
                          </span>
                        )}
                      </div>

                      {/* Photo Logs */}
                      {c.images && c.images.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: 700 }}>Job Photo Logs ({c.images.length})</h4>
                          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                            {c.images.map(img => (
                              <div key={img.id} style={{ position: 'relative', width: '76px', height: '76px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--surface-border)', flexShrink: 0 }}>
                                <img src={img.imagePath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick={() => openAction(c, 'status')} style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border-mid)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>
                          ✏️ Update Status
                        </button>
                        <button onClick={() => openAction(c, 'schedule')} style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border-mid)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>
                          🗓️ Schedule Visit
                        </button>
                        <button onClick={() => openAction(c, 'image')} style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border-mid)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>
                          📷 Upload Photo
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                enquiries.filter(e => statusFilter === 'All' || e.status === statusFilter).length === 0 ? (
                  <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '48px', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No lead enquiries matching "{statusFilter}".</p>
                  </div>
                ) : (
                  enquiries.filter(e => statusFilter === 'All' || e.status === statusFilter).map(e => (
                    <div key={e.id} style={{ background: 'var(--surface-1)', borderRadius: '20px', padding: '28px', border: selectedTicket?.id === e.id && activeTab === 'enquiries' ? '2.5px solid var(--color-primary)' : '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.5px' }}>{e.service}</span>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginTop: '4px', margin: 0 }}>{e.name}</h3>
                        </div>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          padding: '4px 10px', 
                          borderRadius: '12px', 
                          background: e.status === 'Assigned' ? 'rgba(59,130,246,0.08)' : e.status === 'Resolved' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                          color: e.status === 'Assigned' ? 'var(--color-primary)' : e.status === 'Resolved' ? 'var(--success)' : 'var(--color-secondary)'
                        }}>{e.status}</span>
                      </div>
                      
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>{e.message}</p>
                      
                      <div style={{ background: 'var(--surface-2)', padding: '16px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', border: '1px solid var(--surface-border)' }}>
                        📞 Phone: <strong>{e.phone || 'N/A'}</strong> | ✉️ Email: <strong>{e.email}</strong>
                      </div>

                      {/* Photo Logs */}
                      {e.images && e.images.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: 700 }}>Lead Interaction Photo Logs ({e.images.length})</h4>
                          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                            {e.images.map(img => (
                              <div key={img.id} style={{ position: 'relative', width: '76px', height: '76px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--surface-border)', flexShrink: 0 }}>
                                <img src={img.imagePath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => openAction(e, 'status')} style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border-mid)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>
                          ✏️ Update Status
                        </button>
                        <button onClick={() => openAction(e, 'image')} style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border-mid)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>
                          📷 Upload Photo
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* Tab: My Profile */}
              {activeTab === 'profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Profile Info Card */}
                  <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '28px' }}>My Profile</h2>
                    
                    {/* Avatar + Info Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '32px', flexWrap: 'wrap' }}>
                      <div style={{ width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(36,82,143,0.1)', border: '4px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {empProfile?.photoPath
                          ? <img src={empProfile.photoPath} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <User size={40} color="var(--color-primary)" />
                        }
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif' }}>{empProfile?.name || employee?.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 700 }}>{empProfile?.department}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{empProfile?.email}</div>
                        {empProfile?.phone && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📞 {empProfile.phone}</div>}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '28px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--heading-color)', marginBottom: '20px' }}>Update Profile Photo</h3>
                      <form onSubmit={handleSelfPhotoUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
                        
                        {/* Live preview */}
                        {empPhotoFile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-2)', padding: '16px 20px', borderRadius: '14px', border: '1.5px solid var(--color-primary)' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-primary)', flexShrink: 0 }}>
                              <img src={URL.createObjectURL(empPhotoFile)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--heading-color)' }}>Preview</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{empPhotoFile.name}</div>
                            </div>
                          </div>
                        )}

                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Choose Photo</label>
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={e => setEmpPhotoFile(e.target.files[0] || null)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '14px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box' }}
                          />
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>JPG, PNG or WEBP. Square photos work best.</span>
                        </div>

                        <button 
                          type="submit"
                          disabled={actionLoading || !empPhotoFile}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: !empPhotoFile ? 'var(--surface-border-mid)' : 'var(--color-primary)', color: !empPhotoFile ? 'var(--text-muted)' : '#fff', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: !empPhotoFile ? 'not-allowed' : 'pointer', width: 'fit-content', transition: 'all 0.2s ease' }}
                        >
                          {actionLoading ? 'Uploading...' : '📷 Save Profile Photo'}
                        </button>
                      </form>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Right Action Sidebar Panel */}
            {selectedTicket && (
              <div style={{ background: 'var(--surface-grad-soft)', borderRadius: '24px', padding: '36px', border: '1.5px solid var(--color-primary)', boxShadow: 'var(--shadow-xl)', position: 'sticky', top: '90px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                    {actionType === 'status' && 'Update Status'}
                    {actionType === 'schedule' && 'Schedule Field Visit'}
                    {actionType === 'image' && 'Upload Action Photo'}
                  </h3>
                  <button onClick={closeActions} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '24px', fontWeight: 800 }}>
                    &times;
                  </button>
                </div>
                
                <div style={{ fontSize: '13px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', border: '1px solid var(--surface-border)' }}>
                  Active ID: <strong>#{selectedTicket.id}</strong> | Summary: {selectedTicket.subject || selectedTicket.service}
                </div>

                {/* Form: Status Update */}
                {actionType === 'status' && (
                  <form onSubmit={handleStatusChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Select Status</label>
                      <select 
                        value={statusVal} 
                        onChange={e => setStatusVal(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved (Complete Job)</option>
                      </select>
                    </div>

                    {statusVal === 'Resolved' && activeTab === 'complaints' && (
                      <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '16px', borderRadius: '12px', border: '1px dashed rgba(245, 158, 11, 0.25)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ ...labelStyle, color: 'var(--color-secondary)' }}>Customer Closure OTP Required</label>
                        <input 
                          type="text" 
                          value={otpVal}
                          onChange={e => setOtpVal(e.target.value)}
                          placeholder="Enter 6-digit OTP code"
                          maxLength="6"
                          required
                          style={inputStyle}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          OTP must match the code generated on the customer's dashboard complaint history.
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={actionLoading}>
                        {actionLoading ? "Saving..." : 'Save Status'}
                      </button>
                      <button type="button" onClick={closeActions} className="btn btn-outline" style={{ border: '1.5px solid var(--surface-border-mid)' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Form: Schedule Visit */}
                {actionType === 'schedule' && (
                  <form onSubmit={handleScheduleVisit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={labelStyle}>Scheduled Date</label>
                      <input 
                        type="date" 
                        value={schedVal.date}
                        onChange={e => setSchedVal(prev => ({ ...prev, date: e.target.value }))}
                        required
                        style={inputStyle}
                      />
                    </div>
                    
                    <div>
                      <label style={labelStyle}>Scheduled Time</label>
                      <input 
                        type="time" 
                        value={schedVal.time}
                        onChange={e => setSchedVal(prev => ({ ...prev, time: e.target.value }))}
                        required
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Site Action Notes</label>
                      <textarea 
                        value={schedVal.notes}
                        onChange={e => setSchedVal(prev => ({ ...prev, notes: e.target.value }))}
                        rows="3"
                        placeholder="Special instructions, parts needed..."
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={actionLoading}>
                        {actionLoading ? "Setting..." : 'Set Visit'}
                      </button>
                      <button type="button" onClick={closeActions} className="btn btn-outline" style={{ border: '1.5px solid var(--surface-border-mid)' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Form: Image Upload */}
                {actionType === 'image' && (
                  <form onSubmit={handleImageUpload} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={labelStyle}>Select Image File</label>
                      <input 
                        type="file" 
                        onChange={e => setImageVal(prev => ({ ...prev, file: e.target.files[0] }))}
                        accept="image/*"
                        required
                        style={{ ...inputStyle, padding: '10px' }}
                      />
                    </div>

                    {activeTab === 'complaints' && (
                      <div>
                        <label style={labelStyle}>Photo Phase Type</label>
                        <select 
                          value={imageVal.type}
                          onChange={e => setImageVal(prev => ({ ...prev, type: e.target.value }))}
                          style={inputStyle}
                        >
                          <option value="before">Before Fix (Proof of Fault)</option>
                          <option value="after">After Fix (Proof of Completion)</option>
                          <option value="client_photo">Client Interaction Photo</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>Photo Description</label>
                      <input 
                        type="text" 
                        value={imageVal.description}
                        onChange={e => setImageVal(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="e.g. Weighbridge junction box rewired, load cell calibrated."
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={actionLoading}>
                        {actionLoading ? "Uploading..." : 'Upload Photo'}
                      </button>
                      <button type="button" onClick={closeActions} className="btn btn-outline" style={{ border: '1.5px solid var(--surface-border-mid)' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 📝 BLOG EDITORIAL DASHBOARD SUB-COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function BlogEditorialDashboard({ employee, handleLogout, router }) {
  const [blogs, setBlogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [notify, setNotify] = React.useState({ type: '', text: '' });
  
  // Modals & Active Blog
  const [isModalOpen, setIsModalOpen] = React.useState(false); // true for create/edit
  const [modalType, setModalType] = React.useState('create'); // 'create' or 'edit'
  const [selectedBlog, setSelectedBlog] = React.useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [activePreviewTab, setActivePreviewTab] = React.useState('edit'); // 'edit' or 'preview'

  // Form inputs
  const [form, setForm] = React.useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    metaTitle: '',
    metaDescription: ''
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        setNotify({ type: 'danger', text: 'Failed to retrieve blog posts.' });
      }
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Error contacting blogs API server.' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBlogs();
  }, []);

  const showNotify = (type, text) => {
    setNotify({ type, text });
    setTimeout(() => setNotify({ type: '', text: '' }), 5000);
  };

  // Helper to slugify text
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric except space and hyphen
      .replace(/[\s_]+/g, '-')       // replace spaces and underscores with hyphens
      .replace(/-+/g, '-');          // remove consecutive hyphens
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setForm(prev => {
      const updated = { ...prev, title: val };
      // Only auto-generate slug in create mode
      if (modalType === 'create') {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  const openCreateModal = () => {
    setModalType('create');
    setSelectedBlog(null);
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      metaTitle: '',
      metaDescription: ''
    });
    setActivePreviewTab('edit');
    setIsModalOpen(true);
  };

  const openEditModal = async (blogItem) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/blogs/${blogItem.slug}`);
      if (res.ok) {
        const fullBlog = await res.json();
        setSelectedBlog(fullBlog);
        setForm({
          title: fullBlog.title,
          slug: fullBlog.slug,
          summary: fullBlog.summary,
          content: fullBlog.content,
          metaTitle: fullBlog.metaTitle || '',
          metaDescription: fullBlog.metaDescription || ''
        });
        setModalType('edit');
        setActivePreviewTab('edit');
        setIsModalOpen(true);
      } else {
        showNotify('danger', 'Failed to retrieve full blog details.');
      }
    } catch (err) {
      console.error(err);
      showNotify('danger', 'Error loading blog details.');
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteConfirm = (blogItem) => {
    setSelectedBlog(blogItem);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');

    const method = modalType === 'create' ? 'POST' : 'PUT';
    const endpoint = modalType === 'create' ? '/api/blogs' : `/api/blogs/${selectedBlog.slug}`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        showNotify('success', modalType === 'create' ? 'Blog post published!' : 'Blog post updated successfully!');
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        showNotify('danger', data.error || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
      showNotify('danger', 'Failed to save blog post.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    const token = localStorage.getItem('lwt_token');
    try {
      const res = await fetch(`/api/blogs/${selectedBlog.slug}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showNotify('success', 'Blog post deleted successfully.');
        setIsDeleteOpen(false);
        fetchBlogs();
      } else {
        const data = await res.json();
        showNotify('danger', data.error || 'Failed to delete blog.');
      }
    } catch (err) {
      console.error(err);
      showNotify('danger', 'Network error deleting blog.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.summary && b.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <div className="container" style={{ padding: '40px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Dashboard Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '8px', background: 'rgba(245,158,11,0.08)', padding: '6px 14px', borderRadius: '100px', border: '1px solid rgba(245,158,11,0.12)' }}>SEO Content Hub</span>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Hello, {employee?.name}</h1>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Logged in as: <strong>{employee?.department} Manager</strong></p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={openCreateModal}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 700 }}
              >
                <Plus size={16} /> Write Blog Post
              </button>
              <button 
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {notify.text && (
            <div style={{ 
              padding: '14px 18px', 
              borderRadius: '12px', 
              background: notify.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)', 
              color: notify.type === 'success' ? '#10b981' : '#f43f5e', 
              border: `1px solid ${notify.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
              marginBottom: '30px',
              fontSize: '14px',
              fontWeight: 500
            }}>
              {notify.text}
            </div>
          )}

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Total Articles</span>
              <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--heading-color)', margin: '8px 0 4px', fontFamily: 'Outfit, sans-serif' }}>{blogs.length}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={14} /> Active & Search Engine Indexed
              </p>
            </div>
            
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>SEO Score Health</span>
              <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--heading-color)', margin: '8px 0 4px', fontFamily: 'Outfit, sans-serif' }}>98%</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-secondary)' }}>All posts feature dynamic meta tags</p>
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--surface-border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Platform Department</span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', margin: '14px 0 4px', fontFamily: 'Outfit, sans-serif' }}>Blog Editorial</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Created via administrator dashboard</p>
            </div>
          </div>

          {/* Blogs Section */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--surface-border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>SEO Content Registry</h2>
              
              <input 
                type="text" 
                placeholder="Search articles by title or URL slug..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1.5px solid var(--surface-border-mid)', background: 'var(--surface-2)', color: 'var(--text-main)', fontSize: '14px', width: '320px', outline: 'none' }}
              />
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2.5px solid var(--surface-border-mid)', borderTopColor: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', border: '2px dashed var(--surface-border-mid)', borderRadius: '16px' }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 16px' }}>No blog posts matching your search query.</p>
                <button onClick={openCreateModal} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  + Create First Post
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--surface-border-mid)' }}>
                      <th style={{ padding: '16px', fontSize: '13px', fontWeight: 700, color: 'var(--heading-color)', textTransform: 'uppercase' }}>Title & Summary</th>
                      <th style={{ padding: '16px', fontSize: '13px', fontWeight: 700, color: 'var(--heading-color)', textTransform: 'uppercase' }}>URL Slug</th>
                      <th style={{ padding: '16px', fontSize: '13px', fontWeight: 700, color: 'var(--heading-color)', textTransform: 'uppercase' }}>Published On</th>
                      <th style={{ padding: '16px', fontSize: '13px', fontWeight: 700, color: 'var(--heading-color)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--surface-border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '16px', maxWidth: '380px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--heading-color)', fontSize: '15px', marginBottom: '4px' }}>{b.title}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.summary}</div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-primary)', border: '1px solid var(--surface-border)' }}>
                            /blog/{b.slug}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
                          {new Date(b.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <Link href={`/blog/${b.slug}`} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '8px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-muted)' }} title="View Post Live">
                              <Eye size={16} />
                            </Link>
                            <button 
                              onClick={() => openEditModal(b)} 
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(36,82,143,0.06)', border: '1px solid rgba(36,82,143,0.15)', color: 'var(--color-primary)', cursor: 'pointer' }}
                              title="Edit Post"
                            >
                              <FileEdit size={16} />
                            </button>
                            <button 
                              onClick={() => openDeleteConfirm(b)} 
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer' }}
                              title="Delete Post"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ═════════ WRITE/EDIT MODAL ═════════ */}
          {isModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(9,13,22,0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--surface-border)', borderRadius: '24px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
                
                {/* Modal Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--surface-border-mid)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                    {modalType === 'create' ? 'Draft New Article' : 'Edit Published Article'}
                  </h2>
                  
                  {/* Mode Selector */}
                  <div style={{ display: 'flex', background: 'var(--surface-2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                    <button 
                      type="button"
                      onClick={() => setActivePreviewTab('edit')} 
                      style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, background: activePreviewTab === 'edit' ? 'var(--surface-1)' : 'transparent', color: activePreviewTab === 'edit' ? 'var(--color-primary)' : 'var(--text-muted)', boxShadow: activePreviewTab === 'edit' ? 'var(--shadow-sm)' : 'none' }}
                    >
                      Editor
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActivePreviewTab('preview')} 
                      style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, background: activePreviewTab === 'preview' ? 'var(--surface-1)' : 'transparent', color: activePreviewTab === 'preview' ? 'var(--color-primary)' : 'var(--text-muted)', boxShadow: activePreviewTab === 'preview' ? 'var(--shadow-sm)' : 'none' }}
                    >
                      Preview Content
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  
                  {/* Modal Body */}
                  <div style={{ padding: '32px', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {activePreviewTab === 'edit' ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                          <div>
                            <label style={labelStyle}>Article Title</label>
                            <input 
                              type="text" 
                              required
                              value={form.title}
                              onChange={handleTitleChange}
                              placeholder="e.g. Navigating Industrial Scale Calibration Guidelines"
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>URL Slug</label>
                            <input 
                              type="text" 
                              required
                              value={form.slug}
                              onChange={e => setForm(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                              placeholder="navigating-industrial-scale-guidelines"
                              style={inputStyle}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={labelStyle}>Meta Title (SEO)</label>
                          <input 
                            type="text" 
                            value={form.metaTitle}
                            onChange={e => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                            placeholder="Defaults to Article Title"
                            style={inputStyle}
                          />
                          <span style={{ fontSize: '11px', color: form.metaTitle.length > 60 ? '#f43f5e' : 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                            Character Count: {form.metaTitle.length} / 60 (recommended max)
                          </span>
                        </div>

                        <div>
                          <label style={labelStyle}>SEO Summary / Meta Description</label>
                          <textarea 
                            required
                            value={form.summary}
                            onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
                            placeholder="Provide a search-engine snippet summarizing the post..."
                            style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                          />
                          <span style={{ fontSize: '11px', color: form.summary.length > 160 ? '#f43f5e' : 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                            Character Count: {form.summary.length} / 160 (recommended max)
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <label style={labelStyle}>Content (Markdown / HTML Supported)</label>
                          <textarea 
                            required
                            value={form.content}
                            onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Write the full post contents here..."
                            style={{ ...inputStyle, flexGrow: 1, minHeight: '260px', fontFamily: 'monospace', resize: 'vertical' }}
                          />
                        </div>
                      </>
                    ) : (
                      // Live Preview Pane
                      <div style={{ padding: '20px', border: '1px solid var(--surface-border)', borderRadius: '12px', background: 'var(--surface-2)', minHeight: '350px', overflowY: 'auto' }}>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--heading-color)', marginBottom: '8px' }}>{form.title || 'Untitled Post'}</h1>
                        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', borderBottom: '1px solid var(--surface-border-mid)', paddingBottom: '12px' }}>
                          URL Slug: <strong>/blog/{form.slug || 'unset'}</strong> | SEO Title: <strong>{form.metaTitle || form.title || 'unset'}</strong>
                        </p>
                        
                        <div style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                          {form.content || <em style={{ color: 'var(--text-muted)' }}>Write content to view a live typographic preview.</em>}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Modal Footer */}
                  <div style={{ padding: '20px 32px', background: 'var(--surface-2)', borderTop: '1px solid var(--surface-border-mid)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)} 
                      className="btn btn-outline" 
                      style={{ border: '1.5px solid var(--surface-border-mid)' }}
                    >
                      Discard Draft
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Publishing...' : (modalType === 'create' ? 'Publish Article' : 'Save Changes')}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* ═════════ DELETE CONFIRMATION MODAL ═════════ */}
          {isDeleteOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(9,13,22,0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--surface-border)', borderRadius: '20px', width: '100%', maxWidth: '450px', padding: '30px', boxShadow: 'var(--shadow-xl)', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.08)', color: '#ef4444', marginBottom: '20px' }}>
                  <Trash2 size={24} />
                </div>
                
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>Delete Blog Post?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
                  Are you sure you want to permanently delete the post <strong>"{selectedBlog?.title}"</strong>? This action will permanently remove it from search engines and index crawlers.
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleDelete}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ef4444', color: '#fff', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button 
                    onClick={() => setIsDeleteOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1, border: '1.5px solid var(--surface-border-mid)', justifyContent: 'center' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
