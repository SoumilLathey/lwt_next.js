"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, ArrowRight, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message
        })
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    { icon: Phone, label: "Call Us", value: "+91 92591 60644", href: "tel:+919259160644" },
    { icon: Mail, label: "Email Us", value: "info@latheyweightrix.com", href: "mailto:info@latheyweightrix.com" },
    { icon: MapPin, label: "Visit Us", value: "40, Prem Prayag Colony, Garh Road, Meerut, UP - 250004", href: null },
    { icon: Clock, label: "Working Hours", value: "Mon–Sat: 9:00 AM – 6:00 PM", href: null },
  ];

  const services = ["Weighbridges", "Industrial Scales", "Solar EPC", "Automation", "AMC Services"];

  const labelStyle = { fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px', display: 'block' };
  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '15px', background: 'var(--surface-1)', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>

        {/* ── HERO ── */}
        <section style={{ padding: '80px 0', background: 'var(--banner-bg)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.15)', padding: '6px 14px', borderRadius: '20px' }}>Get in Touch</span>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', fontFamily: 'Outfit, sans-serif', lineHeight: 1.15, marginBottom: '20px' }}>Let's Build the Right<br />Solution for Your Business</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', maxWidth: '560px', margin: '0 auto' }}>
              Whether you're planning a solar installation, upgrading industrial weighing systems, or securing a maintenance contract — our team is ready to help.
            </p>
          </div>
        </section>

        {/* ── CONTACT DETAILS ── */}
        <section style={{ padding: '0', background: 'var(--surface-1)' }}>
          <div className="container" style={{ transform: 'translateY(-40px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {contactDetails.map((cd, i) => {
                const Icon = cd.icon;
                const content = (
                  <div style={{ background: 'var(--surface-1)', borderRadius: '16px', padding: '24px 20px', border: '1px solid var(--surface-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(36,82,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{cd.label}</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)', margin: 0, lineHeight: 1.5 }}>{cd.value}</p>
                    </div>
                  </div>
                );
                return cd.href ? (
                  <a key={i} href={cd.href} style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
                ) : (
                  <div key={i}>{content}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FORM + MAP ── */}
        <section style={{ padding: '40px 0 80px', background: 'var(--surface-1)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

            {/* Form */}
            <div style={{ background: 'var(--surface-grad-soft)', borderRadius: '24px', padding: '40px', border: '1px solid var(--surface-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} color="#fff" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Send Us a Message</h2>
              </div>

              {status === "success" && (
                <div style={{ padding: '14px 18px', borderRadius: '10px', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
                  ✓ Thank you! Your enquiry has been sent. We'll get back to you shortly.
                </div>
              )}
              {status === "error" && (
                <div style={{ padding: '14px 18px', borderRadius: '10px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
                  ✗ Failed to send. Please try again or contact us directly.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input type="text" name="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input type="text" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" name="email" placeholder="john@company.com" value={formData.email} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="tel" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Service Interest</label>
                  <select name="service" value={formData.service} onChange={handleInputChange} style={inputStyle}>
                    <option value="">Select a Service</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea name="message" placeholder="Tell us about your requirements..." value={formData.message} onChange={handleInputChange} required style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 20px rgba(36,82,143,0.3)', transition: 'all 0.3s ease' }}>
                  {loading ? "Sending..." : (<>Get Expert Consultation <ArrowRight size={18} /></>)}
                </button>
              </form>
            </div>

            {/* Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'var(--surface-2)', borderRadius: '20px', padding: '24px', border: '1px solid var(--surface-border)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '6px' }}>📍 Find Us on the Map</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 16px' }}>40, Prem Prayag Colony, Garh Road, Meerut, UP – 250004</p>
              </div>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', flexGrow: 1 }}>
                <iframe
                  src="https://maps.google.com/maps?q=Lathey+Weigh+Trix+Meerut&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="420"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lathey Weigh Trix Location"
                />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
