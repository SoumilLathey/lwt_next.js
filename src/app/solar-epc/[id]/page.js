"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Sun, CheckCircle2, ArrowLeft, ArrowRight, ClipboardCheck, Sparkles, AlertCircle, Cpu, Droplet, Calendar, Layout, MapPin, Wifi } from 'lucide-react';

const parseSpec = (spec) => {
  const parts = spec.split(":");
  if (parts.length > 1) {
    return { label: parts[0].trim(), value: parts.slice(1).join(":").trim() };
  }
  return { label: "Features", value: spec.trim() };
};

const getSpecIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes("capacity")) return Cpu;
  if (l.includes("space")) return Layout;
  if (l.includes("coverage")) return MapPin;
  if (l.includes("water") || l.includes("output")) return Droplet;
  if (l.includes("lifespan") || l.includes("roi") || l.includes("period")) return Calendar;
  if (l.includes("connectivity") || l.includes("smart")) return Wifi;
  return CheckCircle2;
};

const solutionsData = [
  {
    id: "commercial-rooftop",
    title: "Commercial Rooftop Solar Systems",
    subtitle: "Optimized solar rooftop solutions for commercial buildings, offices, institutions, and business parks.",
    description: "Large-scale rooftop solar power systems designed specifically for commercial offices, commercial buildings, educational institutions, and business complexes. We configure these systems to optimize return on investment (ROI) by maximizing self-consumption and utilizing net metering.",
    heroImage: "/images/commercial-rooftop-solar.jpg",
    idealFor: [
      "Commercial office buildings",
      "Educational institutions and universities",
      "Hospitals and hospitality facilities",
      "Shopping malls and retail hubs"
    ],
    benefits: [
      "Significant reduction in commercial electricity bills",
      "Harness unused roof space for clean energy",
      "Accelerated depreciation benefits for businesses",
      "Demonstrate corporate environmental responsibility"
    ],
    technicalSpecs: [
      "Capacity: 20 kW to 500+ kW",
      "Space required: 90-100 sq.ft per kW",
      "Tier-1 monocrystalline panels",
      "Net-metering configuration supported"
    ]
  },
  {
    id: "agricultural-solar",
    title: "Agricultural Solar Systems",
    subtitle: "Solar-powered irrigation and farming solutions to reduce operational costs and ensure reliable water supply.",
    description: "Innovative solar solutions for agricultural applications, including solar water pumps, irrigation systems, and farm power supply to enhance productivity and sustainability. Designed for rural terrains, these systems provide reliable daytime irrigation without dependence on grid power.",
    heroImage: "/images/agri-solar-latest.jpg",
    idealFor: [
      "Farms and agricultural lands",
      "Irrigation projects & community wells",
      "Rural farming co-operatives",
      "Greenhouse operations"
    ],
    benefits: [
      "Zero fuel cost for irrigation",
      "Consistent daytime power for farm operations",
      "Protects crops against power cuts",
      "Eligible for government agricultural subsidies"
    ],
    technicalSpecs: [
      "Capacity: 1 HP to 25 HP pumps",
      "Smart Net Connectivity: Control remotely",
      "Water output: 10,000-50,000 liters/day",
      "Lifespan: 20+ years"
    ]
  },
  {
    id: "industrial-rooftop",
    title: "Industrial Rooftop Solar Systems",
    subtitle: "High-capacity rooftop solar plants designed for factories and industrial facilities to reduce energy costs and improve power reliability.",
    description: "High-capacity rooftop solar plants designed for factories and industrial facilities to reduce energy costs and improve power reliability. Designed to support heavy inductive loads and integrate seamlessly with existing captive industrial grids or backup diesel generator installations.",
    heroImage: "/images/industrial-rooftop-new.jpg",
    idealFor: [
      "Manufacturing factories & processing plants",
      "Warehouses and cold storage facilities",
      "Textile, cement, and chemical mills",
      "Heavy engineering workshops"
    ],
    benefits: [
      "Dramatic reduction in peak industrial tariff costs",
      "Protection against grid power cuts and fluctuations",
      "Earn carbon credits and meet ESG compliance",
      "Lower operational overheads at scale"
    ],
    technicalSpecs: [
      "Capacity: 100 kW to 1 MW+",
      "Space requirement: 80-100 sq.ft per kW",
      "ROI period: 3-5 years",
      "Lifespan: 25+ years"
    ]
  },
  {
    id: "residential-rooftop",
    title: "Residential Rooftop Solar Systems",
    subtitle: "Smart rooftop solar solutions designed for homes, villas, and residential buildings.",
    description: "Smart rooftop solar solutions designed for homes, villas, and residential complexes with minimal maintenance and maximum savings. These installations feature neat cable routing, aesthetic setups, and high-safety inverters with quick shutdown capability.",
    heroImage: "/images/residential-solar-final.jpg",
    idealFor: [
      "Individual homes and villas",
      "Residential housing societies",
      "Apartment complex common utilities",
      "Independent farmhouses"
    ],
    benefits: [
      "Reduce monthly household bills by up to 90%",
      "Clean, silent source of home energy",
      "Protection against grid power hikes",
      "Low maintenance with simple cleaning schedules"
    ],
    technicalSpecs: [
      "Capacity: 1 kW to 10 kW",
      "Space requirement: 100 sq.ft per kW",
      "ROI period: 4-6 years",
      "Net metering available"
    ]
  }
];

export default function SolarEpcDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const matched = solutionsData.find(item => item.id === params.id);
    if (matched) {
      setData(matched);
      window.scrollTo(0, 0);
    } else {
      router.push("/solar-epc");
    }
  }, [params.id]);

  if (!data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loader" />
        <p>Loading solution details...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        <PageHeader 
          title={data.title} 
          description={data.subtitle} 
          image={data.heroImage} 
        />

        <section className="section bg-white" style={{ background: 'var(--bg-body)' }}>
          <div className="container max-w-5xl mx-auto px-4" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
            <Link href="/solar-epc" className="inline-flex items-center text-primary font-semibold mb-8 hover:text-secondary transition-colors" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '32px', textDecoration: 'none' }}>
              <ArrowLeft size={20} /> Back to Solar Services
            </Link>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6" style={{ fontSize: '28px', color: 'var(--color-primary)', marginBottom: '24px' }}>Overview</h2>
              <p className="text-lg text-slate-700 mb-12 leading-loose" style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '48px' }}>
                {data.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '48px' }}>
                {/* Ideal For */}
                <div 
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
                  style={{ 
                    background: 'var(--bg-card)', 
                    padding: '32px', 
                    borderRadius: '16px', 
                    borderLeft: '4px solid var(--color-primary)',
                    borderTop: '1px solid var(--bg-glass-border)',
                    borderRight: '1px solid var(--bg-glass-border)',
                    borderBottom: '1px solid var(--bg-glass-border)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', color: 'var(--color-primary)', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(36, 82, 143, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                      <ClipboardCheck size={20} />
                    </div>
                    Ideal For
                  </h3>
                  <ul className="space-y-4" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {data.idealFor.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>
                        <span className="text-secondary font-bold text-xl" style={{ color: 'var(--color-secondary)' }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Benefits */}
                <div 
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
                  style={{ 
                    background: 'var(--bg-card)', 
                    padding: '32px', 
                    borderRadius: '16px', 
                    borderLeft: '4px solid #10b981',
                    borderTop: '1px solid var(--bg-glass-border)',
                    borderRight: '1px solid var(--bg-glass-border)',
                    borderBottom: '1px solid var(--bg-glass-border)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', color: 'var(--color-primary)', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                      <Sparkles size={20} />
                    </div>
                    Key Benefits
                  </h3>
                  <ul className="space-y-4" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {data.benefits.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>
                        <CheckCircle2 size={20} className="text-green-600" style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Specifications */}
              <div style={{ marginBottom: '48px' }}>
                <h3 className="text-2xl font-bold text-primary flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', color: 'var(--color-primary)', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
                    <AlertCircle size={20} />
                  </div>
                  Technical Specifications
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                  {data.technicalSpecs.map((spec, idx) => {
                    const parsed = parseSpec(spec);
                    const SpecIcon = getSpecIcon(parsed.label);
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          background: 'var(--bg-card)', 
                          border: '1px solid var(--bg-glass-border)', 
                          borderRadius: '12px', 
                          padding: '24px', 
                          boxShadow: 'var(--shadow-sm)', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '12px' 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)' }}>
                          <SpecIcon size={20} style={{ color: 'var(--color-secondary)' }} />
                          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
                            {parsed.label}
                          </span>
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: '1.4' }}>
                          {parsed.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom CTA Block */}
              <div className="bg-slate-900 rounded-3xl p-10 text-center text-white relative overflow-hidden cta-block" style={{ color: '#fff', borderRadius: '24px', padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-4" style={{ fontSize: '28px', color: '#fff', marginBottom: '16px' }}>Ready to Switch to Solar?</h2>
                  <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto" style={{ color: '#ffffffd9', fontSize: '18px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                    Contact us today for a detailed feasibility study and a customized quote for your {data.title.toLowerCase()}.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <Link href="/contact" className="btn btn-secondary text-white hover:bg-white hover:text-primary border-none text-lg px-8 py-4" style={{ background: 'var(--color-secondary)', color: '#fff', border: 'none' }}>
                      Get a Quote <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </Link>
                    <Link href="/solar-roi" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4" style={{ border: '2px solid #fff', color: '#fff', background: 'transparent' }}>
                      Calculate ROI
                    </Link>
                  </div>
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
