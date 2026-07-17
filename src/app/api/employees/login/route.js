import { NextResponse } from 'next/server';
import { queryOne, verifyPassword } from '@/lib/db';
import { signJwt } from '@/lib/auth';

export async function POST(req) {
  try {
    const input = await req.json();
    const email = input.email || '';
    const password = input.password || '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const emp = await queryOne("SELECT * FROM employees WHERE email = ? AND isActive = 1", [email]);

    if (!emp || !verifyPassword(password, emp.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload = {
      employeeId: emp.id,
      email: emp.email,
      isEmployee: true,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    };

    const token = signJwt(payload);

    return NextResponse.json({
      token,
      employee: {
        id: emp.id,
        email: emp.email,
        name: emp.name,
        department: emp.department,
        isEmployee: true
      }
    });

  } catch (error) {
    console.error('Employee login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
