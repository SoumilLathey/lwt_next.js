import { NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Helper to save files to public/uploads
async function saveUploadedFile(file, prefix = 'upload') {
  if (!file || typeof file === 'string') return null;
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const ext = path.extname(file.name) || '.png';
    const filename = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error("Employee File Upload save failed:", err);
    return null;
  }
}

// GET handler
export async function GET(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isEmployee) {
      return NextResponse.json({ error: 'Employee access required' }, { status: 403 });
    }

    const { slug } = await params;
    const resource = slug[0];
    const subAction = slug[1];

    // 1. GET /api/employees/complaints
    if (resource === 'complaints' && !subAction) {
      const complaints = await query(`
        SELECT c.*, u.name as userName, u.email as userEmail, u.phone as userPhone
        FROM complaints c
        JOIN users u ON c.userId = u.id
        WHERE c.assignedTo = ? 
        ORDER BY c.createdAt DESC
      `, [user.employeeId]);

      for (const c of complaints) {
        c.images = await query("SELECT * FROM complaint_images WHERE complaintId = ? ORDER BY createdAt DESC", [c.id]) || [];
        c.visitSchedule = await queryOne("SELECT * FROM visit_schedules WHERE complaintId = ?", [c.id]) || null;
      }
      return NextResponse.json(complaints);
    }

    // 2. GET /api/employees/enquiries
    if (resource === 'enquiries' && !subAction) {
      const enquiries = await query(`
        SELECT * FROM enquiries 
        WHERE assignedTo = ? 
        ORDER BY createdAt DESC
      `, [user.employeeId]);

      for (const e of enquiries) {
        e.images = await query("SELECT * FROM enquiry_images WHERE enquiryId = ? ORDER BY createdAt DESC", [e.id]) || [];
        e.visitSchedule = await queryOne("SELECT * FROM visit_schedules WHERE enquiryId = ?", [e.id]) || null;
      }
      return NextResponse.json(enquiries);
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 });

  } catch (error) {
    console.error("Employee GET Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST handler
export async function POST(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isEmployee) {
      return NextResponse.json({ error: 'Employee access required' }, { status: 403 });
    }

    const { slug } = await params;
    const resource = slug[0];
    const subAction = slug[1]; // id
    const action = slug[2];

    const targetId = parseInt(subAction, 10);
    if (isNaN(targetId)) {
      return NextResponse.json({ error: 'Invalid Target ID' }, { status: 400 });
    }

    // 1. POST /api/employees/complaints/:id/images (Upload Action Photo)
    if (resource === 'complaints' && action === 'images') {
      // Validate assignment
      const assigned = await queryOne("SELECT id FROM complaints WHERE id = ? AND assignedTo = ?", [targetId, user.employeeId]);
      if (!assigned) {
        return NextResponse.json({ error: 'Not assigned to this complaint' }, { status: 403 });
      }

      const formData = await req.formData();
      const imageFile = formData.get('image');
      const type = formData.get('type') || 'action_photo';
      const description = formData.get('description') || '';

      if (!imageFile) {
        return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
      }

      const imagePath = await saveUploadedFile(imageFile, 'complaint-action');
      if (!imagePath) {
        return NextResponse.json({ error: 'Failed to save upload' }, { status: 500 });
      }

      await execute(
        "INSERT INTO complaint_images (complaintId, imageType, imagePath, uploadedBy, description) VALUES (?, ?, ?, ?, ?)",
        [targetId, type, imagePath, user.employeeId, description]
      );

      return NextResponse.json({ message: 'Complaint image uploaded successfully', imagePath }, { status: 201 });
    }

    // 2. POST /api/employees/enquiries/:id/images (Upload Enquiry Photo)
    if (resource === 'enquiries' && action === 'images') {
      const assigned = await queryOne("SELECT id FROM enquiries WHERE id = ? AND assignedTo = ?", [targetId, user.employeeId]);
      if (!assigned) {
        return NextResponse.json({ error: 'Not assigned to this enquiry' }, { status: 403 });
      }

      const formData = await req.formData();
      const imageFile = formData.get('image');
      const description = formData.get('description') || 'Enquiry interaction photo';

      if (!imageFile) {
        return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
      }

      const imagePath = await saveUploadedFile(imageFile, 'enquiry-action');
      if (!imagePath) {
        return NextResponse.json({ error: 'Failed to save upload' }, { status: 500 });
      }

      await execute(
        "INSERT INTO enquiry_images (enquiryId, imageType, imagePath, uploadedBy) VALUES (?, ?, ?, ?)",
        [targetId, description, imagePath, user.employeeId]
      );

      return NextResponse.json({ message: 'Enquiry image uploaded successfully', imagePath }, { status: 201 });
    }

    // 3. POST /api/employees/complaints/:id/schedule (Schedule Visit)
    if (resource === 'complaints' && action === 'schedule') {
      const input = await req.json();
      const { scheduledDate, scheduledTime, notes } = input;

      if (!scheduledDate || !scheduledTime) {
        return NextResponse.json({ error: 'Scheduled date and time are required' }, { status: 400 });
      }

      const existingSchedule = await queryOne("SELECT id FROM visit_schedules WHERE complaintId = ?", [targetId]);
      if (existingSchedule) {
        await execute(
          "UPDATE visit_schedules SET scheduledDate = ?, scheduledTime = ?, notes = ?, status = 'Scheduled' WHERE complaintId = ?",
          [scheduledDate, scheduledTime, notes || '', targetId]
        );
      } else {
        await execute(
          "INSERT INTO visit_schedules (complaintId, employeeId, scheduledDate, scheduledTime, notes, status) VALUES (?, ?, ?, ?, ?, 'Scheduled')",
          [targetId, user.employeeId, scheduledDate, scheduledTime, notes || '']
        );
      }

      return NextResponse.json({ message: 'Visit scheduled successfully' });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 });

  } catch (error) {
    console.error("Employee POST Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH handler (Update Status)
export async function PATCH(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isEmployee) {
      return NextResponse.json({ error: 'Employee access required' }, { status: 403 });
    }

    const { slug } = await params;
    const resource = slug[0];
    const subAction = slug[1]; // id
    const action = slug[2]; // status

    const targetId = parseInt(subAction, 10);
    if (isNaN(targetId)) {
      return NextResponse.json({ error: 'Invalid Target ID' }, { status: 400 });
    }

    // 1. PATCH /api/employees/complaints/:id/status
    if (resource === 'complaints' && action === 'status') {
      const input = await req.json();
      const status = input.status || '';

      if (!status) {
        return NextResponse.json({ error: 'Status is required' }, { status: 400 });
      }

      // If status is 'Resolved', verify client OTP
      if (status === 'Resolved') {
        const otp = input.otp || '';
        if (!otp) {
          return NextResponse.json({ error: 'OTP is required for closure' }, { status: 400 });
        }

        const complaint = await queryOne("SELECT closureOtp FROM complaints WHERE id = ?", [targetId]);
        if (!complaint || String(complaint.closureOtp) !== String(otp)) {
          return NextResponse.json({ error: 'Invalid OTP. Complaint cannot be closed.' }, { status: 400 });
        }
      }

      await execute("UPDATE complaints SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [status, targetId]);
      return NextResponse.json({ message: 'Complaint status updated' });
    }

    // 2. PATCH /api/employees/enquiries/:id/status
    if (resource === 'enquiries' && action === 'status') {
      const input = await req.json();
      const status = input.status || '';

      if (!status) {
        return NextResponse.json({ error: 'Status is required' }, { status: 400 });
      }

      await execute("UPDATE enquiries SET status = ? WHERE id = ?", [status, targetId]);
      return NextResponse.json({ message: 'Enquiry status updated' });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 });

  } catch (error) {
    console.error("Employee PATCH Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
