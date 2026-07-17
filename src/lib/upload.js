/**
 * upload.js — Central file upload utility
 *
 * On Vercel: uses @vercel/blob (requires BLOB_READ_WRITE_TOKEN env var)
 * Local dev fallback: writes to public/uploads/ via filesystem
 */

import path from 'path';

/**
 * Saves an uploaded File object and returns the public URL.
 * @param {File} file  - The File object from formData.get('field')
 * @param {string} prefix - Filename prefix (e.g. 'employee', 'complaint-action')
 * @returns {Promise<string|null>} Public URL or null on failure
 */
export async function saveUploadedFile(file, prefix = 'upload') {
  if (!file || typeof file === 'string') return null;

  try {
    const ext = path.extname(file.name || '') || '.png';
    const filename = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;

    // ── Vercel Blob (production) ──────────────────────────────────────────────
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(filename, file, { access: 'public' });
      return blob.url;
    }

    // ── Local filesystem fallback (dev only) ──────────────────────────────────
    const { default: fs } = await import('fs');
    const { default: pathModule } = await import('path');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = pathModule.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = pathModule.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;

  } catch (err) {
    console.error('saveUploadedFile error:', err);
    return null;
  }
}
