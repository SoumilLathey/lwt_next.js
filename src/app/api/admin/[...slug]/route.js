import { NextResponse } from 'next/server';
import { query, queryOne, execute, hashPassword } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/upload';

export async function GET(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { slug } = await params;
    const resource = slug[0];
    const subAction = slug[1];
    const id = slug[2];

    // 1. GET /api/admin/employees
    if (resource === 'employees' && !subAction) {
      const employees = await query("SELECT id, email, name, phone, department, photoPath, isActive, createdAt FROM employees ORDER BY name ASC");
      return NextResponse.json(employees);
    }

    // 2. GET /api/admin/users
    if (resource === 'users' && !subAction) {
      const users = await query("SELECT id, email, name, phone, address, pincode, isAdmin, isVerified, createdAt FROM users WHERE isAdmin = 0 ORDER BY createdAt DESC");
      return NextResponse.json(users);
    }

    // 3. GET /api/admin/admins
    if (resource === 'admins' && !subAction) {
      const admins = await query("SELECT id, email, name, phone, isAdmin, isVerified, createdAt FROM users WHERE isAdmin = 1 ORDER BY name ASC");
      return NextResponse.json(admins);
    }

    // 4. GET /api/admin/solar-installations/user/:userId
    if (resource === 'solar-installations' && subAction === 'user' && id) {
      const installations = await query("SELECT * FROM solar_installations WHERE userId = ? ORDER BY installationDate DESC", [id]);
      return NextResponse.json(installations);
    }

    // 5. GET /api/admin/weighing-equipment/user/:userId
    if (resource === 'weighing-equipment' && subAction === 'user' && id) {
      const equipment = await query("SELECT * FROM weighing_equipment WHERE userId = ? ORDER BY createdAt DESC", [id]);
      return NextResponse.json(equipment);
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 });

  } catch (error) {
    console.error("Admin GET Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST handler
export async function POST(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { slug } = await params;
    const resource = slug[0];
    const subAction = slug[1];
    const id = slug[2];

    // 1. POST /api/admin/employees (Form data with photo)
    if (resource === 'employees' && !subAction) {
      const formData = await req.formData();
      const email = formData.get('email') || '';
      const password = formData.get('password') || '';
      const name = formData.get('name') || '';
      const phone = formData.get('phone') || '';
      const department = formData.get('department') || '';
      const photoFile = formData.get('photo');

      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
      }

      // Check existing
      const existing = await queryOne("SELECT id FROM employees WHERE email = ?", [email]);
      if (existing) {
        return NextResponse.json({ error: 'Employee with this email already exists' }, { status: 400 });
      }

      const photoPath = await saveUploadedFile(photoFile, 'employee');
      const hash = hashPassword(password);

      const result = await execute(
        "INSERT INTO employees (email, password, name, phone, department, photoPath) VALUES (?, ?, ?, ?, ?, ?)",
        [email, hash, name, phone, department, photoPath]
      );

      return NextResponse.json({
        message: 'Employee created successfully',
        employeeId: result.lastInsertRowid
      }, { status: 201 });
    }

    // 2. POST /api/admin/complaints/:id/assign
    if (resource === 'complaints' && subAction && id === 'assign') {
      const complaintId = parseInt(subAction, 10);
      const input = await req.json();
      let employeeId = input.employeeId;

      if (employeeId === 'null' || employeeId === '' || employeeId === null) {
        employeeId = null;
      } else {
        employeeId = parseInt(employeeId, 10);
        // Verify employee exists
        const emp = await queryOne("SELECT id FROM employees WHERE id = ?", [employeeId]);
        if (!emp) {
          return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }
      }

      await execute("UPDATE complaints SET assignedTo = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [employeeId, complaintId]);
      return NextResponse.json({ message: 'Complaint assigned successfully' });
    }

    // 3. POST /api/admin/enquiries/:id/assign
    if (resource === 'enquiries' && subAction && id === 'assign') {
      const enquiryId = parseInt(subAction, 10);
      const input = await req.json();
      let employeeId = input.employeeId;

      if (employeeId === 'null' || employeeId === '' || employeeId === null) {
        employeeId = null;
      } else {
        employeeId = parseInt(employeeId, 10);
        // Verify employee exists
        const emp = await queryOne("SELECT id FROM employees WHERE id = ?", [employeeId]);
        if (!emp) {
          return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }
      }

      await execute("UPDATE enquiries SET assignedTo = ? WHERE id = ?", [employeeId, enquiryId]);
      return NextResponse.json({ message: 'Enquiry assigned successfully' });
    }

    // 4. POST /api/admin/solar-installations
    if (resource === 'solar-installations' && !subAction) {
      const input = await req.json();
      const { userId, capacity, installationDate, address, status } = input;

      if (!userId || !capacity || !installationDate || !address) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const result = await execute(
        "INSERT INTO solar_installations (userId, capacity, installationDate, address, status) VALUES (?, ?, ?, ?, ?)",
        [userId, capacity, installationDate, address, status || 'Active']
      );

      return NextResponse.json({
        message: 'Solar installation added successfully',
        id: result.lastInsertRowid
      }, { status: 201 });
    }

    // 5. POST /api/admin/weighing-equipment
    if (resource === 'weighing-equipment' && !subAction) {
      const input = await req.json();
      const { userId, equipmentType, model, capacity, serialNumber, installationDate, location, status, notes } = input;

      if (!userId || !equipmentType || !model || !capacity) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const result = await execute(
        "INSERT INTO weighing_equipment (userId, equipmentType, model, capacity, serialNumber, installationDate, location, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [userId, equipmentType, model, capacity, serialNumber || '', installationDate || null, location || '', status || 'Active', notes || '']
      );

      return NextResponse.json({
        message: 'Weighing equipment added successfully',
        id: result.lastInsertRowid
      }, { status: 201 });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 });

  } catch (error) {
    console.error("Admin POST Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH handler
export async function PATCH(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { slug } = await params;
    const resource = slug[0];
    const id = parseInt(slug[1], 10);
    const action = slug[2];

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // 1. PATCH /api/admin/users/:id/verify
    if (resource === 'users' && action === 'verify') {
      const input = await req.json();
      const isVerified = input.isVerified ? 1 : 0;
      await execute("UPDATE users SET isVerified = ? WHERE id = ?", [isVerified, id]);
      return NextResponse.json({ message: 'User verification updated', isVerified: !!isVerified });
    }

    // 2. PATCH /api/admin/employees/:id/toggle
    if (resource === 'employees' && action === 'toggle') {
      const emp = await queryOne("SELECT isActive FROM employees WHERE id = ?", [id]);
      if (!emp) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
      const newStatus = emp.isActive ? 0 : 1;
      await execute("UPDATE employees SET isActive = ? WHERE id = ?", [newStatus, id]);
      return NextResponse.json({ message: 'Employee status toggled', isActive: !!newStatus });
    }

    // 3. PATCH /api/admin/users/:id/reset-password
    if (resource === 'users' && action === 'reset-password') {
      const input = await req.json();
      if (!input.password) {
        return NextResponse.json({ error: 'Password required' }, { status: 400 });
      }
      const hash = hashPassword(input.password);
      await execute("UPDATE users SET password = ? WHERE id = ?", [hash, id]);
      return NextResponse.json({ message: 'User password reset successful' });
    }

    // 4. PATCH /api/admin/employees/:id/reset-password
    if (resource === 'employees' && action === 'reset-password') {
      const input = await req.json();
      if (!input.password) {
        return NextResponse.json({ error: 'Password required' }, { status: 400 });
      }
      const hash = hashPassword(input.password);
      await execute("UPDATE employees SET password = ? WHERE id = ?", [hash, id]);
      return NextResponse.json({ message: 'Employee password reset successful' });
    }

    // 5. PATCH /api/admin/employees/:id/photo
    if (resource === 'employees' && action === 'photo') {
      const formData = await req.formData();
      const photoFile = formData.get('photo');
      if (!photoFile) {
        return NextResponse.json({ error: 'Photo file is required' }, { status: 400 });
      }
      const photoPath = await saveUploadedFile(photoFile, 'employee');
      if (!photoPath) {
        return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 });
      }
      await execute("UPDATE employees SET photoPath = ? WHERE id = ?", [photoPath, id]);
      return NextResponse.json({ message: 'Employee photo updated', photoPath });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 });

  } catch (error) {
    console.error("Admin PATCH Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT handler (Update User Profile Details)
export async function PUT(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { slug } = await params;
    const resource = slug[0];
    const id = parseInt(slug[1], 10);

    if (resource === 'users' && id && !isNaN(id)) {
      const input = await req.json();
      await execute(
        "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, pincode = ? WHERE id = ?",
        [input.name, input.email, input.phone, input.address, input.pincode, id]
      );
      input.id = id;
      return NextResponse.json(input);
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 });

  } catch (error) {
    console.error("Admin PUT Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(req, { params }) {
  try {
    const user = authenticateRequest(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { slug } = await params;
    const resource = slug[0];
    const id = parseInt(slug[1], 10);

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // 1. DELETE /api/admin/solar-installations/:id
    if (resource === 'solar-installations') {
      await execute("DELETE FROM solar_installations WHERE id = ?", [id]);
      return NextResponse.json({ message: 'Installation deleted successfully' });
    }

    // 2. DELETE /api/admin/weighing-equipment
    if (resource === 'weighing-equipment') {
      await execute("DELETE FROM weighing_equipment WHERE id = ?", [id]);
      return NextResponse.json({ message: 'Equipment deleted successfully' });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 });

  } catch (error) {
    console.error("Admin DELETE Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
