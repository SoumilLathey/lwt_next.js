import { NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// Get all projects (Admin)
export async function GET(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const projects = await query(`
      SELECT p.*, u.name as creatorName 
      FROM projects p 
      JOIN users u ON p.createdBy = u.id 
      ORDER BY p.createdAt DESC
    `);

    for (const p of projects) {
      p.teamMembers = await query(`
        SELECT e.id, e.name, e.email, e.department, ptm.role, ptm.assignedAt
        FROM project_team_members ptm
        JOIN employees e ON ptm.employeeId = e.id
        WHERE ptm.projectId = ?
        ORDER BY ptm.assignedAt ASC
      `, [p.id]) || [];

      p.images = await query(`
        SELECT pi.*, e.name as uploaderName
        FROM project_images pi
        JOIN employees e ON pi.uploadedBy = e.id
        WHERE pi.projectId = ?
        ORDER BY pi.dayNumber ASC, pi.createdAt DESC
      `, [p.id]) || [];
    }

    return NextResponse.json(projects);

  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// Create new project (Admin)
export async function POST(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const input = await req.json();
    const name = input.name || '';
    const description = input.description || '';
    const startDate = input.startDate || null;
    const endDate = input.endDate || null;
    const employeeIds = input.employeeIds || [];

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    const result = await execute(
      "INSERT INTO projects (name, description, createdBy, startDate, endDate) VALUES (?, ?, ?, ?, ?)",
      [name, description, user.userId, startDate, endDate]
    );
    const projectId = result.lastInsertRowid;

    // Team assignment
    if (Array.isArray(employeeIds) && employeeIds.length > 0) {
      const assignStmt = "INSERT OR IGNORE INTO project_team_members (projectId, employeeId) VALUES (?, ?)";
      for (const eid of employeeIds) {
        // Validate employee exists
        const empExists = await queryOne("SELECT id FROM employees WHERE id = ?", [eid]);
        if (empExists) {
          await execute(assignStmt, [projectId, eid]);
        }
      }
    }

    return NextResponse.json({
      message: 'Project created successfully',
      projectId
    }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
