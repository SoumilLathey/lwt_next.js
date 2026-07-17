"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('complaints');
  
  // Lists
  const [complaints, setComplaints] = React.useState([]);
  const [enquiries, setEnquiries] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  
  // Specific Customer Profile sub-actions
  const [selectedUser, setSelectedUser] = React.useState(null); // client user for profiles/edits
  const [userInstallations, setUserInstallations] = React.useState([]);
  const [userEquipment, setUserEquipment] = React.useState([]);
  
  // Modals & form selectors
  const [actionTarget, setActionTarget] = React.useState(null); // item being actioned
  const [actionType, setActionType] = React.useState(''); // 'assign_complaint', 'assign_enquiry', 'add_solar', 'add_equipment', 'create_employee', 'create_project', 'reset_password_user', 'reset_password_emp', 'edit_user'
  
  // Form values
  const [assigneeId, setAssigneeId] = React.useState('');
  const [solarForm, setSolarForm] = React.useState({ capacity: '10kW Grid-Tie', installationDate: '', address: '', status: 'Active' });
  const [equipForm, setEquipForm] = React.useState({ equipmentType: 'Pitless Weighbridge', model: 'LWT-100T', capacity: '100 Tons', serialNumber: '', installationDate: '', location: '', status: 'Active', notes: '' });
  const [empForm, setEmpForm] = React.useState({ name: '', email: '', password: '', phone: '', department: 'Field Engineering', photo: null });
  const [projForm, setProjForm] = React.useState({ name: '', description: '', startDate: '', endDate: '', employeeIds: [] });
  const [passResetVal, setPassResetVal] = React.useState('');
  const [userEditForm, setUserEditForm] = React.useState({ name: '', email: '', phone: '', address: '', pincode: '' });
  const [empPhotoFile, setEmpPhotoFile] = React.useState(null);

  // Loaders & Notifications
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [notify, setNotify] = React.useState({ type: '', text: '' });

  // Dropdown filter states
  const [complaintFilter, setComplaintFilter] = React.useState('All');
  const [enquiryFilter, setEnquiryFilter] = React.useState('All');
  const [clientFilter, setClientFilter] = React.useState('All');
  const [staffFilter, setStaffFilter] = React.useState('All');

  React.useEffect(() => {
    const token = localStorage.getItem('lwt_token');
    const storedUser = localStorage.getItem('lwt_user');
    
    if (!token || !storedUser) {
      router.push('/login');
      return;
    }
    
    const parsed = JSON.parse(storedUser);
    if (!parsed.isAdmin) {
      router.push('/login');
      return;
    }
    
    setAdmin(parsed);
    fetchAdminData(token);
  }, []);

  const fetchAdminData = async (token) => {
    setLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const compRes = await fetch('/api/complaints', { headers });
      if (compRes.ok) setComplaints(await compRes.json());
      
      const enqRes = await fetch('/api/enquiries', { headers });
      if (enqRes.ok) setEnquiries(await enqRes.json());
      
      const usersRes = await fetch('/api/admin/users', { headers });
      if (usersRes.ok) setUsers(await usersRes.json());
      
      const empRes = await fetch('/api/admin/employees', { headers });
      if (empRes.ok) setEmployees(await empRes.json());
      
      const projRes = await fetch('/api/projects', { headers });
      if (projRes.ok) setProjects(await projRes.json());
      
    } catch (err) {
      console.error(err);
      setNotify({ type: 'danger', text: 'Error loading admin datasets.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedUserProfile = async (userId) => {
    const token = localStorage.getItem('lwt_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const solarRes = await fetch(`/api/admin/solar-installations/user/${userId}`, { headers });
      if (solarRes.ok) setUserInstallations(await solarRes.json());
      
      const eqRes = await fetch(`/api/admin/weighing-equipment/user/${userId}`, { headers });
      if (eqRes.ok) setUserEquipment(await eqRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const selectUserForManagement = (userObj) => {
    setSelectedUser(userObj);
    setUserEditForm({
      name: userObj.name,
      email: userObj.email,
      phone: userObj.phone || '',
      address: userObj.address || '',
      pincode: userObj.pincode || ''
    });
    fetchSelectedUserProfile(userObj.id);
  };

  const handleToggleVerification = async (userId, currentStatus) => {
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified: !currentStatus })
      });
      if (response.ok) {
        setNotify({ type: 'success', text: 'User verification status updated!' });
        fetchAdminData(token);
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(prev => ({ ...prev, isVerified: !currentStatus ? 1 : 0 }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleEmployee = async (empId) => {
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch(`/api/admin/employees/${empId}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotify({ type: 'success', text: 'Employee active status toggled!' });
        fetchAdminData(token);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssignComplaint = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch(`/api/admin/complaints/${actionTarget.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ employeeId: assigneeId })
      });
      
      const data = await response.json();
      if (response.ok) {
        setNotify({ type: 'success', text: 'Complaint allocated successfully!' });
        closeActionForm();
        fetchAdminData(token);
      } else {
        setNotify({ type: 'danger', text: data.error || 'Failed to allocate complaint.' });
      }
    } catch (err) {
      console.log(err);
      setNotify({ type: 'danger', text: 'Connection error. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignEnquiry = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch(`/api/admin/enquiries/${actionTarget.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ employeeId: assigneeId })
      });
      
      const data = await response.json();
      if (response.ok) {
        setNotify({ type: 'success', text: 'Enquiry lead allocated successfully!' });
        closeActionForm();
        fetchAdminData(token);
      } else {
        setNotify({ type: 'danger', text: data.error || 'Failed to allocate enquiry.' });
      }
    } catch (err) {
      console.log(err);
      setNotify({ type: 'danger', text: 'Connection error. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSolar = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch('/api/admin/solar-installations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...solarForm, userId: selectedUser.id })
      });
      if (response.ok) {
        setNotify({ type: 'success', text: 'Solar installation profile added!' });
        setSolarForm({ capacity: '10kW Grid-Tie', installationDate: '', address: '', status: 'Active' });
        closeActionForm();
        fetchSelectedUserProfile(selectedUser.id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSolar = async (id) => {
    if (!confirm('Are you sure you want to delete this installation?')) return;
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch(`/api/admin/solar-installations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotify({ type: 'success', text: 'Installation removed.' });
        fetchSelectedUserProfile(selectedUser.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch('/api/admin/weighing-equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...equipForm, userId: selectedUser.id })
      });
      if (response.ok) {
        setNotify({ type: 'success', text: 'Scale equipment profile added!' });
        setEquipForm({ equipmentType: 'Pitless Weighbridge', model: 'LWT-100T', capacity: '100 Tons', serialNumber: '', installationDate: '', location: '', status: 'Active', notes: '' });
        closeActionForm();
        fetchSelectedUserProfile(selectedUser.id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!confirm('Are you sure you want to delete this equipment profile?')) return;
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch(`/api/admin/weighing-equipment/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotify({ type: 'success', text: 'Equipment profile removed.' });
        fetchSelectedUserProfile(selectedUser.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const token = localStorage.getItem('lwt_token');
    const formData = new FormData();
    formData.append('email', empForm.email);
    formData.append('password', empForm.password);
    formData.append('name', empForm.name);
    formData.append('phone', empForm.phone);
    formData.append('department', empForm.department);
    if (empForm.photo) {
      formData.append('photo', empForm.photo);
    }

    try {
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        setNotify({ type: 'success', text: 'New employee registered successfully!' });
        setEmpForm({ name: '', email: '', password: '', phone: '', department: 'Field Engineering', photo: null });
        closeActionForm();
        fetchAdminData(token);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to register employee');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projForm)
      });
      if (response.ok) {
        setNotify({ type: 'success', text: 'Project team created successfully!' });
        setProjForm({ name: '', description: '', startDate: '', endDate: '', employeeIds: [] });
        closeActionForm();
        fetchAdminData(token);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setNotify({ type: '', text: '' });
    const token = localStorage.getItem('lwt_token');
    try {
      const endpoint = actionType === 'reset_password_user'
        ? `/api/admin/users/${actionTarget.id}/reset-password`
        : `/api/admin/employees/${actionTarget.id}/reset-password`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: passResetVal })
      });
      
      const data = await response.json();
      if (response.ok) {
        setNotify({ type: 'success', text: 'Password reset successful!' });
        setPassResetVal('');
        closeActionForm();
      } else {
        setNotify({ type: 'danger', text: data.error || 'Failed to reset password.' });
      }
    } catch (err) {
      console.log(err);
      setNotify({ type: 'danger', text: 'Connection error. Please check your network and try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const token = localStorage.getItem('lwt_token');
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userEditForm)
      });
      if (response.ok) {
        setNotify({ type: 'success', text: 'User details updated!' });
        closeActionForm();
        fetchAdminData(token);
        setSelectedUser(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateEmployeePhoto = async (e) => {
    e.preventDefault();
    if (!empPhotoFile || !actionTarget) return;
    setActionLoading(true);
    const token = localStorage.getItem('lwt_token');
    const formData = new FormData();
    formData.append('photo', empPhotoFile);
    try {
      const response = await fetch(`/api/admin/employees/${actionTarget.id}/photo`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setNotify({ type: 'success', text: `Photo updated for ${actionTarget.name}!` });
        setEmpPhotoFile(null);
        closeActionForm();
        fetchAdminData(token);
      } else {
        setNotify({ type: 'danger', text: data.error || 'Failed to update photo.' });
      }
    } catch (err) {
      console.log(err);
      setNotify({ type: 'danger', text: 'Connection error.' });
    } finally {
      setActionLoading(false);
    }
  };

  const openActionForm = (target, type) => {
    setActionTarget(target);
    setActionType(type);
    setAssigneeId(target?.assignedEmployeeId || '');
  };

  const closeActionForm = () => {
    setActionTarget(null);
    setActionType('');
  };

  const handleLogout = () => {
    localStorage.removeItem('lwt_token');
    localStorage.removeItem('lwt_user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  const activeComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'Pending').length;
  const pendingApprovalsCount = users.filter(u => !u.isVerified).length;

  // Filter derivations
  const filteredComplaints = complaints.filter(c => {
    if (complaintFilter === 'Unassigned') return !c.assignedEmployeeName;
    if (complaintFilter === 'Assigned') return !!c.assignedEmployeeName && c.status !== 'Resolved';
    if (complaintFilter === 'Resolved') return c.status === 'Resolved';
    return true;
  });

  const filteredEnquiries = enquiries.filter(e => {
    if (enquiryFilter === 'Unassigned') return !e.assignedEmployeeName;
    if (enquiryFilter === 'Assigned') return !!e.assignedEmployeeName && e.status !== 'Resolved';
    if (enquiryFilter === 'Resolved') return e.status === 'Resolved';
    return true;
  });

  const filteredUsers = users.filter(u => {
    if (clientFilter === 'Verified') return u.isVerified;
    if (clientFilter === 'Pending') return !u.isVerified;
    return true;
  });

  const filteredEmployees = employees.filter(emp => {
    if (staffFilter === 'Active') return emp.isActive;
    if (staffFilter === 'Suspended') return !emp.isActive;
    if (staffFilter !== 'All') return emp.department === staffFilter;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      
      {/* Main Area */}
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <div className="container" style={{ padding: '40px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header Title with Admin Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '8px', background: 'rgba(245,158,11,0.08)', padding: '6px 14px', borderRadius: '100px', border: '1px solid rgba(245,158,11,0.12)' }}>Administrator Workspace</span>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Management Control Panel</h1>
            </div>
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              LogOut
            </button>
          </div>

          {/* Dashboard Analytics blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            {[
              { title: "Active Complaints", count: activeComplaintsCount, border: 'var(--color-primary)' },
              { title: "Pending Leads", count: pendingEnquiriesCount, border: 'var(--color-accent)' },
              { title: "Approvals Pending", count: pendingApprovalsCount, border: 'var(--color-secondary)' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'var(--surface-1)', padding: '24px', borderRadius: '16px', border: '1px solid var(--surface-border)', borderLeft: `5px solid ${stat.border}`, boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: 700 }}>{stat.title}</h3>
                <p style={{ fontSize: '32px', fontWeight: '800', marginTop: '10px', color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>{stat.count}</p>
              </div>
            ))}
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

          {/* Tab Controls */}
          <div style={{ display: 'flex', background: 'var(--surface-1)', borderRadius: '16px', padding: '6px', marginBottom: '32px', border: '1px solid var(--surface-border)', flexWrap: 'wrap', gap: '4px' }}>
            {['complaints', 'enquiries', 'clients', 'staff', 'projects'].map(tab => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedUser(null); closeActionForm(); }}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? 700 : 600,
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: (actionType || selectedUser) ? '1fr 480px' : '1fr', gap: '32px', alignItems: 'start', transition: 'all 0.3s ease' }}>
            
            {/* LEFT: Tab panels lists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Tab: Complaints */}
              {activeTab === 'complaints' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                        Failure Tickets ({filteredComplaints.length})
                      </h2>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Filter:</span>
                        <select 
                          value={complaintFilter}
                          onChange={e => setComplaintFilter(e.target.value)}
                          style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid var(--surface-border-mid)', background: 'var(--surface-2)', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                        >
                          <option value="All">All Tickets</option>
                          <option value="Unassigned">Unassigned Only</option>
                          <option value="Assigned">Active Assigned</option>
                          <option value="Resolved">Resolved / Closed</option>
                        </select>
                      </div>
                    </div>

                    {filteredComplaints.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No failure complaints matching "{complaintFilter}".</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredComplaints.map(c => (
                          <div key={c.id} style={{ padding: '20px', background: 'var(--surface-2)', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--heading-color)', margin: 0 }}>{c.subject}</h4>
                              <span style={{ 
                                fontSize: '11px', 
                                fontWeight: 700, 
                                padding: '4px 10px', 
                                borderRadius: '12px', 
                                background: !c.assignedEmployeeName ? 'rgba(245,158,11,0.08)' : c.status === 'Resolved' ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)',
                                color: !c.assignedEmployeeName ? 'var(--color-secondary)' : c.status === 'Resolved' ? 'var(--success)' : 'var(--color-primary)'
                              }}>
                                {!c.assignedEmployeeName ? 'Unassigned' : c.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{c.description}</p>
                            
                            <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                              <span>Client: <strong>{c.userName}</strong> ({c.userPhone})</span>
                              {c.assignedEmployeeName && (
                                <>
                                  <span style={{ width: '1px', height: '12px', background: 'var(--surface-border-mid)' }}></span>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.08)', color: 'var(--color-primary)', border: '1px solid rgba(59,130,246,0.12)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '11px' }}>
                                    ENGINEER: {c.assignedEmployeeName}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Visit schedule metadata */}
                            {c.visitSchedule && (
                              <div style={{ background: 'var(--surface-1)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--surface-border)', fontSize: '13px', marginBottom: '16px' }}>
                                🗓️ <strong>Scheduled Visit:</strong> {new Date(c.visitSchedule.scheduledDate).toLocaleDateString()} at {c.visitSchedule.scheduledTime}
                                {c.visitSchedule.notes && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>Notes: {c.visitSchedule.notes}</p>}
                              </div>
                            )}

                            {/* Action photos */}
                            {c.images && c.images.length > 0 && (
                              <div style={{ marginBottom: '16px' }}>
                                <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 700 }}>Job Photo Logs ({c.images.length})</h4>
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                                  {c.images.map(img => (
                                    <div key={img.id} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--surface-border)', flexShrink: 0 }}>
                                      <img src={img.imagePath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => openActionForm(c, 'assign_complaint')} style={{ background: 'var(--surface-1)', border: '1px solid var(--surface-border-mid)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                                {c.assignedEmployeeName ? 'Reallocate Engineer' : 'Allocate Engineer'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Enquiries */}
              {activeTab === 'enquiries' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                        Business Leads ({filteredEnquiries.length})
                      </h2>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Filter:</span>
                        <select 
                          value={enquiryFilter}
                          onChange={e => setEnquiryFilter(e.target.value)}
                          style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid var(--surface-border-mid)', background: 'var(--surface-2)', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                        >
                          <option value="All">All Leads</option>
                          <option value="Unassigned">Unassigned Only</option>
                          <option value="Assigned">Active Assigned</option>
                          <option value="Resolved">Resolved / Closed</option>
                        </select>
                      </div>
                    </div>

                    {filteredEnquiries.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No leads matching "{enquiryFilter}".</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredEnquiries.map(e => (
                          <div key={e.id} style={{ padding: '20px', background: 'var(--surface-2)', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <div>
                                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-secondary)' }}>{e.service}</span>
                                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginTop: '2px', margin: 0 }}>{e.name}</h4>
                              </div>
                              <span style={{ 
                                fontSize: '11px', 
                                fontWeight: 700, 
                                padding: '4px 10px', 
                                borderRadius: '12px', 
                                background: !e.assignedEmployeeName ? 'rgba(245,158,11,0.08)' : e.status === 'Resolved' ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)',
                                color: !e.assignedEmployeeName ? 'var(--color-secondary)' : e.status === 'Resolved' ? 'var(--success)' : 'var(--color-primary)'
                              }}>
                                {!e.assignedEmployeeName ? 'Unassigned' : e.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{e.message}</p>
                            
                            <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                              <span>Phone: {e.phone || 'N/A'} | Email: {e.email}</span>
                              {e.assignedEmployeeName && (
                                <>
                                  <span style={{ width: '1px', height: '12px', background: 'var(--surface-border-mid)' }}></span>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.08)', color: 'var(--color-primary)', border: '1px solid rgba(59,130,246,0.12)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '11px' }}>
                                    AGENT: {e.assignedEmployeeName}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Interaction photos */}
                            {e.images && e.images.length > 0 && (
                              <div style={{ marginBottom: '16px' }}>
                                <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 700 }}>Lead Interaction Photos</h4>
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                                  {e.images.map(img => (
                                    <div key={img.id} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--surface-border)', flexShrink: 0 }}>
                                      <img src={img.imagePath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => openActionForm(e, 'assign_enquiry')} style={{ background: 'var(--surface-1)', border: '1px solid var(--surface-border-mid)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                                {e.assignedEmployeeName ? 'Reassign Agent' : 'Allocate Lead'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Clients */}
              {activeTab === 'clients' && (
                <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                      Customer Profiles ({filteredUsers.length})
                    </h2>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status:</span>
                      <select 
                        value={clientFilter}
                        onChange={e => setClientFilter(e.target.value)}
                        style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid var(--surface-border-mid)', background: 'var(--surface-2)', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="All">All Clients</option>
                        <option value="Verified">Verified Accounts</option>
                        <option value="Pending">Pending Verification</option>
                      </select>
                    </div>
                  </div>

                  {filteredUsers.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No clients matching "{clientFilter}".</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {filteredUsers.map(u => (
                        <div 
                          key={u.id} 
                          onClick={() => selectUserForManagement(u)}
                          style={{ 
                            padding: '16px 20px', 
                            background: selectedUser?.id === u.id ? 'var(--surface-2)' : 'var(--surface-1)', 
                            borderRadius: '14px', 
                            border: selectedUser?.id === u.id ? '2px solid var(--color-primary)' : '1.5px solid var(--surface-border)', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            flexWrap: 'wrap',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--heading-color)', margin: '0 0 4px' }}>{u.name}</h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{u.email} {u.phone ? `| 📞 ${u.phone}` : ''}</p>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
                            <span style={{ 
                              fontSize: '11px', 
                              fontWeight: 700, 
                              padding: '4px 10px', 
                              borderRadius: '12px', 
                              background: u.isVerified ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                              color: u.isVerified ? 'var(--success)' : 'var(--danger)'
                            }}>
                              {u.isVerified ? 'VERIFIED' : 'PENDING'}
                            </span>
                            <ChevronRight size={14} color="var(--text-muted)" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Staff */}
              {activeTab === 'staff' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Role Filter:</span>
                      <select 
                        value={staffFilter}
                        onChange={e => setStaffFilter(e.target.value)}
                        style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid var(--surface-border-mid)', background: 'var(--surface-1)', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="All">All Departments</option>
                        <option value="Field Engineering">Field Engineering</option>
                        <option value="Weighbridge Calibration">Weighbridge Calibration</option>
                        <option value="Solar Installation Crews">Solar Installation Crews</option>
                        <option value="Customer Help Desk">Customer Help Desk</option>
                        <option value="Blog Editorial">Blog Editorial</option>
                        <option value="Active">Active Crew Only</option>
                        <option value="Suspended">Suspended / Off-duty</option>
                      </select>
                    </div>
                    <button onClick={() => openActionForm(null, 'create_employee')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                      + Add Staff Member
                    </button>
                  </div>

                  <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '24px' }}>Onboarded Staff ({filteredEmployees.length})</h2>
                    {filteredEmployees.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)' }}>No staff members matching your filter query.</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                        {filteredEmployees.map(emp => (
                          <div key={emp.id} style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '18px', border: '1px solid var(--surface-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(36,82,143,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {emp.photoPath ? <img src={emp.photoPath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : '👤'}
                              </div>
                              <div>
                                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--heading-color)', margin: 0 }}>{emp.name}</h4>
                                <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>{emp.department}</span>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '20px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                <span style={{ color: 'var(--text-main)' }}>{emp.email}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                                <span style={{ color: 'var(--text-main)' }}>{emp.phone || 'N/A'}</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => openActionForm(emp, 'reset_password_emp')} style={{ flex: 1, background: 'var(--surface-1)', border: '1px solid var(--surface-border-mid)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                                Reset Pass
                              </button>
                              <button onClick={() => openActionForm(emp, 'update_emp_photo')} style={{ flex: 1, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: 'var(--color-primary)' }}>
                                📷 Photo
                              </button>
                              <button 
                                onClick={() => handleToggleEmployee(emp.id)} 
                                style={{ flex: 1, background: emp.isActive ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)', border: `1px solid ${emp.isActive ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}`, padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: emp.isActive ? '#ef4444' : 'var(--success)' }}
                              >
                                {emp.isActive ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Projects */}
              {activeTab === 'projects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => openActionForm(null, 'create_project')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                      + Initialize Project Log
                    </button>
                  </div>

                  <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '24px' }}>Active Projects</h2>
                    {projects.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)' }}>No project logs active.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {projects.map(proj => (
                          <div key={proj.id} style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '18px', border: '1px solid var(--surface-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>{proj.name}</h4>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ID: #{proj.id}</span>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>{proj.description}</p>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px', paddingTop: '16px', borderTop: '1px solid var(--surface-border-mid)' }}>
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Timeline: </span>
                                <strong style={{ color: 'var(--text-main)' }}>{new Date(proj.startDate).toLocaleDateString()} — {proj.endDate ? new Date(proj.endDate).toLocaleDateString() : 'Active'}</strong>
                              </div>
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Assigned Crew Size: </span>
                                <strong style={{ color: 'var(--color-primary)' }}>{proj.employeeCount || 0} Engineers</strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT: Action overlay panels */}
            {(actionType || selectedUser) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface-grad-soft)', borderRadius: '24px', padding: '36px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-xl)', position: 'sticky', top: '90px' }}>
                
                {/* 1. Client management panel */}
                {selectedUser && !actionType && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Manage Customer</h3>
                      <button onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '24px', fontWeight: 800 }}>&times;</button>
                    </div>

                    <div style={{ background: 'var(--surface-2)', padding: '20px', borderRadius: '16px', border: '1px solid var(--surface-border)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif' }}>{selectedUser.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Email: {selectedUser.email}<br/>
                        Phone: {selectedUser.phone || 'N/A'}<br/>
                        Address: {selectedUser.address || 'N/A'}<br/>
                        Pincode: {selectedUser.pincode || 'N/A'}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleToggleVerification(selectedUser.id, selectedUser.isVerified)} 
                          style={{ flex: 1, padding: '8px 12px', background: selectedUser.isVerified ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)', border: `1px solid ${selectedUser.isVerified ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}`, borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: selectedUser.isVerified ? '#ef4444' : 'var(--success)' }}
                        >
                          {selectedUser.isVerified ? 'Revoke Verification' : 'Verify Account'}
                        </button>
                        <button onClick={() => openActionForm(selectedUser, 'edit_user')} style={{ flex: 1, background: 'var(--surface-1)', border: '1px solid var(--surface-border-mid)', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                          Edit Profile
                        </button>
                        <button onClick={() => openActionForm(selectedUser, 'reset_password_user')} style={{ flex: 1, background: 'var(--surface-1)', border: '1px solid var(--surface-border-mid)', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                          Reset Pass
                        </button>
                      </div>
                    </div>

                    {/* Manage Installations */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--heading-color)', margin: 0 }}>Solar Installations</h4>
                        <button onClick={() => openActionForm(selectedUser, 'add_solar')} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Add Solar</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {userInstallations.map(inst => (
                          <div key={inst.id} style={{ background: 'var(--surface-1)', padding: '12px', borderRadius: '10px', border: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                            <span><strong>{inst.capacity}</strong> - {inst.address}</span>
                            <button onClick={() => handleDeleteSolar(inst.id)} style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Manage Equipment */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--heading-color)', margin: 0 }}>Weighing Scale Assets</h4>
                        <button onClick={() => openActionForm(selectedUser, 'add_equipment')} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Add Scale</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {userEquipment.map(eq => (
                          <div key={eq.id} style={{ background: 'var(--surface-1)', padding: '12px', borderRadius: '10px', border: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                            <span><strong>{eq.model}</strong> ({eq.capacity})</span>
                            <button onClick={() => handleDeleteEquipment(eq.id)} style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Various Admin Forms */}
                {actionType && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                        {actionType === 'assign_complaint' && 'Assign Complaint Engineer'}
                        {actionType === 'assign_enquiry' && 'Assign Sales Agent'}
                        {actionType === 'add_solar' && 'Log Solar Installation'}
                        {actionType === 'add_equipment' && 'Log Weighing Asset'}
                        {actionType === 'create_employee' && 'Register Staff Profile'}
                        {actionType === 'create_project' && 'Initialize Project Log'}
                        {actionType === 'reset_password_user' && 'Reset Customer Password'}
                        {actionType === 'reset_password_emp' && 'Reset Staff Password'}
                        {actionType === 'edit_user' && 'Edit Client Details'}
                        {actionType === 'update_emp_photo' && `Update Photo — ${actionTarget?.name}`}
                      </h3>
                      <button onClick={closeActionForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '24px', fontWeight: 800 }}>&times;</button>
                    </div>

                    {/* Form: Assign complaint */}
                    {actionType === 'assign_complaint' && (
                      <form onSubmit={handleAssignComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Select Field Engineer</label>
                          <select 
                            value={assigneeId} 
                            onChange={e => setAssigneeId(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          >
                            <option value="">Select Staff</option>
                            {employees.filter(emp => emp.isActive).map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={actionLoading}>
                          Allocate Complaint Ticket
                        </button>
                      </form>
                    )}

                    {/* Form: Assign enquiry */}
                    {actionType === 'assign_enquiry' && (
                      <form onSubmit={handleAssignEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Select Follow-up Agent</label>
                          <select 
                            value={assigneeId} 
                            onChange={e => setAssigneeId(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          >
                            <option value="">Select Staff</option>
                            {employees.filter(emp => emp.isActive).map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={actionLoading}>
                          Allocate Lead
                        </button>
                      </form>
                    )}

                    {/* Form: Add solar */}
                    {actionType === 'add_solar' && (
                      <form onSubmit={handleAddSolar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>System Capacity & Type</label>
                          <input 
                            type="text" 
                            value={solarForm.capacity}
                            onChange={e => setSolarForm(prev => ({ ...prev, capacity: e.target.value }))}
                            required
                            placeholder="e.g. 10kW Grid-Tie"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Installation Date</label>
                          <input 
                            type="date" 
                            value={solarForm.installationDate}
                            onChange={e => setSolarForm(prev => ({ ...prev, installationDate: e.target.value }))}
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Installation Address</label>
                          <input 
                            type="text" 
                            value={solarForm.address}
                            onChange={e => setSolarForm(prev => ({ ...prev, address: e.target.value }))}
                            required
                            placeholder="Site complete address"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={actionLoading}>
                          Log Installation Profile
                        </button>
                      </form>
                    )}

                    {/* Form: Add weighing scale */}
                    {actionType === 'add_equipment' && (
                      <form onSubmit={handleAddEquipment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Equipment Type</label>
                          <select 
                            value={equipForm.equipmentType}
                            onChange={e => setEquipForm(prev => ({ ...prev, equipmentType: e.target.value }))}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          >
                            <option value="Pitless Weighbridge">Pitless Weighbridge</option>
                            <option value="Pit Type Weighbridge">Pit Type Weighbridge</option>
                            <option value="Digital Platform Scale">Digital Platform Scale</option>
                            <option value="Industrial Floor Scale">Industrial Floor Scale</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Model Number</label>
                          <input 
                            type="text" 
                            value={equipForm.model}
                            onChange={e => setEquipForm(prev => ({ ...prev, model: e.target.value }))}
                            required
                            placeholder="e.g. LWT-100T"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Capacity</label>
                          <input 
                            type="text" 
                            value={equipForm.capacity}
                            onChange={e => setEquipForm(prev => ({ ...prev, capacity: e.target.value }))}
                            required
                            placeholder="e.g. 100 Tons"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Serial Number</label>
                          <input 
                            type="text" 
                            value={equipForm.serialNumber}
                            onChange={e => setEquipForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                            required
                            placeholder="S/N: 2026-X12"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={actionLoading}>
                          Log Weighing Asset
                        </button>
                      </form>
                    )}

                    {/* Form: Register employee */}
                    {actionType === 'create_employee' && (
                      <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Full Name</label>
                          <input 
                            type="text" 
                            value={empForm.name}
                            onChange={e => setEmpForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder="Dave Miller"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Email Address</label>
                          <input 
                            type="email" 
                            value={empForm.email}
                            onChange={e => setEmpForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                            placeholder="dave@lwt.com"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Default Password</label>
                          <input 
                            type="password" 
                            value={empForm.password}
                            onChange={e => setEmpForm(prev => ({ ...prev, password: e.target.value }))}
                            required
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Mobile Phone</label>
                          <input 
                            type="text" 
                            value={empForm.phone}
                            onChange={e => setEmpForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="9876543210"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Department / Role</label>
                          <select 
                            value={empForm.department}
                            onChange={e => setEmpForm(prev => ({ ...prev, department: e.target.value }))}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          >
                            <option value="Field Engineering">Field Engineering</option>
                            <option value="Weighbridge Calibration">Weighbridge Calibration</option>
                            <option value="Solar Installation Crews">Solar Installation Crews</option>
                            <option value="Customer Help Desk">Customer Help Desk</option>
                            <option value="Blog Editorial">Blog Editorial</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Profile Photo</label>
                          <input 
                            type="file" 
                            onChange={e => setEmpForm(prev => ({ ...prev, photo: e.target.files[0] }))}
                            accept="image/*"
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={actionLoading}>
                          Onboard Staff Member
                        </button>
                      </form>
                    )}

                    {/* Form: Create project */}
                    {actionType === 'create_project' && (
                      <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Project Name</label>
                          <input 
                            type="text" 
                            value={projForm.name}
                            onChange={e => setProjForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder="Tata Solar Site, Scale calibration audit..."
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Description</label>
                          <textarea 
                            value={projForm.description}
                            onChange={e => setProjForm(prev => ({ ...prev, description: e.target.value }))}
                            required
                            rows="3"
                            placeholder="Details of the job..."
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none', minHeight: '80px', resize: 'vertical' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Start Date</label>
                            <input 
                              type="date" 
                              value={projForm.startDate}
                              onChange={e => setProjForm(prev => ({ ...prev, startDate: e.target.value }))}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>End Date</label>
                            <input 
                              type="date" 
                              value={projForm.endDate}
                              onChange={e => setProjForm(prev => ({ ...prev, endDate: e.target.value }))}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Assign Crew (Select multiple)</label>
                          <select 
                            multiple
                            value={projForm.employeeIds}
                            onChange={e => {
                              const options = Array.from(e.target.selectedOptions, option => option.value);
                              setProjForm(prev => ({ ...prev, employeeIds: options }));
                            }}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none', height: '120px' }}
                          >
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                            ))}
                          </select>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Hold Ctrl (or Cmd on Mac) to select multiple.</span>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={actionLoading}>
                          Initialize Project Log
                        </button>
                      </form>
                    )}

                    {/* Form: Reset password */}
                    {(actionType === 'reset_password_user' || actionType === 'reset_password_emp') && (
                      <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Enter New Password</label>
                          <input 
                            type="password" 
                            value={passResetVal}
                            onChange={e => setPassResetVal(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={actionLoading}>
                          Reset Password Hash
                        </button>
                      </form>
                    )}

                    {/* Form: Edit client fields */}
                    {actionType === 'edit_user' && (
                      <form onSubmit={handleUserEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Client Name</label>
                          <input 
                            type="text" 
                            value={userEditForm.name}
                            onChange={e => setUserEditForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Email Address</label>
                          <input 
                            type="email" 
                            value={userEditForm.email}
                            onChange={e => setUserEditForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Mobile Phone</label>
                          <input 
                            type="text" 
                            value={userEditForm.phone}
                            onChange={e => setUserEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Address</label>
                            <input 
                              type="text" 
                              value={userEditForm.address}
                              onChange={e => setUserEditForm(prev => ({ ...prev, address: e.target.value }))}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Pincode</label>
                            <input 
                              type="text" 
                              value={userEditForm.pincode}
                              onChange={e => setUserEditForm(prev => ({ ...prev, pincode: e.target.value }))}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={actionLoading}>
                          Save Changes
                        </button>
                      </form>
                    )}

                    {/* Form: Update employee photo */}
                    {actionType === 'update_emp_photo' && (
                      <form onSubmit={handleUpdateEmployeePhoto} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Current photo preview */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--surface-2)', padding: '20px', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(36,82,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '3px solid var(--color-primary)' }}>
                            {empPhotoFile
                              ? <img src={URL.createObjectURL(empPhotoFile)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : actionTarget?.photoPath
                                ? <img src={actionTarget.photoPath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: '28px' }}>👤</span>
                            }
                          </div>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--heading-color)' }}>{actionTarget?.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>{actionTarget?.department}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                              {empPhotoFile ? `New: ${empPhotoFile.name}` : (actionTarget?.photoPath ? 'Current photo on file' : 'No photo set')}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' }}>Upload New Profile Photo</label>
                          <input 
                            type="file"
                            accept="image/*"
                            required
                            onChange={e => setEmpPhotoFile(e.target.files[0] || null)}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '14px', background: 'var(--surface-2)', color: 'var(--text-main)', outline: 'none' }}
                          />
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>JPG, PNG or WEBP. Recommended: square image.</span>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={actionLoading || !empPhotoFile}>
                          {actionLoading ? 'Uploading...' : 'Save Profile Photo'}
                        </button>
                      </form>
                    )}



                  </div>
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
