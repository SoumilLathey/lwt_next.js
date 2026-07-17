import { NextResponse } from 'next/server';
import { queryOne, execute, hashPassword } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/setup-admin
 * Emergency route to reset admin account passwords from bcrypt (PHP era)
 * to PBKDF2 (current Next.js format).
 * 
 * Requires a secret key passed in the request body to prevent abuse.
 * 
 * Body: { secret: "...", email: "admin@lwt.com", newPassword: "..." }
 */
export async function POST(req) {
  try {
    const SETUP_SECRET = process.env.SETUP_SECRET || 'lwt-setup-2024-change-me';

    const input = await req.json();
    const { secret, email, newPassword } = input;

    if (!secret || secret !== SETUP_SECRET) {
      return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 });
    }

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'email and newPassword are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const user = await queryOne("SELECT id, email, isAdmin FROM users WHERE email = ?", [email]);

    if (!user) {
      return NextResponse.json({ error: `User not found: ${email}` }, { status: 404 });
    }

    const hashed = hashPassword(newPassword);
    await execute(
      "UPDATE users SET password = ?, isAdmin = 1, isVerified = 1 WHERE id = ?",
      [hashed, user.id]
    );

    return NextResponse.json({
      success: true,
      message: `Password reset successfully for ${email}. You can now login with the new password.`,
      userId: user.id
    });

  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}

/**
 * GET /api/setup-admin
 * Check database connectivity and show current admin accounts (masked).
 */
export async function GET(req) {
  try {
    const SETUP_SECRET = process.env.SETUP_SECRET || 'lwt-setup-2024-change-me';
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');

    if (!secret || secret !== SETUP_SECRET) {
      return NextResponse.json({ error: 'Pass ?secret=YOUR_SETUP_SECRET in query string' }, { status: 403 });
    }

    const admins = await queryOne("SELECT COUNT(*) as count FROM users WHERE isAdmin = 1");
    const allAdmins = await import('@/lib/db').then(m => m.query("SELECT id, email, name, isVerified, isAdmin, SUBSTR(password, 1, 4) as hashPrefix FROM users WHERE isAdmin = 1"));

    return NextResponse.json({
      status: 'Database connected successfully',
      adminCount: admins?.count || 0,
      admins: allAdmins.map(a => ({
        id: a.id,
        email: a.email,
        name: a.name,
        isVerified: a.isVerified,
        isAdmin: a.isAdmin,
        passwordFormat: a.hashPrefix?.startsWith('$2') ? 'bcrypt (PHP - needs reset)' : 'PBKDF2 (current - OK)'
      }))
    });

  } catch (error) {
    console.error('Setup admin GET error:', error);
    return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
  }
}
