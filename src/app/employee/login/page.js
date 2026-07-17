"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    localStorage.removeItem('lwt_token');
    localStorage.removeItem('lwt_user');
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/employees/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('lwt_token', data.token);
        localStorage.setItem('lwt_user', JSON.stringify(data.employee));
        router.push('/employee/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { 
    width: '100%', 
    padding: '14px 18px', 
    borderRadius: '10px', 
    border: '1.5px solid var(--surface-border-mid)', 
    fontSize: '15px', 
    background: 'var(--surface-1)', 
    color: 'var(--text-main)', 
    outline: 'none', 
    boxSizing: 'border-box', 
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease'
  };

  const labelStyle = { 
    fontSize: '13px', 
    fontWeight: 600, 
    color: 'var(--heading-color)', 
    marginBottom: '8px', 
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      
      <main style={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '120px 24px 80px',
        position: 'relative'
      }}>
        {/* Background radial aura */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(36,82,143,0.08) 0%, rgba(245,158,11,0.03) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ 
          width: '100%', 
          maxWidth: '460px', 
          background: 'var(--surface-grad-soft)', 
          borderRadius: '24px', 
          padding: '40px', 
          border: '1px solid var(--surface-border)', 
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1,
          position: 'relative'
        }}>
          {/* Top accent bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '3px',
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))'
          }} />

          {/* Logo Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif' }}>LWT</span>
              <span style={{ width: '1px', height: '20px', background: 'var(--surface-border-mid)' }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>Staff Portal</span>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'rgba(36,82,143,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--color-primary)'
            }}>
              <User size={28} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>Employee Login</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Access your assigned field tasks and leads</p>
          </div>

          {error && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '12px 16px', 
              borderRadius: '10px', 
              background: 'rgba(244,63,94,0.08)', 
              color: 'var(--danger)', 
              border: '1px solid rgba(244,63,94,0.15)', 
              marginBottom: '24px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>
                <User size={16} color="var(--color-secondary)" />
                Staff Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="employee@latheyweightrix.com" 
                required 
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>
                <Lock size={16} color="var(--color-secondary)" />
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="Enter password" 
                required 
                style={inputStyle}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                background: loading ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', 
                color: '#fff', 
                padding: '16px', 
                borderRadius: '12px', 
                fontWeight: 700, 
                fontSize: '15px', 
                border: 'none', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                boxShadow: loading ? 'none' : '0 6px 20px rgba(36,82,143,0.3)', 
                transition: 'all 0.3s ease',
                marginTop: '12px'
              }}
            >
              {loading ? "Logging in..." : (
                <>
                  Verify & Access <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '1px solid var(--surface-border-mid)',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            <Link href="/login" style={{ 
              color: 'var(--color-primary)', 
              fontWeight: 600, 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              justifyContent: 'center'
            }}>
              <ArrowLeft size={14} /> Back to Customer Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
