import { NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// Helper to check employee authority
async function checkBlogAuthority(req) {
  const user = authenticateRequest(req);
  if (!user || !user.isEmployee) {
    return null;
  }
  const emp = await queryOne("SELECT department, isActive FROM employees WHERE id = ?", [user.employeeId]);
  if (!emp || emp.isActive !== 1 || emp.department !== 'Blog Editorial') {
    return null;
  }
  return user;
}

// 1. GET /api/blogs/[slug] - Publicly fetch details of a single blog by slug
export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const blog = await queryOne(`
      SELECT b.*, e.name as authorName, e.department as authorDepartment
      FROM blogs b
      LEFT JOIN employees e ON b.authorId = e.id
      WHERE b.slug = ?
    `, [slug]);
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Fetch blog detail error:', error);
    return NextResponse.json({ error: 'Failed to retrieve blog post details' }, { status: 500 });
  }
}

// 2. PUT /api/blogs/[slug] - Update a blog post (Blog Editorial employee only)
export async function PUT(req, { params }) {
  try {
    const authorizedUser = await checkBlogAuthority(req);
    if (!authorizedUser) {
      return NextResponse.json({ error: 'Unauthorized: Blog Editorial employee access required' }, { status: 403 });
    }

    const { slug: currentSlug } = await params;
    const blog = await queryOne("SELECT id FROM blogs WHERE slug = ?", [currentSlug]);
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const input = await req.json();
    const title = (input.title || '').trim();
    let newSlug = (input.slug || '').trim().toLowerCase();
    const summary = (input.summary || '').trim();
    const content = (input.content || '').trim();
    const metaTitle = (input.metaTitle || '').trim() || title;
    const metaDescription = (input.metaDescription || '').trim() || summary;

    if (!title || !newSlug || !summary || !content) {
      return NextResponse.json({ error: 'Title, slug, summary, and content are required' }, { status: 400 });
    }

    // Sanitize new slug
    newSlug = newSlug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!newSlug) {
      return NextResponse.json({ error: 'Invalid slug generated' }, { status: 400 });
    }

    // If slug has changed, verify uniqueness of new slug
    if (newSlug !== currentSlug) {
      const existing = await queryOne("SELECT id FROM blogs WHERE slug = ?", [newSlug]);
      if (existing) {
        return NextResponse.json({ error: 'A blog post with this URL slug already exists' }, { status: 400 });
      }
    }

    await execute(`
      UPDATE blogs
      SET title = ?, slug = ?, summary = ?, content = ?, metaTitle = ?, metaDescription = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, newSlug, summary, content, metaTitle, metaDescription, blog.id]);

    return NextResponse.json({
      message: 'Blog post updated successfully',
      slug: newSlug
    });

  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// 3. DELETE /api/blogs/[slug] - Delete a blog post (Blog Editorial employee only)
export async function DELETE(req, { params }) {
  try {
    const authorizedUser = await checkBlogAuthority(req);
    if (!authorizedUser) {
      return NextResponse.json({ error: 'Unauthorized: Blog Editorial employee access required' }, { status: 403 });
    }

    const { slug } = await params;
    const blog = await queryOne("SELECT id FROM blogs WHERE slug = ?", [slug]);
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await execute("DELETE FROM blogs WHERE id = ?", [blog.id]);

    return NextResponse.json({ message: 'Blog post deleted successfully' });

  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
