import { NextResponse } from 'next/server';
import { queryOne, execute, verifyPassword } from '@/lib/db';
import { signJwt } from '@/lib/auth';

export async function POST(req) {
  try {
    const input = await req.json();
    const email = input.email || '';
    const password = input.password || '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await queryOne("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check account verification
    const allowedEmails = ['admin@lwt.com', 'soumil.lathey@gmail.com'];
    if (user.isVerified !== 1 && !allowedEmails.includes(user.email)) {
      return NextResponse.json({ error: 'Account pending verification by admin' }, { status: 403 });
    }

    // Auto-promote admin email
    let isAdmin = user.isAdmin;
    if (user.email === 'soumil.lathey@gmail.com' && user.isAdmin !== 1) {
      await execute("UPDATE users SET isAdmin = 1 WHERE id = ?", [user.id]);
      isAdmin = 1;
    }

    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: isAdmin,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };

    const token = signJwt(payload);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: isAdmin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
