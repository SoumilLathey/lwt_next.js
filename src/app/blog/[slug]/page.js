import { queryOne } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, BookOpen, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

// 1. Dynamic Metadata Generation for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const blog = await queryOne("SELECT title, summary, metaTitle, metaDescription FROM blogs WHERE slug = ?", [slug]);
    if (!blog) {
      return {
        title: 'Article Not Found | LWT Blog',
        description: 'The requested technical guide or article could not be found.'
      };
    }
    return {
      title: `${blog.metaTitle || blog.title} | LWT Blog`,
      description: blog.metaDescription || blog.summary
    };
  } catch (err) {
    console.error('Metadata error for blog slug:', slug, err);
    return {
      title: 'Technical Guide | LWT Blog'
    };
  }
}

// 2. Server Component Page Render
export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  let blog = null;

  try {
    blog = await queryOne(`
      SELECT b.*, e.name as authorName, e.department as authorDepartment
      FROM blogs b
      LEFT JOIN employees e ON b.authorId = e.id
      WHERE b.slug = ?
    `, [slug]);
  } catch (err) {
    console.error('Database query error on blog detail page:', err);
  }

  // Handle blog not found
  if (!blog) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
        <Header />
        <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px', background: 'var(--surface-1)', padding: '48px', borderRadius: '24px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-md)' }}>
            <BookOpen size={48} style={{ color: '#ef4444', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--heading-color)', fontFamily: 'Outfit, sans-serif', margin: '0 0 12px' }}>Article Not Found</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px', margin: '0 0 28px' }}>
              The blog article or technical guide you are looking for may have been moved, renamed, or deleted by our editorial team.
            </p>
            <Link href="/blog" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
              <ArrowLeft size={16} /> Return to Blog Hub
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Categorize based on keywords
  const getCategory = (item) => {
    const text = (item.title + ' ' + item.summary + ' ' + (item.content || '')).toLowerCase();
    if (text.includes('solar') || text.includes('roi') || text.includes('metering')) {
      return 'Solar EPC';
    }
    if (text.includes('weighbridge') || text.includes('scale') || text.includes('calibration')) {
      return 'Industrial Weighing';
    }
    return 'Maintenance & AMC';
  };

  const cat = getCategory(blog);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      
      {/* Blog Article Banner Header */}
      <section style={{ 
        padding: '140px 24px 80px', 
        background: 'var(--banner-bg)', 
        borderBottom: '1px solid var(--surface-border)'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '24px' }}>
            <ArrowLeft size={14} /> Back to Hub Directory
          </Link>
          
          <div style={{ marginBottom: '16px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              letterSpacing: '1px', 
              textTransform: 'uppercase', 
              color: cat === 'Solar EPC' ? '#f59e0b' : (cat === 'Industrial Weighing' ? 'var(--color-primary)' : 'var(--color-secondary)'),
              background: cat === 'Solar EPC' ? 'rgba(245,158,11,0.08)' : (cat === 'Industrial Weighing' ? 'rgba(36,82,143,0.08)' : 'rgba(16,185,129,0.08)'),
              padding: '4px 12px', 
              borderRadius: '100px',
              border: '1px solid currentColor'
            }}>
              {cat}
            </span>
          </div>

          <h1 style={{ 
            fontSize: '40px', 
            fontWeight: 900, 
            color: 'var(--heading-color)', 
            fontFamily: 'Outfit, sans-serif', 
            margin: '0 0 24px',
            lineHeight: '1.25',
            letterSpacing: '-0.5px'
          }}>
            {blog.title}
          </h1>

          {/* Metadata Block */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px', 
            flexWrap: 'wrap',
            paddingTop: '20px',
            borderTop: '1px solid var(--surface-border-mid)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 800, fontSize: '16px' }}>
                {blog.authorName ? blog.authorName.charAt(0) : 'L'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--heading-color)' }}>
                  Written by {blog.authorName || 'LWT Team'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Editorial Department
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <Calendar size={14} />
              <span>Published: {new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              <span>5 min read</span>
            </div>
          </div>

        </div>
      </section>

      {/* Article Typography Body */}
      <section style={{ flexGrow: 1, padding: '60px 24px 120px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Summary / Sub-lead */}
          <p style={{ 
            fontSize: '18px', 
            fontWeight: 500, 
            color: 'var(--heading-color)', 
            lineHeight: '1.6', 
            borderLeft: '4px solid var(--color-primary)', 
            paddingLeft: '20px',
            margin: '0 0 40px' 
          }}>
            {blog.summary}
          </p>

          {/* Main Content Body */}
          <div style={{ 
            fontSize: '16px', 
            color: 'var(--text-main)', 
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap'
          }}>
            {blog.content}
          </div>

          {/* Footer Navigation */}
          <div style={{ 
            marginTop: '60px',
            paddingTop: '32px',
            borderTop: '1px solid var(--surface-border-mid)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Return to Blog Directory
            </Link>
            
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} Lathey Weigh Trix. All rights reserved.
            </span>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
