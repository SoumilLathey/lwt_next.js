"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Sun } from 'lucide-react';

const Linkedin = ({ size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col footer-brand">
            <h2 className="!m-0 text-xl mb-4">LWT</h2>
            <p>
              Lathey Weigh Trix delivers precision-engineered weighing systems and efficient solar energy solutions that help businesses operate smarter, leaner, and more sustainably.
            </p>
            <div className="flex gap-4" style={{ display: 'flex', gap: '16px' }}>
              <a 
                href="https://www.linkedin.com/in/hareelathey/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/lwtsolar/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/about" className="footer-link">About Us</Link></li>
              <li><Link href="/scales" className="footer-link">Weighing Equipments</Link></li>
              <li>
                <Link href="/solar-epc" className="footer-link text-secondary flex items-center gap-1" style={{ color: 'var(--color-secondary)' }}>
                  <Sun size={14} /> Solar EPC
                </Link>
              </li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Products directory */}
          <div className="footer-col">
            <h3>Our Products</h3>
            <ul className="footer-links">
              <li><Link href="/scales" className="footer-link">Industrial Scales</Link></li>
              <li><Link href="/scales" className="footer-link">Platform Scales</Link></li>
              <li><Link href="/amc" className="footer-link">AMC Services</Link></li>
              <li><Link href="/solar-epc" className="footer-link">Solar Power Plants</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="footer-col">
            <h3>Get in Touch</h3>
            <div className="footer-contact-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <MapPin size={20} className="shrink-0 text-secondary" style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
              <span>
                40, Prem Prayag colony, Garh road,<br />
                Meerut, Uttar Pradesh, India - 250004
              </span>
            </div>
            <div className="footer-contact-item" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <Phone size={20} className="shrink-0 text-secondary" style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
              <span>+91 92591 60644</span>
            </div>
            <div className="footer-contact-item" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <Mail size={20} className="shrink-0 text-secondary" style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
              <span>info@latheyweightrix.com</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
          <p>© {new Date().getFullYear()} Lathey Weigh Trix. All rights reserved.</p>
          <div className="flex gap-6" style={{ display: 'flex', gap: '24px' }}>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
