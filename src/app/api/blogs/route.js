import { NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// 1. GET /api/blogs - Publicly fetch all blog posts
export async function GET(req) {
  try {
    const blogs = await query(`
      SELECT b.id, b.title, b.slug, b.summary, b.publishedAt, b.updatedAt,
             e.name as authorName, e.department as authorDepartment
      FROM blogs b
      LEFT JOIN employees e ON b.authorId = e.id
      ORDER BY b.publishedAt DESC
    `);
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Fetch blogs error:', error);
    return NextResponse.json({ error: 'Failed to retrieve blog posts' }, { status: 500 });
  }
}

// 2. POST /api/blogs - Create a new blog post (Blog Editorial employee only)
export async function POST(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isEmployee) {
      return NextResponse.json({ error: 'Employee access required' }, { status: 403 });
    }

    // Verify employee role/department
    const emp = await queryOne("SELECT department, isActive FROM employees WHERE id = ?", [user.employeeId]);
    if (!emp || emp.isActive !== 1 || emp.department !== 'Blog Editorial') {
      return NextResponse.json({ error: 'Unauthorized: Blog Editorial access required' }, { status: 403 });
    }

    const input = await req.json();
    const title = (input.title || '').trim();
    let slug = (input.slug || '').trim().toLowerCase();
    const summary = (input.summary || '').trim();
    const content = (input.content || '').trim();
    const metaTitle = (input.metaTitle || '').trim() || title;
    const metaDescription = (input.metaDescription || '').trim() || summary;

    if (!title || !slug || !summary || !content) {
      return NextResponse.json({ error: 'Title, slug, summary, and content are required' }, { status: 400 });
    }

    // Sanitize slug
    slug = slug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!slug) {
      return NextResponse.json({ error: 'Invalid slug generated' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await queryOne("SELECT id FROM blogs WHERE slug = ?", [slug]);
    if (existing) {
      return NextResponse.json({ error: 'A blog post with this URL slug already exists' }, { status: 400 });
    }

    const result = await execute(`
      INSERT INTO blogs (title, slug, summary, content, metaTitle, metaDescription, authorId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, slug, summary, content, metaTitle, metaDescription, user.employeeId]);

    return NextResponse.json({
      message: 'Blog post created successfully',
      blogId: result.lastInsertRowid,
      slug
    }, { status: 201 });

  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
