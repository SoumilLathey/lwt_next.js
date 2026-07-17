"use client";

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scale, Sun, ArrowRight, Star, ChevronLeft, ChevronRight, CheckCircle2, Phone, Mail, MapPin, Gauge, Factory, Truck, Building2, Layers, Shield, Wrench, Zap, MessageSquare } from 'lucide-react';

export default function HomePage() {
  // ── Testimonials Slider ──
  const testimonials = [
    { id: 8, name: "Vijay Sharma", role: "G.M, Delhi Electric Company", quote: "A robust and precise weighing solution that supports our daily cable production and logistics efficiently.", initials: "VS", image: "/images/testimonials/vijay-sharma.png" },
    { id: 2, name: "Mahesh Chand Gupta", role: "Retired IAS", quote: "The solar plant is operating reliably, and the performance metrics are in line with the estimates provided at the time of installation.", initials: "MG", image: "/images/testimonials/mahesh-chand-gupta.jpg" },
    { id: 9, name: "Kanti Prasad", role: "Directorate of Veterinary Services", quote: "Reliable products and great service. The team at Lathey Weigh Trix is very professional and helpful.", initials: "KP", image: "/images/testimonials/kanti-prasad.jpg" },
    { id: 5, name: "Rajat Bhattar", role: "Architect", quote: "The solar installation has reduced our energy costs by nearly 40%. The ROI calculation was accurate, and the system is performing perfectly.", initials: "RB", image: "/images/testimonials/rajat-bhattar.jpg" },
    { id: 6, name: "K.B. Sharma", role: "VP Cane LH Sugar Factories, Pilibhit", quote: "We have been using LWT's weighing solutions in our sugar industry operations since 2007. Their equipment has consistently delivered accuracy and dependable performance.", initials: "KS", image: "/images/testimonials/kb-sharma.jpg" },
    { id: 7, name: "Umakant Agrawal", role: "Charted Accountant", quote: "We are extremely pleased with the quality of service and the performance of the products delivered by Lathey Weigh Trix.", initials: "U", image: "/images/testimonials/umakant.jpg" },
    { id: 1, name: "Modi Sugar Industries", role: "Public Limited Company", quote: "The products are reliable, accurate, and well-engineered. The team provides professional service and dependable long-term support.", initials: "MS", image: "/images/testimonials/modi-sugar.png" }
  ];

  const [slideIndex, setSlideIndex] = React.useState(0);
  const [visibleSlides, setVisibleSlides] = React.useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleSlides(1);
      else if (window.innerWidth < 1024) setVisibleSlides(2);
      else setVisibleSlides(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlides = testimonials.length - visibleSlides;
  const nextSlide = () => setSlideIndex(prev => (prev >= maxSlides ? 0 : prev + 1));
  const prevSlide = () => setSlideIndex(prev => (prev <= 0 ? maxSlides : prev - 1));

  React.useEffect(() => {
    const autoScroll = setInterval(() => { if (window.innerWidth >= 768) nextSlide(); }, 5000);
    return () => clearInterval(autoScroll);
  }, [visibleSlides, maxSlides]);

  // ── Contact Form ──
  const [contactData, setContactData] = React.useState({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
  const [formStatus, setFormStatus] = React.useState(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const handleContactChange = (e) => setContactData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus(null);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${contactData.firstName} ${contactData.lastName}`, email: contactData.email, phone: contactData.phone, service: contactData.service, message: contactData.message })
      });
      if (response.ok) { setFormStatus("success"); setContactData({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" }); }
      else setFormStatus("error");
    } catch (err) { console.error(err); setFormStatus("error"); }
    finally { setFormLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px 18px', borderRadius: '10px', border: '1.5px solid var(--surface-border-mid)', fontSize: '15px', background: 'var(--surface-1)', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', marginBottom: '8px', display: 'block' };

  const products = [
    { title: "Heavy-Duty Weighbridges", category: "Industrial & Logistics", desc: "Industrial weighbridges designed for heavy vehicle loads with consistent precision — ideal for factories, warehouses, and transport hubs.", img: "/images/weighbridge-home.jpg", href: "/scales" },
    { title: "Digital Platform Scales", category: "Precision Measurement", desc: "Digital platform scales delivering accurate and efficient weighing for manufacturing, warehousing, and quality control.", img: "/images/platform-scale-home.png", href: "/scales" },
    { title: "AMC Services", category: "Maintenance & Support", desc: "Keep your weighing systems at peak performance through regular maintenance, calibration, and priority support.", img: "/images/amc-service.jpg", href: "/amc" },
  ];

  const benefits = [
    { icon: CheckCircle2, text: "Improve operational accuracy" },
    { icon: CheckCircle2, text: "Reduce energy and operational costs" },
    { icon: CheckCircle2, text: "Support long-term business sustainability" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      <main style={{ flexGrow: 1 }}>

        {/* ═══ 1. HERO ═══ */}
        <section style={{ position: 'relative', height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: '-80px', paddingTop: '80px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.92) 100%)', zIndex: 2 }} />
          </div>
          <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: '1200px', padding: '0 24px' }}>
            <div style={{ maxWidth: '650px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '20px', background: 'rgba(245,158,11,0.15)', padding: '6px 16px', borderRadius: '20px' }}>Since 2000 — Trusted Engineering</span>
              <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', color: '#ffffff', fontFamily: 'Outfit, sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
                Precision Weighing & Reliable <span style={{ color: 'var(--color-secondary)' }}>Solar Energy Solutions</span>
              </h1>
              <p style={{ fontSize: '17px', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.8, maxWidth: '560px' }}>
                Lathey Weigh Trix delivers industrial weighing systems and end-to-end solar EPC solutions built for accuracy, efficiency, and long-term performance.
              </p>
              <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px', marginBottom: '36px', letterSpacing: '0.5px' }}>
                Trusted engineering. Measurable accuracy. Sustainable impact.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-primary)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 6px 24px rgba(36,82,143,0.35)' }}>
                  Explore Weighing Equipment <Scale size={18} />
                </Link>
                <Link href="/solar-epc" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', background: 'transparent' }}>
                  Explore Solar Solutions <Sun size={18} />
                </Link>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ position: 'absolute', bottom: '-60px', right: '0', display: 'flex', gap: '0', background: 'rgba(15,23,42,0.8)', borderRadius: '16px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              {[
                { value: "25+", label: "Years Experience" },
                { value: "2k+", label: "Projects Delivered" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((s, i) => (
                <div key={i} style={{ padding: '24px 36px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '6px', fontWeight: 500, letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 2. POSITIONING ═══ */}
        <section style={{ padding: '100px 0 80px', background: 'var(--surface-1)' }}>
          <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>What We Do</span>
            <h2 style={{ fontSize: '40px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', lineHeight: 1.2, marginBottom: '20px' }}>
              Engineering Solutions That Power Efficiency
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: 1.8, maxWidth: '680px', margin: '0 auto 48px' }}>
              We operate at the intersection of precision engineering and clean energy, serving industries that demand reliability, compliance, and performance at scale.
            </p>
            <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--heading-color)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Our solutions are designed to:</p>
              {benefits.map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--surface-2)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--surface-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="#fff" />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 3. PRODUCTS ═══ */}
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Our Products</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Industrial Weighing Solutions Built for Accuracy & Durability</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '680px', margin: '0 auto' }}>In high-volume industrial environments, inaccurate weighing leads to financial loss, compliance issues, and operational inefficiencies. Our systems eliminate these risks.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {products.map((p, i) => (
                <div key={i} style={{ background: 'var(--surface-1)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--surface-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '10px' }}>{p.category}</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>{p.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, flexGrow: 1, marginBottom: '20px' }}>{p.desc}</p>
                    <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '16px' }}>
                      <Link href={p.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
                        View Details <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', background: 'transparent' }}>
                View All Weighing Solutions
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ 4. SOLAR EPC ═══ */}
        <section style={{ padding: '80px 0', background: 'var(--banner-bg)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.05) 100%)', pointerEvents: 'none' }} />
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--color-secondary)', background: 'rgba(245,158,11,0.15)', padding: '8px 16px', borderRadius: '20px', marginBottom: '24px', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Sun size={16} /> Solar EPC Solutions
              </span>
              <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', lineHeight: 1.15, marginBottom: '24px' }}>
                Clean Energy Solutions for <span style={{ color: 'var(--color-secondary)' }}>Long-Term Cost Savings</span>
              </h2>
              <p style={{ fontSize: '17px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '32px' }}>We provide end-to-end solar EPC services — design, engineering, procurement, installation, and support for solar rooftop systems and ground-mounted solar power plants.</p>
              <div style={{ marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {["Reduce electricity costs", "Improve energy reliability", "Transition to sustainable power"].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={18} color="var(--color-secondary)" />
                    <span style={{ color: '#cbd5e1', fontSize: '15px' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
                <Link href="/solar-epc" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-secondary)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 6px 20px rgba(245,158,11,0.3)' }}>
                  Get Expert Consultation <ArrowRight size={16} />
                </Link>
                <Link href="/solar-roi" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px', textDecoration: 'none' }}>
                  <Zap size={16} /> Calculate Your Solar ROI
                </Link>
              </div>
            </div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ textAlign: 'center', color: '#fff', fontSize: '16px', lineHeight: 1.6, padding: '24px 20px', background: 'rgba(0,0,0,0.2)' }}>
                Power your operations with scalable, reliable solar energy solutions designed to perform efficiently over decades.
              </div>
              <img src="/solar-epc.png" alt="Rooftop Solar Installation" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>
          </div>
        </section>

        {/* ═══ 5. TESTIMONIALS ═══ */}
        <section style={{ padding: '80px 0', background: 'var(--surface-grad-fade)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Testimonials</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Client Success Stories</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '600px', margin: '0 auto' }}>Our clients choose us for engineering expertise, dependable service, and long-term value creation.</p>
            </div>

            <div style={{ position: 'relative', padding: '0 52px' }}>
              <button onClick={prevSlide} aria-label="Previous" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '42px', height: '42px', borderRadius: '50%', background: 'var(--surface-1)', border: '1px solid var(--surface-border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 2, color: 'var(--heading-color)' }}>
                <ChevronLeft size={22} />
              </button>

              <div style={{ overflow: 'hidden', width: '100%' }}>
                <div style={{ display: 'flex', gap: '24px', transition: 'transform 0.5s ease-in-out', transform: `translateX(calc(-${slideIndex} * (100% / ${visibleSlides} + (24px / ${visibleSlides}))))` }}>
                  {testimonials.map(item => (
                    <div key={item.id} style={{ flex: `0 0 calc(100% / ${visibleSlides} - ${(visibleSlides - 1) * 24 / visibleSlides}px)`, background: 'var(--surface-1)', borderRadius: '18px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', minHeight: '280px' }}>
                      <div style={{ fontSize: '48px', color: 'var(--color-secondary)', lineHeight: 1, marginBottom: '8px', opacity: 0.4, fontFamily: 'Georgia, serif' }}>"</div>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="#FFD700" color="#FFD700" />
                        ))}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, fontStyle: 'italic', flexGrow: 1, marginBottom: '20px' }}>{item.quote}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--surface-border)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : item.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={nextSlide} aria-label="Next" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '42px', height: '42px', borderRadius: '50%', background: 'var(--surface-1)', border: '1px solid var(--surface-border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 2, color: 'var(--heading-color)' }}>
                <ChevronRight size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              {[...Array(Math.max(0, testimonials.length - visibleSlides + 1))].map((_, idx) => (
                <div key={idx} onClick={() => setSlideIndex(idx)} style={{ width: '10px', height: '10px', borderRadius: '50%', background: slideIndex === idx ? 'var(--color-primary)' : 'var(--surface-border-mid)', cursor: 'pointer', transition: 'background 0.3s ease', transform: slideIndex === idx ? 'scale(1.3)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 6. CONTACT & ENQUIRY ═══ */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Get In Touch</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Let's Build the Right Solution for Your Business</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>Whether you're planning a solar installation, upgrading weighing systems, or securing a maintenance contract — our team is ready to help.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
              {/* Form */}
              <div style={{ background: 'var(--surface-grad-soft)', borderRadius: '24px', padding: '40px', border: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={20} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Send Us a Message</h3>
                </div>

                {formStatus === "success" && (
                  <div style={{ padding: '14px 18px', borderRadius: '10px', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
                    ✓ Thank you! Your enquiry has been sent. We'll get back to you shortly.
                  </div>
                )}
                {formStatus === "error" && (
                  <div style={{ padding: '14px 18px', borderRadius: '10px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
                    ✗ Failed to send. Please try again or contact us directly.
                  </div>
                )}

                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><label style={labelStyle}>First Name</label><input type="text" name="firstName" placeholder="John" value={contactData.firstName} onChange={handleContactChange} required style={inputStyle} /></div>
                    <div><label style={labelStyle}>Last Name</label><input type="text" name="lastName" placeholder="Doe" value={contactData.lastName} onChange={handleContactChange} required style={inputStyle} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><label style={labelStyle}>Email Address</label><input type="email" name="email" placeholder="john@company.com" value={contactData.email} onChange={handleContactChange} required style={inputStyle} /></div>
                    <div><label style={labelStyle}>Phone Number</label><input type="tel" name="phone" placeholder="9876543210" value={contactData.phone} onChange={handleContactChange} style={inputStyle} /></div>
                  </div>
                  <div><label style={labelStyle}>Service Interest</label>
                    <select name="service" value={contactData.service} onChange={handleContactChange} style={inputStyle}>
                      <option value="">Select a Service</option>
                      <option value="Weighbridges">Weighbridges</option>
                      <option value="Industrial Scales">Industrial Scales</option>
                      <option value="Solar EPC">Solar EPC</option>
                      <option value="Automation">Automation</option>
                      <option value="AMC Services">AMC Services</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Message</label><textarea name="message" placeholder="Tell us about your requirements..." value={contactData.message} onChange={handleContactChange} required style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} /></div>
                  <button type="submit" disabled={formLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: formLoading ? '#94a3b8' : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: formLoading ? 'not-allowed' : 'pointer', boxShadow: formLoading ? 'none' : '0 6px 20px rgba(36,82,143,0.3)', transition: 'all 0.3s ease' }}>
                    {formLoading ? "Sending..." : <>Get Expert Consultation <ArrowRight size={18} /></>}
                  </button>
                </form>
              </div>

              {/* Contact Info + Map */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: Phone, label: "Call Us", value: "+91 92591 60644", href: "tel:+919259160644" },
                  { icon: Mail, label: "Email Us", value: "info@latheyweightrix.com", href: "mailto:info@latheyweightrix.com" },
                  { icon: MapPin, label: "Visit Us", value: "40, Prem Prayag Colony, Garh Road, Meerut, UP - 250004" },
                ].map((cd, i) => {
                  const Icon = cd.icon;
                  const inner = (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-2)', padding: '20px', borderRadius: '14px', border: '1px solid var(--surface-border)' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(36,82,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} color="var(--color-primary)" />
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{cd.label}</p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--heading-color)', margin: 0, lineHeight: 1.5 }}>{cd.value}</p>
                      </div>
                    </div>
                  );
                  return cd.href ? <a key={i} href={cd.href} style={{ textDecoration: 'none' }}>{inner}</a> : <div key={i}>{inner}</div>;
                })}

                <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', flexGrow: 1, marginTop: '4px' }}>
                  <div style={{ background: 'var(--surface-2)', borderRadius: '20px 20px 0 0', padding: '20px 24px', border: '1px solid var(--surface-border)', borderBottom: 'none' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '4px' }}>📍 Find Us on the Map</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>40, Prem Prayag Colony, Garh Road, Meerut, UP – 250004</p>
                  </div>
                  <iframe
                    src="https://maps.google.com/maps?q=Lathey+Weigh+Trix+Meerut&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="280"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lathey Weigh Trix Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
