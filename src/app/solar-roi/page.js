"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Sun, Zap, DollarSign, Percent, Calculator, ArrowRight } from 'lucide-react';

export default function SolarRoiPage() {
  const [formData, setFormData] = React.useState({
    plantSize: "5",
    costOfInstallation: "300000",
    subsidy: "78000",
    avgUnitsPerDay: "4.5",
    electricityTariff: "8"
  });

  const [results, setResults] = React.useState(null);

  // Trigger calculation automatically on mount with defaults
  React.useEffect(() => {
    calculateROI();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateROI = (e) => {
    if (e) e.preventDefault();
    const plantSize = parseFloat(formData.plantSize) || 0;
    const costOfInstallation = parseFloat(formData.costOfInstallation) || 0;
    const subsidy = parseFloat(formData.subsidy) || 0;
    const avgUnitsPerDay = parseFloat(formData.avgUnitsPerDay) || 0;
    const electricityTariff = parseFloat(formData.electricityTariff) || 0;

    const netInvestment = Math.max(0, costOfInstallation - subsidy);
    
    // 330 standard productive solar days per year in India
    const annualUnits = plantSize * 330 * avgUnitsPerDay;
    const annualSavings = annualUnits * electricityTariff;
    
    const paybackPeriod = annualSavings > 0 ? netInvestment / annualSavings : 0;
    const roiPercentage = netInvestment > 0 ? (annualSavings / netInvestment) * 100 : 0;
    const lifetimeSavings = annualSavings * 25;
    const lifetimeProfit = lifetimeSavings - netInvestment;

    setResults({
      costOfInstallation,
      netInvestment,
      annualUnits,
      annualSavings,
      paybackPeriod,
      roiPercentage,
      lifetimeSavings,
      lifetimeProfit,
      isProfitable: lifetimeSavings > netInvestment
    });
  };

  const fmt = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  const fmtD = (val) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(val);

  const howItWorks = [
    { num: "1", title: "Energy Generation", desc: "Estimated annual generation based on plant size and average daily units generated per kW (typically 4-5 units/kW/day)." },
    { num: "2", title: "Yearly Savings", desc: "Your savings from using own solar power instead of grid electricity, calculated from generation and your current grid tariff." },
    { num: "3", title: "Net Investment", desc: "Cost of Installation minus any government subsidy gives your actual out-of-pocket investment." },
    { num: "4", title: "Payback Period", desc: "How many years it takes to recover your investment through electricity savings. After this, energy is essentially free." },
    { num: "5", title: "Long-Term Returns", desc: "Solar systems are designed for 25+ years, giving you decades of savings well beyond the payback period." },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>

        {/* ── HERO ── */}
        <section style={{ padding: '80px 0 0', background: 'var(--banner-bg)', textAlign: 'center' }}>
          <div className="container" style={{ paddingBottom: '60px' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '16px', background: 'rgba(245,158,11,0.15)', padding: '6px 14px', borderRadius: '20px' }}>Solar ROI Calculator</span>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', fontFamily: 'Outfit, sans-serif', lineHeight: 1.15, marginBottom: '20px' }}>Estimate Your Solar Returns<br />in Minutes</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Enter your system configuration and installation costs to get a realistic breakdown of your savings and payback period.
            </p>
          </div>
          {/* Wave divider */}
          <svg viewBox="0 0 1440 60" style={{ display: 'block', width: '100%', marginBottom: '-2px' }} preserveAspectRatio="none">
            <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="#f8fafc" />
          </svg>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-2)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '12px', background: 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '20px' }}>Methodology</span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>How the Calculation Works</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {howItWorks.map((hw, i) => (
                <div key={i} style={{ background: 'var(--surface-1)', borderRadius: '16px', padding: '24px 18px', border: '1px solid var(--surface-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '16px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>{hw.num}</div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{hw.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>{hw.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CALCULATOR ── */}
        <section style={{ padding: '80px 0', background: 'var(--surface-1)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

            {/* Form */}
            <div style={{ background: 'var(--surface-grad-soft)', borderRadius: '24px', padding: '40px', border: '1px solid var(--surface-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator size={22} color="#fff" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Calculate Your Returns</h2>
              </div>
              
              <form onSubmit={calculateROI} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Plant Size */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="var(--color-secondary)" />
                    Plant Size (kW)
                  </label>
                  <input
                    type="number"
                    name="plantSize"
                    value={formData.plantSize}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    step="0.01"
                    required
                    style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '15px', background: 'var(--surface-1)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                {/* Cost of Installation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} color="var(--color-secondary)" />
                    Cost of Installation (₹)
                  </label>
                  <input
                    type="number"
                    name="costOfInstallation"
                    value={formData.costOfInstallation}
                    onChange={handleInputChange}
                    placeholder="e.g., 300000"
                    step="1"
                    required
                    style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '15px', background: 'var(--surface-1)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                {/* Government Subsidy */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Percent size={14} color="var(--color-secondary)" />
                    Government Subsidy (₹)
                  </label>
                  <input
                    type="number"
                    name="subsidy"
                    value={formData.subsidy}
                    onChange={handleInputChange}
                    placeholder="e.g., 78000"
                    step="1"
                    required
                    style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '15px', background: 'var(--surface-1)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                {/* Avg Units Per Day per kW */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sun size={14} color="var(--color-secondary)" />
                    Avg Generation (Units/day per kW)
                  </label>
                  <input
                    type="number"
                    name="avgUnitsPerDay"
                    value={formData.avgUnitsPerDay}
                    onChange={handleInputChange}
                    placeholder="e.g., 4.5"
                    step="0.1"
                    required
                    style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '15px', background: 'var(--surface-1)', color: 'var(--text-main)', outline: 'none' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    * 1 kW generates around 4.0 to 5.0 units per day under standard Indian conditions.
                  </span>
                </div>

                {/* Electricity Tariff */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="var(--color-secondary)" />
                    Current Grid Tariff (₹/unit)
                  </label>
                  <input
                    type="number"
                    name="electricityTariff"
                    value={formData.electricityTariff}
                    onChange={handleInputChange}
                    placeholder="e.g., 8"
                    step="0.01"
                    required
                    style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '15px', background: 'var(--surface-1)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', marginTop: '4px', boxShadow: '0 6px 20px rgba(36,82,143,0.3)' }}>
                  <Calculator size={20} /> Recalculate ROI
                </button>
              </form>
            </div>

            {/* Results */}
            <div>
              {!results ? (
                <div style={{ background: 'linear-gradient(135deg, rgba(36,82,143,0.05), rgba(245,158,11,0.05))', borderRadius: '24px', padding: '48px', border: '2px dashed rgba(36,82,143,0.15)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(36,82,143,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sun size={28} color="var(--color-secondary)" />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Your Results Appear Here</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0, maxWidth: '260px' }}>Fill in the form and click Calculate ROI to see your estimated solar returns.</p>
                </div>
              ) : (
                <div style={{ background: 'var(--surface-1)', borderRadius: '24px', padding: '36px', border: '1px solid var(--surface-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', marginBottom: '28px' }}>Estimated Returns</h2>

                  {/* Hero metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'linear-gradient(135deg, var(--color-primary), #1a3d6e)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Annual Savings</p>
                      <p style={{ color: 'var(--color-secondary)', fontSize: '26px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', margin: 0 }}>{fmt(results.annualSavings)}</p>
                    </div>
                    <div style={{ background: 'var(--surface-grad-soft)', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px solid var(--surface-border)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Payback Period</p>
                      <p style={{ color: 'var(--color-primary)', fontSize: '26px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', margin: 0 }}>{fmtD(results.paybackPeriod)} Yrs</p>
                    </div>
                  </div>

                  {/* Secondary metrics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {[
                      { label: "Cost of Installation", value: fmt(results.costOfInstallation), color: 'var(--text-main)' },
                      { label: "Net Out-of-Pocket Cost", value: fmt(results.netInvestment), color: 'var(--text-main)' },
                      { label: "Estimated Annual Gen.", value: `${fmtD(results.annualUnits)} Units`, color: 'var(--color-primary)' },
                      { label: "25-Year Total Savings", value: fmt(results.lifetimeSavings), color: '#2563eb' },
                      { label: "25-Year Net Profit", value: fmt(results.lifetimeProfit), color: '#16a34a' },
                      { label: "Return on Investment (ROI)", value: `${fmtD(results.roiPercentage)}%`, color: 'var(--color-secondary)' },
                    ].map((m, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{m.label}</span>
                        <span style={{ color: m.color, fontSize: '15px', fontWeight: 700 }}>{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div style={{ background: results.isProfitable ? 'rgba(22,163,74,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${results.isProfitable ? 'rgba(22,163,74,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '12px', padding: '16px 20px' }}>
                    {results.isProfitable ? (
                      <p style={{ margin: 0, color: '#166534', fontSize: '14px' }}>🎉 <strong>Great choice!</strong> You recover your investment in just <strong>{fmtD(results.paybackPeriod)} years</strong> — then enjoy free energy for the rest of the 25-year lifespan.</p>
                    ) : (
                      <p style={{ margin: 0, color: '#991b1b', fontSize: '14px' }}>⚠️ Consider adjusting your inputs or explore subsidy options for better returns.</p>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <Link href="/contact" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--color-primary)', color: '#fff', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                  Get Expert Consultation <ArrowRight size={16} />
                </Link>
                <Link href="/solar-epc" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--surface-1)', color: 'var(--color-primary)', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid var(--color-primary)' }}>
                  View Solar EPC Services
                </Link>
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '13px' }}>
            * Calculation based on 330 productive solar days/year (accounting for monsoon and seasonal variation in India)
          </p>
        </section>

      </main>
      <Footer />
    </div>
  );
}
