"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { Sun, CheckCircle2, ChevronRight, HelpCircle, X, ArrowRight, Building, Sprout, Factory, Home } from 'lucide-react';

export default function SolarEpcPage() {
  const [showPopup, setShowPopup] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { num: "01", title: "Site Survey & Feasibility Study", description: "Technical and structural evaluation to assess system suitability and generation potential." },
    { num: "02", title: "Customised System Design", description: "Optimised solar plant design based on load, available space, and efficiency goals." },
    { num: "03", title: "Procurement of Tier-1 Modules", description: "High-quality components selected for durability, efficiency, and long service life." },
    { num: "04", title: "Installation & Commissioning", description: "Professional execution with strict adherence to safety and performance standards." },
    { num: "05", title: "Operation & Maintenance (O&M)", description: "Ongoing support to ensure consistent energy generation and long-term reliability." },
  ];

  const solutions = [
    { id: "commercial-rooftop", icon: Building, title: "Commercial Rooftop Solar", subtitle: "Optimised solar rooftop solutions for commercial buildings, offices, institutions, and business parks.", heroImage: "/images/commercial-rooftop-solar.jpg" },
    { id: "agricultural-solar", icon: Sprout, title: "Agricultural Solar Systems", subtitle: "Solar-powered irrigation and farming solutions to reduce operational costs and ensure reliable water supply.", heroImage: "/images/agri-solar-latest.jpg" },
    { id: "industrial-rooftop", icon: Factory, title: "Industrial Rooftop Solar", subtitle: "High-capacity rooftop solar plants for factories and industrial facilities.", heroImage: "/images/industrial-rooftop-new.jpg" },
    { id: "residential-rooftop", icon: Home, title: "Residential Rooftop Solar", subtitle: "Smart rooftop solar solutions designed for homes, villas, and residential buildings.", heroImage: "/images/residential-solar-final.jpg" },
  ];

  const whyChooseUs = [
    "End-to-end EPC expertise under one roof",
    "Engineering-driven system design and optimisation",
    "Use of high-quality, trusted Tier-1 solar components",
    "Professional installation and commissioning",
    "Long-term operation & maintenance capability",
  ];

  const faqs = [
    { question: "What is Solar EPC?", answer: "Solar EPC (Engineering, Procurement, and Construction) refers to a complete service model where a single provider handles the design, supply, installation, commissioning, and support of a solar power system." },
    { question: "What types of solar systems do you install?", answer: "We install industrial, commercial, and residential rooftop solar systems, as well as ground-mounted solar power plants, based on site conditions and energy requirements." },
    { question: "Do you provide end-to-end solar installation services?", answer: "Yes. Our Solar EPC services cover the entire project lifecycle — from site survey and system design to installation, commissioning, and ongoing O&M." },
    { question: "How much space is required for a rooftop solar system?", answer: "On average, 1 kW of solar capacity requires 30–40 sq. ft. of shadow-free rooftop area." },
    { question: "How long does installation take?", answer: "Most rooftop solar installations are completed within 2–3 days (up to 10 kW), depending on system size, site readiness, and approvals." },
    { question: "What is the typical lifespan of a solar power plant?", answer: "Solar power systems are designed to operate for 25 years or more, with proper maintenance ensuring consistent performance over time." },
    { question: "Do you offer maintenance after installation?", answer: "Yes. We provide O&M services to ensure optimal system performance, reliability, and long-term energy generation." },
    { question: "How can I estimate my savings?", answer: "Use our Solar ROI Calculator to get an estimate of installation cost, savings, and payback period based on your inputs." },
  ];

  const brands = [
    { name: "Brand 1", logo: "/brands/brand-1.png" },
    { name: "Brand 2", logo: "/brands/brand-2.png" },
    { name: "Brand 3", logo: "/brands/brand-3.png" },
    { name: "Brand 4", logo: "/brands/brand-4.png" },
    { name: "Brand 5", logo: "/brands/brand-5.png" },
    { name: "Brand 6", logo: "/brands/brand-6.png" },
    { name: "Brand 7", logo: "/brands/brand-7.png" },
    { name: "Brand 8", logo: "/brands/brand-8.png" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <PageHeader
          title="Solar EPC Services"
          description="Lathey Weigh Trix provides comprehensive Solar EPC services for industrial, commercial, and residential energy requirements — from initial assessment to final commissioning."
          image="/images/solar-farm-bg.jpg"
        />

        {/* PM Surya Ghar Popup */}
        {showPopup && (
          <>
            <div onClick={() => setShowPopup(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.55)', zIndex: 10000 }} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--surface-1)', padding: '36px', borderRadius: '20px', zIndex: 10001, maxWidth: '480px', width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
              <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} color="#64748b" />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <span style={{ color: '#24528F', fontWeight: 900, fontSize: '28px', fontFamily: 'Outfit, sans-serif' }}>LWT</span>
                <span style={{ color: '#94a3b8', margin: '0 6px', fontSize: '28px' }}>|</span>
                <span style={{ color: '#24528F', fontWeight: 600, fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>Lathey Weigh Trix</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Sun size={32} color="#fff" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e3a5f', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>PM Surya Ghar: Muft Bijli Yojna</h2>
                <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#f59e0b', marginBottom: '12px' }}>मुफ्त बिजली योजना</h3>
                <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '15px' }}>Get government subsidy for solar installation</p>
                <Link href="/contact" onClick={() => setShowPopup(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                  Enquire Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ── STAT STRIP ── */}
        <section style={{ background: 'var(--color-primary)', padding: 0 }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { value: "25 Yrs", label: "System Design Life" },
              { value: "Tier-1", label: "Solar Module Quality" },
              { value: "Full EPC", label: "End-to-End Delivery" },
            ].map((s, i) => (
              <div key={i} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '6px', fontWeight: 500, letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Concept to Commissioning</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Complete Solar EPC Execution</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>We manage the entire solar project lifecycle to ensure smooth execution, technical accuracy, and dependable outcomes.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {steps.map((step, idx) => (
                <div key={idx} style={{ background: 'var(--surface-grad-soft)', borderRadius: '16px', padding: '28px 20px', border: '1px solid var(--surface-border)', textAlign: 'center', position: 'relative' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-secondary)', opacity: 0.4, fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>{step.num}</div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--heading-color)', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{step.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOLUTIONS ── */}
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Product Range</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Solar Solutions We Offer</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px' }}>Click on any solution to learn more</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              {solutions.map((sol, idx) => {
                const Icon = sol.icon;
                return (
                  <Link href={`/solar-epc/${sol.id}`} key={idx} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--surface-1)', borderRadius: '20px', border: '1px solid var(--surface-border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                      <div style={{ height: '220px', overflow: 'hidden' }}>
                        <img src={sol.heroImage} alt={sol.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }} />
                      </div>
                      <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={18} color="var(--color-secondary)" />
                          </div>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--heading-color)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>{sol.title}</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>{sol.subtitle}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontWeight: 700, fontSize: '13px' }}>
                          Learn More <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section style={{ padding: '80px 0', background: 'var(--banner-bg)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.15)', padding: '6px 14px', borderRadius: '20px' }}>Our Advantage</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '20px' }}>Why Choose Lathey Weigh Trix for Solar EPC?</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', lineHeight: 1.8 }}>We focus on delivering solar solutions that perform consistently over 25 years, not just installations.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {whyChooseUs.map((text, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRANDS ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)', overflow: 'hidden' }}>
          <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Trusted Partners</span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>Authorised Reseller</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '17px' }}>We work with leading Tier-1 solar brands to ensure quality, performance, and reliability across every project.</p>
          </div>
          <div className="marquee-container">
            <div className="marquee-content">
              {[...brands, ...brands].map((brand, idx) => (
                <div key={idx} style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', borderRadius: '12px', padding: '16px', height: '120px', width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={brand.logo} alt={brand.name} style={{ maxHeight: '80px', maxWidth: '160px', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Common Questions</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Frequently Asked Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ background: 'var(--surface-1)', borderRadius: '14px', border: '1px solid var(--surface-border)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{ width: '100%', background: 'none', border: 'none', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <HelpCircle size={18} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)' }}>{faq.question}</span>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" style={{ transform: openFaq === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>
                  {openFaq === idx && (
                    <div style={{ padding: '0 24px 20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7, margin: '16px 0 0' }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-grad-cta)', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Planning a solar installation?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '36px', maxWidth: '560px', margin: '0 auto 36px' }}>Get expert consultation and calculate your potential savings with our Solar ROI calculator.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--color-primary)', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(36,82,143,0.3)' }}>
                Get Solar EPC Consultation <ArrowRight size={18} />
              </Link>
              <Link href="/solar-roi" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--surface-1)', color: 'var(--color-primary)', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '2px solid var(--color-primary)' }}>
                Calculate Your ROI <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
