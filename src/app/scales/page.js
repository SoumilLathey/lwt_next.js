"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { Shield, Settings, CheckCircle2, ArrowRight, Gauge, Layers, Zap, RefreshCw, Package, Truck, Factory, Building2 } from 'lucide-react';

const featureIcons = [Gauge, Shield, Layers, Zap, RefreshCw, Settings];

export default function ScalesPage() {
  const features = [
    { title: "High-Precision Load Sensors", description: "Class III load cells ensuring accurate, repeatable weight readings with ±0.01% full-scale accuracy." },
    { title: "Robust Structural Design", description: "Heavy-duty steel frames (fabricated with IS-2062 structural steel for weighbridges) designed for 24/7 continuous industrial use." },
    { title: "Digital Weight Indicators", description: "Vivid, backlit LCD displays with RS-232/485 output for real-time data connectivity to ERP systems." },
    { title: "Fast Response Time", description: "Sub-second stabilisation enables rapid throughput in high-volume weighing operations." },
    { title: "Low Maintenance Design", description: "Hermetically sealed, corrosion-resistant load cells with overload protection reduce downtime and maintenance cost." },
    { title: "Versatile Capacity Range", description: "Tailored weighing solutions covering lightweight platform scales to massive multi-deck vehicular weighbridges." }
  ];

  const applications = [
    { icon: Factory, label: "Manufacturing & assembly lines" },
    { icon: Truck, label: "Logistics and transport hubs" },
    { icon: Building2, label: "Warehousing and distribution centers" },
    { icon: Layers, label: "Infrastructure and construction sites" },
    { icon: Gauge, label: "Material handling & quality control" },
  ];

  const scaleTypes = [
    { icon: Layers, name: "Digital Platform Scales", detail: "Floor-level weighing for pallets, bulk materials and goods up to 3 tonnes." },
    { icon: Package, name: "Floor-Mounted Industrial Scales", detail: "Heavy-duty fixed installations for factories and warehouses." },
    { icon: Settings, name: "Custom-Configured Systems", detail: "Bespoke solutions engineered to your exact capacity, platform size and connectivity requirements." },
  ];

  const supportServices = [
    { num: "01", title: "Site Assessment & Setup", desc: "On-site installation by certified engineers with system commissioning and foundation planning." },
    { num: "02", title: "Calibration & Verification", desc: "Legal-for-trade calibration with official stamping and documentation for compliance audits." },
    { num: "03", title: "Ongoing Technical Support", desc: "Priority telephone and field support to keep operations running without disruption." },
    { num: "04", title: "AMC Preventive Maintenance", desc: "Scheduled preventive maintenance visits under Annual Maintenance Contracts (AMC)." },
  ];

  const valueProps = [
    "Over two decades of engineering expertise",
    "Precision-manufactured to international standards",
    "Proven reliability across demanding industrial environments",
    "Full lifecycle support — assessment, installation, stamping, and AMC",
  ];

  const risks = [
    "Material loss & billing discrepancies",
    "Compliance and legal stamping issues",
    "Inventory mismatches & production inconsistencies",
    "Inefficient gate control and logistics delays",
    "Quality control and load verification failures",
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <PageHeader
          title="Industrial Scales & Precision Weighbridges"
          description="Lathey Weigh Trix offers high-precision industrial digital scales and heavy-duty vehicle weighbridges designed for accuracy, durability, and seamless operational flow."
          image="/images/scales-bg.jpg"
        />

        {/* ── STAT STRIP ── */}
        <section style={{ background: 'var(--color-primary)', padding: '0' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { value: "5T–200T", label: "Weighbridge Capacity" },
              { value: "±0.01%", label: "Measurement Accuracy" },
              { value: "3T Platform", label: "Industrial Floor Scales" },
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
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Why Accuracy Matters</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', lineHeight: 1.2, marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
                Eliminating Operational Risks<br />Across Your Weighing Workflows
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: 1.8, marginBottom: '32px' }}>
                Whether it is platform scales for inventory management or heavy-duty weighbridges for vehicle loading, inaccurate measurements lead to immediate financial loss, audit failures, and logistics delays. We design our weighing equipment to ensure repeatable precision in all industrial conditions.
              </p>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-primary)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                Get a Customized Consultation <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ background: 'var(--surface-grad-soft)', borderRadius: '20px', padding: '36px', border: '1px solid var(--surface-border)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--heading-color)', marginBottom: '24px' }}>⚠ Risks of Inaccurate Weighing</h4>
              {risks.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', marginBottom: '10px', background: 'var(--surface-1)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── APPLICATIONS ── */}
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Where We Deploy</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Applications Across Industries</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Our industrial scales and weighbridges are deployed across diverse sectors that demand precision, compliance and reliability.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {applications.map(({ icon: Icon, label }, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '28px 16px', background: 'var(--surface-1)', borderRadius: '16px', border: '1px solid var(--surface-border-mid)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(36,82,143,0.1), rgba(36,82,143,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="var(--color-primary)" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KEY FEATURES ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-grad-fade)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Built-in Excellence</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Key Features</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Engineered to provide stable, repeatable measurements under the most demanding industrial conditions.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {features.map((f, idx) => {
                const Icon = featureIcons[idx];
                return (
                  <div key={idx} style={{ background: 'var(--surface-1)', borderRadius: '18px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }} />
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(36,82,143,0.1), rgba(245,158,11,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                      <Icon size={22} color="var(--color-primary)" />
                    </div>
                    <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--heading-color)', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{f.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SUBSECTION: PLATFORM SCALES ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)', borderBottom: '1px solid var(--surface-border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Product Range 01</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Digital Platform & Industrial Scales</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Floor-level precision and custom configurations for factories, packaging lines, and assembly lines.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {scaleTypes.map(({ icon: Icon, name, detail }, i) => (
                <div key={i} style={{ background: 'var(--surface-grad-soft)', borderRadius: '20px', padding: '36px 28px', border: '1px solid var(--surface-border-mid)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={26} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>{name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARALLAX BANNER DIVIDER ── */}
        <section style={{
          position: 'relative',
          padding: '120px 0',
          backgroundImage: 'linear-gradient(rgba(8, 12, 20, 0.8), rgba(8, 12, 20, 0.85)), url("/images/weighbridge-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.15)', padding: '6px 14px', borderRadius: '20px' }}>Heavy-Duty Solutions</span>
            <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '20px', lineHeight: 1.2 }}>Vehicular Weighbridges (5T – 200T)</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
              Engineered to handle high-frequency, heavy vehicle operations. Fabricated with IS-2062 high-strength structural steel to resist deck deformation and deliver consistent weighing precision.
            </p>
          </div>
        </section>

        {/* ── SUBSECTION: VEHICLE WEIGHBRIDGES ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Product Range 02</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Types of Electronic Weighbridges</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Tailored configurations for specific spatial constraints and environmental conditions.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
              {/* Type 1: Pitless */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
                <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', aspectRatio: '4/3' }}>
                  <img src="/images/pitless-weighbridge.jpg" alt="Pitless Weighbridge" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div>
                  <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '14px' }}>TYPE 01</span>
                  <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--heading-color)', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Pitless Electronic Weighbridges</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>Installed above ground level with ramps, pitless weighbridges are popular for easy structural maintenance, superior drainage, and quick installation. Perfect for muddy or chemically active environments.</p>
                  {["Easy access for deck maintenance & cleaning", "Ideal for areas prone to waterlogging or poor drainage", "Rapid foundation construction and installation"].map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-main)', fontSize: '15px' }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--surface-border-mid), transparent)' }} />

              {/* Type 2: Pit-Type */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
                <div>
                  <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '14px' }}>TYPE 02</span>
                  <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--heading-color)', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Pit-Type Weighbridges</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>Built flush with the surrounding ground, pit-type weighbridges require less approach space because vehicles can steer onto the platform from multiple directions, making them the ultimate solution for tight layouts.</p>
                  {["Flush-to-ground profile allows multi-directional entry", "Requires minimal footprint, saving yard maneuvering space", "Heavy-duty design engineered to withstand severe traffic loads"].map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-main)', fontSize: '15px' }}>{pt}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', aspectRatio: '4/3' }}>
                  <img src="/images/pit-type-weighbridge.png" alt="Pit-Type Weighbridge" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUPPORT ── */}
        <section style={{ padding: '80px 0', background: 'var(--banner-bg)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.15)', padding: '6px 14px', borderRadius: '20px' }}>Lifecycle Support</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Installation, Calibration & Support</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Our support extends beyond supply to ensure consistent, certified performance.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {supportServices.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '28px 22px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-secondary)', opacity: 0.6, fontFamily: 'Outfit, sans-serif', lineHeight: 1, marginBottom: '16px' }}>{s.num}</div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{s.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', padding: '22px 28px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0 }}>
                For long-term reliability, we also offer{' '}
                <Link href="/amc" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'underline' }}>Annual Maintenance Contracts (AMC)</Link>
                {' '}to ensure uninterrupted performance.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Our Advantage</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Why Choose Lathey Weigh Trix?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: 1.8 }}>Trusted by manufacturers and logistics operators across India for precision-engineered industrial weighing solutions.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {valueProps.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-1)', padding: '18px 22px', borderRadius: '14px', border: '1px solid var(--surface-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={18} color="#fff" />
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
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Need a weighing solution tailored to your application?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '36px', maxWidth: '560px', margin: '0 auto 36px' }}>Get expert consultation and technical specifications from our engineering team.</p>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--color-primary)', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(36,82,143,0.3)' }}>
              Request Consultation <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
