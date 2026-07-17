import { NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || user.isEmployee) {
      return NextResponse.json({ error: 'Unauthorized user access' }, { status: 401 });
    }

    const profile = await queryOne("SELECT id, email, name, phone, address, pincode, createdAt FROM users WHERE id = ?", [user.userId]);
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Failed to load profile details' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || user.isEmployee) {
      return NextResponse.json({ error: 'Unauthorized user access' }, { status: 401 });
    }

    const input = await req.json();
    await execute(
      "UPDATE users SET name = ?, phone = ?, address = ?, pincode = ? WHERE id = ?",
      [
        input.name || '',
        input.phone || '',
        input.address || '',
        input.pincode || '',
        user.userId
      ]
    );

    return NextResponse.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
