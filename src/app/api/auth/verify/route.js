import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const decoded = authenticateRequest(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized or token expired' }, { status: 401 });
    }

    // Check if it's an employee token
    if (decoded.isEmployee) {
      const emp = await queryOne("SELECT id, email, name, department, isActive FROM employees WHERE id = ?", [decoded.employeeId]);
      if (!emp || emp.isActive !== 1) {
        return NextResponse.json({ error: 'Employee account not found or suspended' }, { status: 401 });
      }
      return NextResponse.json({
        user: {
          id: emp.id,
          email: emp.email,
          name: emp.name,
          department: emp.department,
          isEmployee: true
        }
      });
    }

    // User token
    const user = await queryOne("SELECT id, email, name, isAdmin FROM users WHERE id = ?", [decoded.userId]);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
