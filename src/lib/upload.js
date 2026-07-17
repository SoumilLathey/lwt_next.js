/**
 * upload.js — Central file upload utility
 *
 * Priority order:
 *  1. Vercel Blob   (set BLOB_READ_WRITE_TOKEN in Vercel env)
 *  2. Cloudinary    (set CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET)
 *  3. Local /tmp    (dev fallback — ephemeral, served via /api/uploads/[file])
 */

import path from 'path';

export async function saveUploadedFile(file, prefix = 'upload') {
  if (!file || typeof file === 'string') return null;

  try {
    const ext = path.extname(file.name || '').toLowerCase() || '.png';
    const filename = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;

    // ── 1. Vercel Blob ────────────────────────────────────────────────────────
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(filename, file, { access: 'public' });
      return blob.url;
    }

    // ── 2. Cloudinary (unsigned upload, no SDK needed) ────────────────────────
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('public_id', filename.replace(ext, '')); // strip ext, Cloudinary adds it

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error('Cloudinary upload error:', err);
        return null;
      }

      const data = await res.json();
      return data.secure_url; // CDN URL, always accessible
    }

    // ── 3. Catbox.moe (Free anonymous permanent file hosting) ─────────────────
    try {
      const catboxForm = new FormData();
      catboxForm.append('reqtype', 'fileupload');
      catboxForm.append('fileToUpload', file);

      const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: catboxForm,
        signal: AbortSignal.timeout(12000) // 12 seconds timeout
      });

      if (res.ok) {
        const urlStr = await res.text();
        if (urlStr && urlStr.startsWith('https://')) {
          console.log('Successfully uploaded to Catbox:', urlStr.trim());
          return urlStr.trim();
        }
      }
    } catch (catboxErr) {
      console.warn('Catbox upload failed, trying Tmpfiles.org:', catboxErr.message);
    }

    // ── 4. Tmpfiles.org (Free anonymous temporary file hosting) ───────────────
    try {
      const tmpfilesForm = new FormData();
      tmpfilesForm.append('file', file);

      const res = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: tmpfilesForm,
        signal: AbortSignal.timeout(12000) // 12 seconds timeout
      });

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data && json.data.url) {
          const directUrl = json.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
          console.log('Successfully uploaded to Tmpfiles:', directUrl);
          return directUrl;
        }
      }
    } catch (tmpfilesErr) {
      console.warn('Tmpfiles upload failed, falling back to local FS:', tmpfilesErr.message);
    }

    // ── 5. Local filesystem (dev only fallback) ──────────────────────────────
    const { default: fs } = await import('fs');
    const { default: pathModule } = await import('path');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = pathModule.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    fs.writeFileSync(pathModule.join(uploadDir, filename), buffer);
    return `/uploads/${filename}`;

  } catch (err) {
    console.error('saveUploadedFile error:', err);
    return null;
  }
}
