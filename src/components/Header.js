"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, ChevronDown, Menu, X, LogOut, Sun, Moon } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState({ weighing: false, solar: false, user: false });
  const [user, setUser] = React.useState(null);
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    // Check if user is logged in on mount & route change
    const storedUser = localStorage.getItem('lwt_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('lwt_token');
    localStorage.removeItem('lwt_user');
    setUser(null);
    setDropdownOpen({ weighing: false, solar: false, user: false });
    router.push('/');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="header-main">
      <div className="container header-container">
        <Link href="/" className="logo-wrap no-underline hover:opacity-90 transition-opacity">
          <span className="logo-text">LWT</span>
          <span className="divider"></span>
          <span className="brand-name">Lathey Weigh Trix</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About Us</Link>
          
          <div className="nav-item-dropdown">
            <span className="nav-link flex items-center gap-1">
              Weighing Equipments <ChevronDown size={14} />
            </span>
            <div className="dropdown-menu">
              <Link href="/scales" className="dropdown-link">Industrial Scales & Weighbridges</Link>
              <Link href="/automation" className="dropdown-link">Automation</Link>
              <Link href="/amc" className="dropdown-link">AMC (Annual Maintenance Contracts)</Link>
            </div>
          </div>

          <div className="nav-item-dropdown">
            <span className="nav-link flex items-center gap-1">
              <Sun size={16} className="text-secondary" style={{ marginRight: '4px' }} />
              Solar EPC <ChevronDown size={14} />
            </span>
            <div className="dropdown-menu">
              <Link href="/solar-epc" className="dropdown-link">Solar EPC Services</Link>
              <Link href="/solar-roi" className="dropdown-link">ROI Calculator</Link>
            </div>
          </div>

          <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>Blog</Link>
          <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </nav>

        {/* Auth CTA & Theme Toggle */}
        <div className="header-cta" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-button" 
                onClick={() => setDropdownOpen(prev => ({ ...prev, user: !prev.user }))}
              >
                <User size={18} />
                {user.name}
                <ChevronDown size={14} />
              </button>
              {dropdownOpen.user && (
                <div className="user-dropdown">
                  <Link 
                    href={user.isAdmin ? '/admin/dashboard' : user.isEmployee ? '/employee/dashboard' : '/dashboard'} 
                    className="user-dropdown-link"
                    onClick={() => setDropdownOpen(prev => ({ ...prev, user: false }))}
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="user-dropdown-link logout-btn">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background 0.2s',
            }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} style={{ color: '#F59E0B' }} />}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="mobile-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link href="/" className="mobile-link" onClick={toggleMobileMenu}>Home</Link>
          <Link href="/about" className="mobile-link" onClick={toggleMobileMenu}>About Us</Link>
          <Link href="/scales" className="mobile-link" onClick={toggleMobileMenu}>Industrial Scales & Weighbridges</Link>
          <Link href="/automation" className="mobile-link" onClick={toggleMobileMenu}>Automation</Link>
          <Link href="/amc" className="mobile-link" onClick={toggleMobileMenu}>AMC Services</Link>
          <Link href="/solar-epc" className="mobile-link" onClick={toggleMobileMenu}>Solar EPC</Link>
          <Link href="/solar-roi" className="mobile-link" onClick={toggleMobileMenu}>Solar ROI Calculator</Link>
          <Link href="/blog" className="mobile-link" onClick={toggleMobileMenu}>Blog</Link>
          <Link href="/contact" className="mobile-link" onClick={toggleMobileMenu}>Contact</Link>
          <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
          
          <button 
            onClick={() => { toggleTheme(); toggleMobileMenu(); }} 
            className="mobile-link"
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {theme === 'light' ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} style={{ color: '#F59E0B' }} /> Light Mode</>}
          </button>
          
          <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
          
          {user ? (
            <>
              <div style={{ padding: '8px 12px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{user.name}</div>
              <Link 
                href={user.isAdmin ? '/admin/dashboard' : user.isEmployee ? '/employee/dashboard' : '/dashboard'} 
                className="mobile-link" 
                onClick={toggleMobileMenu}
              >
                Dashboard
              </Link>
              <button 
                className="mobile-link" 
                onClick={() => { handleLogout(); toggleMobileMenu(); }}
                style={{ width: '100%', textAlign: 'left', color: '#dc2626' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mobile-link" onClick={toggleMobileMenu}>Login</Link>
              <Link href="/signup" className="btn btn-primary justify-center" onClick={toggleMobileMenu}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
