"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ShieldAlert, CheckCircle2, Phone, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CustomerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    pincode: ""
  });

  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validate inputs
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      setSubmitting(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSubmitting(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setSubmitting(false);
      return;
    }

    try {
      const { confirmPassword, ...submitPayload } = formData;
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitPayload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { 
    width: '100%', 
    padding: '12px 16px', 
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
    marginBottom: '6px', 
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
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(36,82,143,0.08) 0%, rgba(245,158,11,0.03) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ 
          width: '100%', 
          maxWidth: '560px', 
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
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif' }}>LWT</span>
              <span style={{ width: '1px', height: '20px', background: 'var(--surface-border-mid)' }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif' }}>Lathey Weigh Trix</span>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>Create Account</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Register to manage solar systems and scale services</p>
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

          {success && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '12px 16px', 
              borderRadius: '10px', 
              background: 'rgba(16,185,129,0.08)', 
              color: 'var(--success)', 
              border: '1px solid rgba(16,185,129,0.15)', 
              marginBottom: '24px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>Account created! Please wait for admin verification. Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>
                <User size={16} color="var(--color-secondary)" />
                Full Name
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="John Doe" 
                required 
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>
                  <Mail size={16} color="var(--color-secondary)" />
                  Email
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="your@email.com" 
                  required 
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>
                  <Phone size={16} color="var(--color-secondary)" />
                  Phone
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="9876543210" 
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>
                  <MapPin size={16} color="var(--color-secondary)" />
                  Address
                </label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Your business/shipping address" 
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>
                  <MapPin size={16} color="var(--color-secondary)" />
                  Pincode
                </label>
                <input 
                  type="text" 
                  name="pincode" 
                  value={formData.pincode} 
                  onChange={handleInputChange} 
                  placeholder="250004" 
                  pattern="[0-9]{6}" 
                  title="Please enter a valid 6-digit pincode" 
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  placeholder="Min. 6 characters" 
                  required 
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>
                  <Lock size={16} color="var(--color-secondary)" />
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  placeholder="Re-enter password" 
                  required 
                  style={inputStyle}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting || success}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                background: submitting ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', 
                color: '#fff', 
                padding: '14px', 
                borderRadius: '12px', 
                fontWeight: 700, 
                fontSize: '15px', 
                border: 'none', 
                cursor: (submitting || success) ? 'not-allowed' : 'pointer', 
                boxShadow: (submitting || success) ? 'none' : '0 6px 20px rgba(36,82,143,0.3)', 
                transition: 'all 0.3s ease',
                marginTop: '12px'
              }}
            >
              {submitting ? "Creating Account..." : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div style={{ 
            marginTop: '28px', 
            paddingTop: '20px', 
            borderTop: '1px solid var(--surface-border-mid)',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}>Login here</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
