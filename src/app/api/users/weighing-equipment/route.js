import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || user.isEmployee) {
      return NextResponse.json({ error: 'Unauthorized user access' }, { status: 401 });
    }

    const equipment = await query("SELECT * FROM weighing_equipment WHERE userId = ? ORDER BY createdAt DESC", [user.userId]);
    return NextResponse.json(equipment);

  } catch (error) {
    console.error('Fetch weighing equipment error:', error);
    return NextResponse.json({ error: 'Failed to load weighing equipment' }, { status: 500 });
  }
}
