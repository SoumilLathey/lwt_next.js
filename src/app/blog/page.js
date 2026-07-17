import { query } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogListingClient from '@/components/BlogListingClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Expert Scale Calibration & Solar EPC Insights | LWT Blog',
  description: 'Browse professional guides, technical articles, and industry insights on solar ROI, net metering, weighbridge calibration, and industrial weighing scales.'
};

export default async function BlogPage() {
  let blogs = [];
  try {
    blogs = await query(`
      SELECT b.id, b.title, b.slug, b.summary, b.publishedAt, b.updatedAt,
             e.name as authorName
      FROM blogs b
      LEFT JOIN employees e ON b.authorId = e.id
      ORDER BY b.publishedAt DESC
    `);
  } catch (err) {
    console.error('Error fetching blogs in Server Component:', err);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <Header />
      
      {/* Blog Hero Banner */}
      <section style={{ 
        padding: '140px 24px 80px', 
        background: 'var(--banner-bg)', 
        borderBottom: '1px solid var(--surface-border)', 
        textAlign: 'center' 
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            letterSpacing: '2.5px', 
            textTransform: 'uppercase', 
            color: 'var(--color-secondary)',
            display: 'inline-block',
            marginBottom: '16px',
            background: 'rgba(245,158,11,0.08)',
            padding: '6px 14px',
            borderRadius: '100px',
            border: '1px solid rgba(245,158,11,0.12)'
          }}>
            LWT Knowledge Hub
          </span>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 900, 
            color: 'var(--heading-color)', 
            fontFamily: 'Outfit, sans-serif', 
            margin: '0 0 16px',
            lineHeight: '1.2'
          }}>
            Technical Guides &amp; Insights
          </h1>
          <p style={{ 
            fontSize: '17px', 
            color: 'var(--text-muted)', 
            lineHeight: '1.6',
            margin: 0
          }}>
            Expert analysis on weighing technology, calibration standards, solar power efficiency, and commercial ROI metrics.
          </p>
        </div>
      </section>

      {/* Main Blog Contents */}
      <section style={{ flexGrow: 1, padding: '60px 24px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <BlogListingClient initialBlogs={blogs} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
