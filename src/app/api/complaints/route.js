import { NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || user.isEmployee) {
      return NextResponse.json({ error: 'Unauthorized client access' }, { status: 401 });
    }

    const input = await req.json();
    const subject = input.subject || '';
    const description = input.description || '';

    if (!subject || !description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 });
    }

    const closureOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await execute(
      "INSERT INTO complaints (userId, subject, description, closureOtp) VALUES (?, ?, ?, ?)",
      [user.userId, subject, description, closureOtp]
    );

    return NextResponse.json({
      message: 'Complaint submitted successfully',
      complaintId: result.lastInsertRowid
    }, { status: 201 });

  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || user.isEmployee) {
      return NextResponse.json({ error: 'Unauthorized client access' }, { status: 401 });
    }

    let complaints;
    if (user.isAdmin) {
      // Load all complaints for admin dashboard
      complaints = await query(`
        SELECT c.*, u.name as userName, u.email as userEmail, u.phone as userPhone,
               e.name as assignedEmployeeName, e.id as assignedEmployeeId, 
               e.phone as assignedEmployeePhone, e.photoPath as assignedEmployeePhoto
         FROM complaints c
        JOIN users u ON c.userId = u.id
        LEFT JOIN employees e ON c.assignedTo = e.id
        ORDER BY c.createdAt DESC
      `);
    } else {
      // Load complaints for current user only
      complaints = await query(`
        SELECT c.*, 
               e.name as assignedEmployeeName, 
               e.phone as assignedEmployeePhone, 
               e.photoPath as assignedEmployeePhoto
        FROM complaints c
        LEFT JOIN employees e ON c.assignedTo = e.id
        WHERE c.userId = ? 
        ORDER BY c.createdAt DESC
      `, [user.userId]);
    }

    // Attach visit schedules and images
    for (const c of complaints) {
      c.visitSchedule = await queryOne("SELECT * FROM visit_schedules WHERE complaintId = ?", [c.id]) || null;
      c.images = await query("SELECT * FROM complaint_images WHERE complaintId = ? ORDER BY createdAt DESC", [c.id]) || [];
    }

    return NextResponse.json(complaints);

  } catch (error) {
    console.error('Fetch complaints error:', error);
    return NextResponse.json({ error: 'Failed to load complaints' }, { status: 500 });
  }
}
