import { NextResponse } from 'next/server';
import { queryOne, execute, hashPassword } from '@/lib/db';

export async function POST(req) {
  try {
    const input = await req.json();
    const email = input.email || '';
    const password = input.password || '';
    const name = input.name || '';
    const phone = input.phone || '';
    const address = input.address || '';
    const pincode = input.pincode || '';

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    // Check existing
    const existing = await queryOne("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);
    
    const result = await execute(
      "INSERT INTO users (email, password, name, phone, address, pincode, isVerified) VALUES (?, ?, ?, ?, ?, ?, 0)",
      [email, hashedPassword, name, phone, address, pincode]
    );

    return NextResponse.json({
      message: 'User created successfully',
      userId: result.lastInsertRowid
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
