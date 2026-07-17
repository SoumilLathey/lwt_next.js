import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function POST(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const input = await req.json();
    const employeeIds = input.employeeIds;

    if (!Array.isArray(employeeIds)) {
      return NextResponse.json({ error: 'Invalid employeeIds format' }, { status: 400 });
    }

    // Clear existing assignments
    await execute("DELETE FROM project_team_members WHERE projectId = ?", [id]);

    // Insert new assignments
    const insertStmt = "INSERT INTO project_team_members (projectId, employeeId) VALUES (?, ?)";
    for (const eid of employeeIds) {
      const empExists = await queryOne("SELECT id FROM employees WHERE id = ?", [eid]);
      if (empExists) {
        await execute(insertStmt, [id, eid]);
      }
    }

    return NextResponse.json({ message: 'Team updated successfully' });

  } catch (error) {
    console.error('Assign team error:', error);
    return NextResponse.json({ error: 'Failed to assign team' }, { status: 500 });
  }
}
