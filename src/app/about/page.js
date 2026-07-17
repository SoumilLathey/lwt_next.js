"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { Award, Cpu, Wrench, Globe, DollarSign, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: Award, title: "25+ Years Experience", desc: "Over two decades of industry expertise and proven engineering solutions across industrial and clean energy sectors." },
    { icon: Cpu, title: "Engineering-Driven", desc: "Every solution is built on rigorous engineering — from product design to installation and commissioning." },
    { icon: Wrench, title: "End-to-End Support", desc: "Complete lifecycle support from site assessment and installation through to annual maintenance." },
    { icon: Globe, title: "International Standards", desc: "Products designed and calibrated to meet global quality, accuracy, and legal-for-trade standards." },
    { icon: DollarSign, title: "Cost-Effective", desc: "Solutions that deliver genuine value — precision and reliability without unnecessary cost overhead." },
    { icon: TrendingUp, title: "Long-Term Value", desc: "Reliable engineering and proven systems built for sustained performance over 25+ years." },
  ];

  const commitments = [
    "High-quality, performance-driven products",
    "Cost-effective solutions without compromising accuracy",
    "Responsive technical support and maintenance",
    "Long-term value through reliable engineering",
  ];

  const weighingServices = [
    "Electronic weighbridges (5–200 tonnes)",
    "Digital indicators and load cells",
    "Platform scales and weighing automation",
    "AMC and maintenance services",
  ];

  const solarServices = [
    "System design and engineering",
    "Equipment procurement (Tier-1 brands)",
    "Installation and commissioning",
    "Ongoing O&M support and warranty assistance",
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <PageHeader
          title="About Us"
          description="Lathey Weigh Trix is a manufacturer of electronic weighbridges and a full-service solar EPC company. With over two decades of experience, we combine engineering expertise and modern technology to help businesses operate accurately, efficiently, and sustainably."
        />

        {/* ── STAT STRIP ── */}
        <section style={{ background: 'var(--color-primary)', padding: 0 }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { value: "2000", label: "Year Founded" },
              { value: "25+", label: "Years of Expertise" },
              { value: "2", label: "Core Business Divisions" },
            ].map((s, i) => (
              <div key={i} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '6px', fontWeight: 500, letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── OUR STORY ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Our Story</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', lineHeight: 1.2, marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
                25+ Years of<br />Engineering Excellence
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.8, marginBottom: '20px' }}>
                Founded in 2000, Lathey Weigh Trix began as a specialised electronic weighbridge manufacturing company — focused on accuracy, durability, and affordability. Over time, our capabilities expanded to cover a comprehensive range of industrial weighing solutions.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.8 }}>
                As industries moved toward cleaner energy, we extended our expertise into solar EPC services — offering complete solutions for rooftop and ground-mounted solar installations. Today, we operate at the intersection of precision engineering and clean energy.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { year: "2000", event: "Company founded — electronic weighbridge manufacturing." },
                { year: "2010", event: "Expanded to full-range industrial weighing solutions." },
                { year: "2018", event: "Launched Solar EPC division for clean energy projects." },
                { year: "Now", event: "Operating across precision weighing and solar EPC." },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', textAlign: 'center', flexShrink: 0 }}>{m.year}</div>
                  <div style={{ background: 'var(--surface-2)', borderRadius: '12px', padding: '14px 18px', border: '1px solid var(--surface-border)', flex: 1 }}>
                    <p style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: 500, margin: 0 }}>{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO ── */}
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>What We Do</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>Integrated Weighing & Solar EPC Solutions</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '600px', margin: '0 auto' }}>End-to-end solutions across two core areas — precision weighing systems and solar EPC services — both designed to meet international standards.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              <div style={{ background: 'var(--surface-1)', borderRadius: '20px', padding: '36px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--color-primary), #2563eb)' }} />
                <h4 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--heading-color)', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>⚖ Precision Weighing Systems</h4>
                {weighingServices.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{s}</span>
                  </div>
                ))}
                <Link href="/scales" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px', textDecoration: 'none', marginTop: '20px' }}>
                  Explore Industrial Scales & Weighbridges <ArrowRight size={14} />
                </Link>
              </div>
              <div style={{ background: 'var(--surface-1)', borderRadius: '20px', padding: '36px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f59e0b, #d97706)' }} />
                <h4 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--heading-color)', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>☀ Solar EPC Services</h4>
                {solarServices.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{s}</span>
                  </div>
                ))}
                <Link href="/solar-epc" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontWeight: 700, fontSize: '14px', textDecoration: 'none', marginTop: '20px' }}>
                  Explore Solar EPC <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-grad-fade)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Our Strengths</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>Why Choose Us?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Reliable Solutions. Proven Engineering. Long-Term Value.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {values.map((v, idx) => (
                <div key={idx} style={{ background: 'var(--surface-1)', borderRadius: '18px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }} />
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(36,82,143,0.1), rgba(245,158,11,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <v.icon size={22} color="var(--color-primary)" />
                  </div>
                  <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--heading-color)', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{v.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMMITMENT ── */}
        <section style={{ padding: '80px 0', background: 'var(--banner-bg)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.15)', padding: '6px 14px', borderRadius: '20px' }}>Our Commitment</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '20px' }}>We Are Committed to Delivering</h2>
              {commitments.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', marginBottom: '12px' }}>
                  <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 500 }}>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '80px', lineHeight: 1, marginBottom: '16px' }}>⚖</div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '20px', fontStyle: 'italic', lineHeight: 1.6, fontWeight: 500 }}>
                "For us, precision is not just a requirement — it is the standard we build by."
              </p>
              <div style={{ marginTop: '32px' }}>
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--color-secondary)', color: '#fff', padding: '14px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                  Get in Touch <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
