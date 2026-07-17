"use client";

import React from 'react';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function BlogListingClient({ initialBlogs }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Categorize blogs based on keywords in title/summary
  const getCategory = (blog) => {
    const text = (blog.title + ' ' + blog.summary + ' ' + (blog.content || '')).toLowerCase();
    if (text.includes('solar') || text.includes('roi') || text.includes('metering') || text.includes('kw')) {
      return 'Solar EPC';
    }
    if (text.includes('weighbridge') || text.includes('scale') || text.includes('calibration') || text.includes('load cell')) {
      return 'Industrial Weighing';
    }
    return 'Maintenance & AMC';
  };

  const filteredBlogs = initialBlogs.filter(blog => {
    return (
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Search Control Only */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: '48px', 
        background: 'var(--surface-1)',
        padding: '24px 32px',
        borderRadius: '20px',
        border: '1px solid var(--surface-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search articles by keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              borderRadius: '12px',
              border: '1.5px solid var(--surface-border-mid)',
              background: 'var(--surface-2)',
              color: 'var(--text-main)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredBlogs.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 24px', 
          border: '2px dashed var(--surface-border-mid)', 
          borderRadius: '24px',
          background: 'var(--surface-1)'
        }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '20px', color: 'var(--heading-color)', fontWeight: 700, margin: '0 0 8px' }}>No Articles Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Try broadening your search term.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
          {filteredBlogs.map((blog) => {
            const cat = getCategory(blog);
            return (
              <article 
                key={blog.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: 'var(--surface-1)', 
                  border: '1px solid var(--surface-border)', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="blog-card"
              >
                {/* Visual Category Header */}
                <div style={{ 
                  padding: '24px 32px 0', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    letterSpacing: '1px', 
                    textTransform: 'uppercase', 
                    color: cat === 'Solar EPC' ? '#f59e0b' : (cat === 'Industrial Weighing' ? 'var(--color-primary)' : 'var(--color-secondary)'),
                    background: cat === 'Solar EPC' ? 'rgba(245,158,11,0.08)' : (cat === 'Industrial Weighing' ? 'rgba(36,82,143,0.08)' : 'rgba(16,185,129,0.08)'),
                    padding: '4px 10px', 
                    borderRadius: '100px',
                    border: '1px solid currentColor'
                  }}>
                    {cat}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span>5 min read</span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '24px 32px 32px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: 800, 
                    color: 'var(--heading-color)', 
                    fontFamily: 'Outfit, sans-serif', 
                    margin: '0 0 12px',
                    lineHeight: '1.4'
                  }}>
                    {blog.title}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--text-muted)', 
                    lineHeight: '1.6',
                    margin: '0 0 24px',
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {blog.summary}
                  </p>

                  <div style={{ 
                    borderTop: '1px solid var(--surface-border-mid)',
                    paddingTop: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {/* Author / Date */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--heading-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} style={{ color: 'var(--color-primary)' }} /> {blog.authorName || 'LWT Team'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} /> {new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Read More Link */}
                    <Link href={`/blog/${blog.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>
                      Read Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Global hover transitions for blog cards */}
      <style jsx global>{`
        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md) !important;
          border-color: var(--color-primary) !important;
        }
      `}</style>
    </div>
  );
}
