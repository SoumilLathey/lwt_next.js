import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || user.isEmployee) {
      return NextResponse.json({ error: 'Unauthorized user access' }, { status: 401 });
    }

    const installations = await query("SELECT * FROM solar_installations WHERE userId = ? ORDER BY installationDate DESC", [user.userId]);
    return NextResponse.json(installations);

  } catch (error) {
    console.error('Fetch installations error:', error);
    return NextResponse.json({ error: 'Failed to load installations' }, { status: 500 });
  }
}
