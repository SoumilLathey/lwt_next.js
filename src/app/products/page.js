"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { Scale, Layers, Cpu, Sun, ArrowRight, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  const productCategories = [
    {
      title: "Industrial Scales & Weighbridges",
      icon: Scale,
      desc: "Platform, floor-mounted, custom-configured digital scales, and high-capacity pit/pitless electronic weighbridges (5-200 tonnes) built for heavy-duty industrial weighing.",
      detail: "Manufacturing, logistics, warehousing, quality control",
      link: "/scales",
      gradient: "linear-gradient(135deg, #1e3a5f, #24528F)",
      badge: "Up to 200T",
    },
    {
      title: "Automation",
      icon: Cpu,
      desc: "Unmanned weighbridge systems with RFID, boom barriers, cameras, and cloud data management.",
      detail: "Logistics, transport hubs, industrial gates",
      link: "/automation",
      gradient: "linear-gradient(135deg, #4c1d95, #7c3aed)",
      badge: "24/7",
    },
    {
      title: "Solar EPC",
      icon: Sun,
      desc: "End-to-end Engineering, Procurement and Construction services for solar rooftop and ground-mounted systems.",
      detail: "Commercial, industrial, residential, agricultural",
      link: "/solar-epc",
      gradient: "linear-gradient(135deg, #92400e, #f59e0b)",
      badge: "25 Yrs",
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <PageHeader
          title="Our Products & Services"
          description="Explore our comprehensive range of precision weighing systems and clean energy solutions — all backed by two decades of engineering expertise and end-to-end support."
        />

        {/* ── STAT STRIP ── */}
        <section style={{ background: 'var(--color-primary)', padding: 0 }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { value: "3", label: "Core Divisions" },
              { value: "25+", label: "Years of Experience" },
              { value: "Full", label: "Lifecycle Support" },
              { value: "All", label: "Sectors Covered" },
            ].map((s, i) => (
              <div key={i} style={{ padding: '24px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '6px', fontWeight: 500, letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCT CARDS ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>What We Offer</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>Our Products & Services</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Three core business divisions — precision weighing and solar energy — serving diverse industrial and commercial requirements.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {productCategories.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <Link key={idx} href={p.link} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--surface-border-mid)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                      {/* Colour header */}
                      <div style={{ background: p.gradient, padding: '36px 32px', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={28} color="#fff" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Outfit, sans-serif' }}>{p.title}</h3>
                            <span style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '3px 8px', borderRadius: '20px', letterSpacing: '0.5px' }}>{p.badge}</span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0, letterSpacing: '0.3px' }}>{p.detail}</p>
                        </div>
                      </div>
                      {/* Body */}
                      <div style={{ padding: '24px 32px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, margin: 0, flex: 1 }}>{p.desc}</p>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(36,82,143,0.08), rgba(245,158,11,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ChevronRight size={18} color="var(--color-primary)" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '80px 0', background: 'var(--banner-bg)', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Not sure which solution is right for you?</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', marginBottom: '36px', maxWidth: '560px', margin: '0 auto 36px' }}>Our engineering team is happy to advise on the most suitable solution for your requirements.</p>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--color-secondary)', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(245,158,11,0.3)' }}>
              Get Expert Guidance <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
