import crypto from 'crypto';
import path from 'path';

let dbType = 'sqlite';
let mysqlPool = null;
let sqliteDb = null;
let initPromise = null;

async function getDb() {
  if (initPromise) {
    try {
      await initPromise;
    } catch (e) {
      // initPromise failed — reset so next call can retry
      initPromise = null;
      throw e;
    }
    return;
  }

  initPromise = (async () => {
    if (process.env.DB_HOST) {
      try {
        const mysql = await import('mysql2/promise');
        const host = (process.env.DB_HOST || '').trim();
        const port = (process.env.DB_PORT || '3306').toString().trim();
        const user = (process.env.DB_USER || '').trim();
        const password = (process.env.DB_PASSWORD || '').trim();
        const database = (process.env.DB_NAME || '').trim();

        // Test connectivity with a short timeout BEFORE creating pool
        const testConn = await Promise.race([
          mysql.createConnection({ host, port: parseInt(port), user, password, database, connectTimeout: 5000 }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('MySQL connection timeout after 5s')), 6000))
        ]);
        await testConn.end();

        mysqlPool = mysql.createPool({
          host,
          port: parseInt(port),
          user,
          password,
          database,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 5000,
          ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : undefined
        });
        dbType = 'mysql';
        console.log('Database Engine: MySQL (Remote Hostinger)');
        await initDbSchema();
      } catch (err) {
        console.error('Failed to initialize MySQL, falling back to SQLite:', err.message);
        mysqlPool = null;
        await setupSqlite();
      }
    } else {
      await setupSqlite();
    }
  })();

  // If the init promise itself fails, clear it so future requests can retry
  initPromise = initPromise.catch(err => {
    initPromise = null;
    throw err;
  });

  await initPromise;
}

async function setupSqlite() {
  try {
    const { DatabaseSync } = await import('node:sqlite');
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    sqliteDb = new DatabaseSync(dbPath);
    sqliteDb.exec("PRAGMA foreign_keys = ON;");
    dbType = 'sqlite';
    console.log('Database Engine: SQLite (Local File)');
    await initDbSchema();
  } catch (err) {
    console.error('Failed to initialize SQLite:', err);
    throw err;
  }
}

const execSql = async (sql) => {
  if (dbType === 'mysql') {
    // Translate SQLite dialect to MySQL dialect
    let mysqlSql = sql
      .replace(/AUTOINCREMENT/g, 'AUTO_INCREMENT')
      .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/g, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/isVerified INTEGER DEFAULT 0/g, 'isVerified INT DEFAULT 0')
      .replace(/isAdmin INTEGER DEFAULT 0/g, 'isAdmin INT DEFAULT 0')
      .replace(/isActive INTEGER DEFAULT 1/g, 'isActive INT DEFAULT 1')
      .replace(/userId INTEGER NOT NULL/g, 'userId INT NOT NULL')
      .replace(/assignedTo INTEGER/g, 'assignedTo INT')
      .replace(/createdBy INTEGER/g, 'createdBy INT')
      .replace(/projectId INTEGER NOT NULL/g, 'projectId INT NOT NULL')
      .replace(/employeeId INTEGER NOT NULL/g, 'employeeId INT NOT NULL')
      .replace(/complaintId INTEGER/g, 'complaintId INT')
      .replace(/enquiryId INTEGER/g, 'enquiryId INT')
      .replace(/authorId INTEGER/g, 'authorId INT');
    
    await mysqlPool.query(mysqlSql);
  } else {
    sqliteDb.exec(sql);
  }
};

const initDbSchema = async () => {
  // IMPORTANT: initDbSchema is called from INSIDE the initPromise callback.
  // We MUST NOT call query()/queryOne()/execute() here because those call
  // getDb() which awaits initPromise → circular deadlock → infinite hang.
  // Use raw pool/db directly instead.
  const rawQuery = async (sql, params = []) => {
    if (dbType === 'mysql') {
      const [rows] = await mysqlPool.execute(sql, params);
      return rows;
    } else {
      return sqliteDb.prepare(sql).all(...params);
    }
  };

  const rawExecute = async (sql, params = []) => {
    if (dbType === 'mysql') {
      const normalizedSql = sql.replace(/INSERT OR IGNORE/gi, 'INSERT IGNORE');
      const [result] = await mysqlPool.execute(normalizedSql, params);
      return { lastInsertRowid: result.insertId, changes: result.affectedRows };
    } else {
      const result = sqliteDb.prepare(sql).run(...params);
      return { lastInsertRowid: result.lastInsertRowid, changes: result.changes };
    }
  };

  let isInitialized = false;
  try {
    await rawQuery("SELECT 1 FROM users LIMIT 1");
    await rawQuery("SELECT 1 FROM blogs LIMIT 1");
    isInitialized = true;
  } catch (e) {
    // Table(s) do not exist, needs initialization
  }

  if (isInitialized) return;

  try {
    // 1. Users
    await execSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        pincode VARCHAR(20),
        isAdmin INT DEFAULT 0,
        isVerified INT DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Employees
    await execSql(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        department VARCHAR(100),
        photoPath VARCHAR(255),
        isActive INT DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Complaints
    await execSql(`
      CREATE TABLE IF NOT EXISTS complaints (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        assignedTo INT,
        createdBy INT,
        closureOtp VARCHAR(10),
        closureOtpExpiresAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (assignedTo) REFERENCES employees(id) ON DELETE SET NULL,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 4. Complaint Images
    await execSql(`
      CREATE TABLE IF NOT EXISTS complaint_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        complaintId INT NOT NULL,
        imageType VARCHAR(50) NOT NULL,
        imagePath VARCHAR(255) NOT NULL,
        uploadedBy INT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (complaintId) REFERENCES complaints(id) ON DELETE CASCADE
      )
    `);

    // 5. Enquiries
    await execSql(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        service VARCHAR(100),
        message TEXT NOT NULL,
        assignedTo INT,
        status VARCHAR(50) DEFAULT 'Pending',
        createdBy INT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignedTo) REFERENCES employees(id) ON DELETE SET NULL,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 6. Enquiry Images
    await execSql(`
      CREATE TABLE IF NOT EXISTS enquiry_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        enquiryId INT NOT NULL,
        imageType VARCHAR(50) NOT NULL,
        imagePath VARCHAR(255) NOT NULL,
        uploadedBy INT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (enquiryId) REFERENCES enquiries(id) ON DELETE CASCADE
      )
    `);

    // 7. Projects
    await execSql(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'In Progress',
        createdBy INT NOT NULL,
        startDate DATE,
        endDate DATE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 8. Project Team Members
    await execSql(`
      CREATE TABLE IF NOT EXISTS project_team_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        projectId INT NOT NULL,
        employeeId INT NOT NULL,
        role VARCHAR(100),
        assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
        UNIQUE(projectId, employeeId)
      )
    `);

    // 9. Project Images
    await execSql(`
      CREATE TABLE IF NOT EXISTS project_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        projectId INT NOT NULL,
        uploadedBy INT NOT NULL,
        imagePath VARCHAR(255) NOT NULL,
        dayNumber INT NOT NULL,
        isFinal INT DEFAULT 0,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (uploadedBy) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // 10. Visit Schedules
    await execSql(`
      CREATE TABLE IF NOT EXISTS visit_schedules (
        id INT PRIMARY KEY AUTO_INCREMENT,
        complaintId INT,
        enquiryId INT,
        employeeId INT NOT NULL,
        scheduledDate DATE NOT NULL,
        scheduledTime TIME NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'Scheduled',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (complaintId) REFERENCES complaints(id) ON DELETE CASCADE,
        FOREIGN KEY (enquiryId) REFERENCES enquiries(id) ON DELETE CASCADE,
        FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // 11. Solar Installations
    await execSql(`
      CREATE TABLE IF NOT EXISTS solar_installations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        capacity VARCHAR(100) NOT NULL,
        installationDate DATE NOT NULL,
        address TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 12. Weighing Equipment
    await execSql(`
      CREATE TABLE IF NOT EXISTS weighing_equipment (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        equipmentType VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        capacity VARCHAR(100) NOT NULL,
        serialNumber VARCHAR(100),
        installationDate DATE,
        location VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Active',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 13. Blogs Table
    await execSql(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        metaTitle VARCHAR(255),
        metaDescription TEXT,
        authorId INT,
        publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES employees(id) ON DELETE SET NULL
      )
    `);

    // Seed default administrative users if table is empty
    const countResult = await rawQuery("SELECT COUNT(*) as count FROM users");
    const userCount = countResult[0]?.count ?? 0;
    if (userCount === 0) {
      await rawExecute(
        "INSERT INTO users (email, password, name, phone, isAdmin, isVerified) VALUES (?, ?, ?, ?, ?, ?)",
        ['admin@lwt.com', hashPassword('password123'), 'Admin User', '1234567890', 1, 1]
      );
      await rawExecute(
        "INSERT INTO users (email, password, name, phone, isAdmin, isVerified) VALUES (?, ?, ?, ?, ?, ?)",
        ['soumil.lathey@gmail.com', hashPassword('password123'), 'Soumil Lathey', '1234567890', 1, 1]
      );
      console.log("Default administrative users seeded successfully.");
    }
  } catch (err) {
    console.error("Database schema initialization failed:", err);
  }
};

// Async Query Helpers
export async function query(sql, params = []) {
  await getDb();
  if (dbType === 'mysql') {
    const normalizedSql = sql.replace(/INSERT OR IGNORE/gi, 'INSERT IGNORE');
    const [rows] = await mysqlPool.execute(normalizedSql, params);
    return rows;
  } else {
    const stmt = sqliteDb.prepare(sql);
    return stmt.all(...params);
  }
}

export async function queryOne(sql, params = []) {
  await getDb();
  if (dbType === 'mysql') {
    const normalizedSql = sql.replace(/INSERT OR IGNORE/gi, 'INSERT IGNORE');
    const [rows] = await mysqlPool.execute(normalizedSql, params);
    return rows[0] || null;
  } else {
    const stmt = sqliteDb.prepare(sql);
    return stmt.get(...params);
  }
}

export async function execute(sql, params = []) {
  await getDb();
  if (dbType === 'mysql') {
    const normalizedSql = sql.replace(/INSERT OR IGNORE/gi, 'INSERT IGNORE');
    const [result] = await mysqlPool.execute(normalizedSql, params);
    return {
      lastInsertRowid: result.insertId,
      changes: result.affectedRows
    };
  } else {
    const stmt = sqliteDb.prepare(sql);
    const result = stmt.run(...params);
    return {
      lastInsertRowid: result.lastInsertRowid,
      changes: result.changes
    };
  }
}

// Password verify helper - supports PBKDF2 (current) format only.
// Note: If migrating from PHP bcrypt ($2y$...), those passwords must be
// reset via the admin password-reset utility before they will work here.
export function verifyPassword(password, storedPasswordHash) {
  if (!storedPasswordHash) return false;

  // Detect bcrypt hash format (from PHP password_hash) - cannot verify without bcrypt lib
  if (storedPasswordHash.startsWith('$2')) {
    console.warn('verifyPassword: bcrypt hash detected. Password must be reset via admin panel.');
    return false;
  }

  // PBKDF2 format: "salt:hash"
  if (!storedPasswordHash.includes(':')) return false;
  const [salt, originalHash] = storedPasswordHash.split(':');
  if (!salt || !originalHash) return false;

  try {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
  } catch {
    return false;
  }
}

// Password hash helper (PBKDF2)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}
