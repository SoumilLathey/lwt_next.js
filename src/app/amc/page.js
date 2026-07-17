"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { Wrench, Shield, CheckCircle2, Clock, Activity, ArrowRight, AlertTriangle, TrendingUp, Gauge } from 'lucide-react';

export default function AmcPage() {
  const risks = [
    "Inaccurate weight readings",
    "Increased breakdown risk",
    "Operational delays",
    "Higher repair costs",
  ];

  const amcCovers = [
    { icon: Wrench, title: "Preventive Maintenance", description: "Scheduled inspections to identify and resolve issues before failure — keeping systems running without surprises." },
    { icon: CheckCircle2, title: "Calibration & Accuracy Verification", description: "Legal-for-trade calibration with official stamping to ensure consistent, compliant performance." },
    { icon: Shield, title: "Corrective Maintenance", description: "Prompt diagnosis and resolution of faults to minimise operational disruption." },
    { icon: Clock, title: "Priority Service Support", description: "AMC customers receive faster response times and dedicated engineer allocation." },
    { icon: Activity, title: "System Health Checks", description: "Full evaluation of load cells, indicators, cabling, and structural components at each visit." },
  ];

  const equipmentCovered = [
    { label: "Electronic Weighbridges", detail: "5–200 tonne capacity systems" },
    { label: "Industrial & Platform Scales", detail: "All digital weighing configurations" },
    { label: "Digital Indicators & Load Cells", detail: "Signal conditioners, displays, and sensors" },
  ];

  const benefits = [
    "Consistent weighing accuracy",
    "Reduced operational downtime",
    "Predictable maintenance costs",
    "Extended equipment lifespan",
    "Improved compliance and audit readiness",
  ];

  const valueProps = [
    "In-depth understanding of weighing system performance",
    "Experienced service engineers and technical teams",
    "Structured maintenance schedules with documentation",
    "Reliable after-sales support and fast field response",
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <PageHeader
          title="Annual Maintenance Contracts for Uninterrupted Accuracy"
          description="Lathey Weigh Trix offers Annual Maintenance Contracts (AMC) designed to ensure the continued accuracy, reliability, and performance of industrial weighing systems."
          image="/images/amc-bg.jpg"
          imagePosition="center 70%"
        />

        {/* ── STAT STRIP ── */}
        <section style={{ background: 'var(--color-primary)', padding: 0 }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { value: "24/7", label: "Support Availability" },
              { value: "Fast", label: "Priority Response" },
              { value: "100%", label: "Calibration Compliance" },
            ].map((s, i) => (
              <div key={i} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '6px', fontWeight: 500, letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── INTRO ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Why Maintenance Matters</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', lineHeight: 1.2, marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
                Protect Your Investment<br />Before It Fails
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: 1.8, marginBottom: '32px' }}>
                Continuous usage, environmental exposure, and vibration can silently degrade weighing accuracy. Without regular maintenance, undetected drift causes billing disputes, compliance failures, and unexpected downtime.
              </p>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-primary)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                Enquire About AMC <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ background: 'var(--surface-grad-soft)', borderRadius: '20px', padding: '36px', border: '1px solid var(--surface-border)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-primary)', marginBottom: '24px' }}>⚠ Risks of Neglected Maintenance</h4>
              {risks.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', marginBottom: '10px', background: 'var(--surface-1)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT AMC COVERS ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-grad-fade)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Complete Coverage</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>What Our AMC Covers</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Structured for complete peace of mind — from scheduled inspections to emergency corrective action.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {amcCovers.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--surface-1)', borderRadius: '18px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }} />
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(36,82,143,0.1), rgba(245,158,11,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <item.icon size={22} color="var(--color-primary)" />
                  </div>
                  <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--heading-color)', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EQUIPMENT COVERED ── */}
        <section style={{ padding: '80px 0', background: 'var(--banner-bg)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.15)', padding: '6px 14px', borderRadius: '20px' }}>Equipment Covered</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Under AMC Contract</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Contracts are customisable based on equipment type, age, usage intensity, and site conditions.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {equipmentCovered.map((eq, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '32px 24px', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
                  <CheckCircle2 size={32} color="var(--color-secondary)" style={{ marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{eq.label}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>{eq.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS & WHY US ── */}
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Key Benefits</span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '28px' }}>Why an AMC Makes Business Sense</h2>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-1)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--surface-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={16} color="#fff" />
                  </div>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '15px' }}>{b}</span>
                </div>
              ))}
            </div>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Our Advantage</span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '28px' }}>Why Choose Lathey Weigh Trix AMC?</h2>
              {valueProps.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-1)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--surface-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={16} color="#fff" />
                  </div>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '15px' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-grad-cta)', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Looking to protect your weighing investment?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '36px', maxWidth: '560px', margin: '0 auto 36px' }}>Get in touch to learn about our AMC plans and schedule a free maintenance assessment.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--color-primary)', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(36,82,143,0.3)' }}>
                Enquire About AMC <ArrowRight size={18} />
              </Link>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--surface-1)', color: 'var(--color-primary)', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '2px solid var(--color-primary)' }}>
                Schedule Assessment
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
