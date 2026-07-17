import { NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// Public submission or Admin creation
export async function POST(req) {
  try {
    const input = await req.json();
    const name = input.name || '';
    const email = input.email || '';
    const message = input.message || '';
    const phone = input.phone || '';
    const service = input.service || '';

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Try authenticate to see if it's an admin creating this
    const user = authenticateRequest(req);
    let createdBy = null;
    if (user && user.isAdmin) {
      createdBy = user.userId;
    }

    const result = await execute(
      "INSERT INTO enquiries (name, email, phone, service, message, createdBy) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, service, message, createdBy]
    );

    return NextResponse.json({
      message: 'Enquiry submitted successfully',
      enquiryId: result.lastInsertRowid
    }, { status: 201 });

  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}

// Get all enquiries (Admin only)
export async function GET(req) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const enquiries = await query(`
      SELECT e.*, 
             emp.name as assignedEmployeeName, 
             emp.id as assignedEmployeeId,
             emp.phone as assignedEmployeePhone,
             emp.photoPath as assignedEmployeePhoto
      FROM enquiries e
      LEFT JOIN employees emp ON e.assignedTo = emp.id
      ORDER BY e.createdAt DESC
    `);

    for (const enq of enquiries) {
      enq.images = await query("SELECT * FROM enquiry_images WHERE enquiryId = ? ORDER BY createdAt DESC", [enq.id]) || [];
      enq.visitSchedule = await queryOne("SELECT * FROM visit_schedules WHERE enquiryId = ?", [enq.id]) || null;
    }

    return NextResponse.json(enquiries);

  } catch (error) {
    console.error('Fetch enquiries error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}
