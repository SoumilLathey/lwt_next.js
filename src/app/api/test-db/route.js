import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const host = process.env.DB_HOST || 'not set';
  const port = process.env.DB_PORT || 'not set';
  const user = process.env.DB_USER || 'not set';
  const database = process.env.DB_NAME || 'not set';
  const password = process.env.DB_PASSWORD || 'not set';

  const maskedPassword = password !== 'not set' 
    ? `${password.substring(0, 2)}...(${password.length} chars)` 
    : 'not set';

  const info = {
    host,
    port,
    user,
    database,
    password: maskedPassword,
    envCount: Object.keys(process.env).length
  };

  try {
    const mysql = await import('mysql2/promise');
    
    // Attempt a direct 5-second timeout connection to MySQL
    const connection = await mysql.createConnection({
      host: host.trim(),
      port: parseInt(port.trim() || '3306'),
      user: user.trim(),
      password: password.trim(),
      database: database.trim(),
      connectTimeout: 5000
    });

    const [rows] = await connection.query("SHOW TABLES");
    await connection.end();

    return NextResponse.json({
      status: 'Connected successfully!',
      info,
      tables: rows
    });
  } catch (err) {
    return NextResponse.json({
      status: 'Connection failed',
      info,
      error: {
        message: err.message,
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        stack: err.stack
      }
    }, { status: 500 });
  }
}
