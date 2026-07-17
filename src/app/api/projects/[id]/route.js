import { NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const project = await queryOne("SELECT p.*, u.name as creatorName FROM projects p JOIN users u ON p.createdBy = u.id WHERE p.id = ?", [id]);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    project.teamMembers = await query(`
      SELECT e.id, e.name, e.email, e.department, ptm.role, ptm.assignedAt
      FROM project_team_members ptm
      JOIN employees e ON ptm.employeeId = e.id
      WHERE ptm.projectId = ?
      ORDER BY ptm.assignedAt ASC
    `, [id]) || [];

    project.images = await query(`
      SELECT pi.*, e.name as uploaderName
      FROM project_images pi
      JOIN employees e ON pi.uploadedBy = e.id
      WHERE pi.projectId = ?
      ORDER BY pi.dayNumber ASC, pi.createdAt DESC
    `, [id]) || [];

    return NextResponse.json(project);

  } catch (error) {
    console.error('Fetch project error:', error);
    return NextResponse.json({ error: 'Failed to load project details' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const input = await req.json();

    const fields = [];
    const values = [];

    if (input.name !== undefined) {
      fields.push("name = ?");
      values.push(input.name);
    }
    if (input.description !== undefined) {
      fields.push("description = ?");
      values.push(input.description);
    }
    if (input.status !== undefined) {
      fields.push("status = ?");
      values.push(input.status);
    }
    if (input.startDate !== undefined) {
      fields.push("startDate = ?");
      values.push(input.startDate);
    }
    if (input.endDate !== undefined) {
      fields.push("endDate = ?");
      values.push(input.endDate);
    }

    if (fields.length === 0) {
      return NextResponse.json({ message: 'No changes provided' });
    }

    values.push(id);
    const sql = `UPDATE projects SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    
    await execute(sql, values);
    return NextResponse.json({ message: 'Project updated successfully' });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
