"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AutomationPage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      background: 'var(--bg-body)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* CSS Keyframe Animations & Theme-Aware Variables */}
      <style jsx global>{`
        :root {
          --circuit-trace: rgba(36, 82, 143, 0.08);
          --card-glass-bg: rgba(255, 255, 255, 0.75);
          --card-glass-border: rgba(0, 0, 0, 0.08);
          --glow-multiplier: 0.8;
          --bg-glow-opacity: 0.07;
        }
        [data-theme="dark"] {
          --circuit-trace: rgba(59, 130, 246, 0.12);
          --card-glass-bg: rgba(15, 23, 42, 0.45);
          --card-glass-border: rgba(255, 255, 255, 0.08);
          --glow-multiplier: 1.4;
          --bg-glow-opacity: 0.15;
        }

        @keyframes circuitFlowForward {
          0% { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes circuitFlowBackward {
          0% { stroke-dashoffset: -240; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes nodePulseFast {
          0%, 100% { transform: scale(1); opacity: 0.5; filter: drop-shadow(0 0 2px rgba(59,130,246,0.5)); }
          50% { transform: scale(1.4); opacity: 1; filter: drop-shadow(0 0 12px rgba(59,130,246,0.9)); }
        }
        @keyframes nodePulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.4; filter: drop-shadow(0 0 2px rgba(245,158,11,0.4)); }
          50% { transform: scale(1.5); opacity: 1; filter: drop-shadow(0 0 14px rgba(245,158,11,0.9)); }
        }
        @keyframes pulseAura {
          0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1.1; transform: translate(-50%, -50%) scale(1.05); }
        }
        
        .flow-fast {
          stroke-dasharray: 45 155;
          animation: circuitFlowForward 4s linear infinite;
        }
        .flow-medium {
          stroke-dasharray: 60 180;
          animation: circuitFlowForward 7s linear infinite;
        }
        .flow-medium-reverse {
          stroke-dasharray: 50 190;
          animation: circuitFlowBackward 6s linear infinite;
        }
        .flow-slow {
          stroke-dasharray: 70 170;
          animation: circuitFlowForward 10s linear infinite;
        }
        .flow-slow-reverse {
          stroke-dasharray: 80 160;
          animation: circuitFlowBackward 9s linear infinite;
        }
        .node-blue {
          transform-origin: center;
          animation: nodePulseFast 2.5s ease-in-out infinite;
        }
        .node-amber {
          transform-origin: center;
          animation: nodePulseSlow 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Tech Grid Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(var(--surface-border-mid) 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px',
        opacity: 0.4,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* 2. Interactive Glowing Radial Aura */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px',
        height: '900px',
        background: 'radial-gradient(circle, rgba(59,130,246,var(--bg-glow-opacity)) 0%, rgba(245,158,11,0.04) 40%, rgba(139,92,246,0.02) 60%, transparent 75%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'pulseAura 8s ease-in-out infinite'
      }} />

      {/* 3. SVG High-Tech Circuit Board / Electricity Lines */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Glow Filters */}
        <defs>
          <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-violet" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Background Static Traces (Denser Network) ── */}
        <g stroke="var(--circuit-trace)" strokeWidth="1.25" fill="none">
          {/* Top Left & Center Top */}
          <path d="M-50,150 L200,150 L280,230 L280,400" />
          <path d="M120,-50 L120,80 L220,180 L400,180 L460,240" />
          <path d="M350,-50 L350,100 L420,170" />
          {/* Top Right & Right Side */}
          <path d="M1200,-50 L1200,100 L1100,200 L850,200 L780,270 L780,450" />
          <path d="M950,-50 L950,50 L1020,120 L1250,120" />
          <path d="M1350,300 L1100,300 L1020,380 L1020,550" />
          {/* Bottom Left & Left Side */}
          <path d="M-50,600 L150,600 L250,500 L250,350" />
          <path d="M-50,420 L80,420 L150,490 L150,680" />
          <path d="M350,900 L350,750 L450,650 L600,650 M600,650 L680,570" />
          {/* Bottom Right & Bottom Center */}
          <path d="M1300,550 L1100,550 L980,670 L980,900" />
          <path d="M800,900 L800,800 L880,720 L1250,720" />
          <path d="M620,900 L620,820 L720,720 L720,620" />
        </g>

        {/* ── Active Flowing Electricity Currents (Highly Animated Overlay) ── */}
        <g strokeWidth="2" fill="none" opacity="var(--glow-multiplier)">
          {/* Electric Cyan/Blue Flowing Paths */}
          <path d="M-50,150 L200,150 L280,230 L280,400" stroke="#3b82f6" filter="url(#glow-blue)" className="flow-fast" />
          <path d="M120,-50 L120,80 L220,180 L400,180 L460,240" stroke="#60a5fa" filter="url(#glow-blue)" className="flow-medium" />
          <path d="M800,900 L800,800 L880,720 L1250,720" stroke="#3b82f6" filter="url(#glow-blue)" className="flow-medium-reverse" />
          <path d="M350,900 L350,750 L450,650 L600,650 L680,570" stroke="#3b82f6" filter="url(#glow-blue)" className="flow-slow" />
          
          {/* Neon Amber Flowing Paths */}
          <path d="M1200,-50 L1200,100 L1100,200 L850,200 L780,270 L780,450" stroke="#f59e0b" filter="url(#glow-amber)" className="flow-medium" />
          <path d="M-50,600 L150,600 L250,500 L250,350" stroke="#fbbf24" filter="url(#glow-amber)" className="flow-fast" />
          <path d="M620,900 L620,820 L720,720 L720,620" stroke="#f59e0b" filter="url(#glow-amber)" className="flow-slow-reverse" />

          {/* Violet/Purple Electric Traces (Adding a third tech color layer) */}
          <path d="M1350,300 L1100,300 L1020,380 L1020,550" stroke="#8b5cf6" filter="url(#glow-violet)" className="flow-fast" />
          <path d="M-50,420 L80,420 L150,490 L150,680" stroke="#a78bfa" filter="url(#glow-violet)" className="flow-medium-reverse" />
        </g>

        {/* ── Pulsing semiconductor junction nodes (More intersections populated) ── */}
        <g opacity="var(--glow-multiplier)">
          {/* Blue/Cyan Glowing Nodes */}
          <circle cx="200" cy="150" r="4.5" fill="#3b82f6" className="node-blue" />
          <circle cx="280" cy="230" r="4.5" fill="#3b82f6" className="node-blue" />
          <circle cx="450" cy="650" r="4.5" fill="#3b82f6" className="node-blue" />
          <circle cx="880" cy="720" r="4.5" fill="#3b82f6" className="node-blue" />
          <circle cx="150" cy="490" r="4.5" fill="#3b82f6" className="node-blue" />
          <circle cx="1020" cy="380" r="4.5" fill="#3b82f6" className="node-blue" />

          {/* Amber/Yellow Glowing Nodes */}
          <circle cx="1100" cy="200" r="5" fill="#f59e0b" className="node-amber" />
          <circle cx="850" cy="200" r="5" fill="#f59e0b" className="node-amber" />
          <circle cx="150" cy="600" r="5" fill="#f59e0b" className="node-amber" />
          <circle cx="250" cy="500" r="5" fill="#f59e0b" className="node-amber" />
          <circle cx="720" cy="720" r="5" fill="#f59e0b" className="node-amber" />
          <circle cx="420" cy="170" r="5" fill="#f59e0b" className="node-amber" />
        </g>
      </svg>

      <Header />
      
      <main style={{ 
        paddingTop: '80px', 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1 
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 40px',
          maxWidth: '520px',
          width: '90%',
          background: 'var(--card-glass-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '32px',
          border: '1px solid var(--card-glass-border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}>
          {/* Top neon energy glow line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #3b82f6, #f59e0b, transparent)',
            boxShadow: '0 0 12px rgba(59,130,246,0.4)',
            opacity: 'var(--glow-multiplier)'
          }} />

          {/* Gluvok Logo Wrapper with smooth entry styling */}
          <div style={{ 
            marginBottom: '40px',
            display: 'inline-block',
            padding: '24px 32px',
            borderRadius: '24px',
            background: 'var(--surface-1)',
            border: '1px solid var(--surface-border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
            transition: 'background 0.3s ease, border-color 0.3s ease'
          }}>
            <img
              src="/images/gluvok-logo.png"
              alt="Gluvok by Lathey Weigh Trix"
              style={{ maxWidth: '240px', height: 'auto', display: 'block' }}
            />
          </div>

          {/* New Venture Badge Tag */}
          <div style={{ marginBottom: '32px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px', 
              fontWeight: 800, 
              letterSpacing: '2.5px', 
              textTransform: 'uppercase', 
              color: 'var(--color-secondary)', 
              background: 'rgba(245,158,11,0.08)', 
              padding: '8px 20px', 
              borderRadius: '100px',
              border: '1px solid rgba(245,158,11,0.15)',
              boxShadow: '0 4px 12px rgba(245,158,11,0.05)'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--color-secondary)',
                boxShadow: '0 0 8px var(--color-secondary)',
                display: 'inline-block'
              }} />
              A New Venture by Lathey Weigh Trix
            </span>
          </div>

          {/* Coming Soon Text */}
          <div style={{
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Coming Soon
          </div>

          <div style={{
            height: '1px',
            width: '40px',
            background: 'var(--surface-border-mid)',
            margin: '0 auto 20px'
          }} />

          {/* Description */}
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '14px', 
            lineHeight: 1.8, 
            maxWidth: '380px', 
            margin: '0 auto',
            letterSpacing: '0.3px'
          }}>
            Next-generation industrial automation, process optimization, and smart weighing integration solutions.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
