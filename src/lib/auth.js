import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fh4h3h2ho09up[;@5#7&h8!hd3467u';

/**
 * Encodes a payload into a JWT using HS256
 */
export function signJwt(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64UrlPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64UrlHeader}.${base64UrlPayload}`)
    .digest('base64url');
    
  return `${base64UrlHeader}.${base64UrlPayload}.${signature}`;
}

/**
 * Decodes and verifies a JWT token
 */
export function verifyJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    
    // Validate expiration
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      return null;
    }
    
    return decodedPayload;
  } catch (e) {
    return null;
  }
}

/**
 * Authenticates a standard Request object inside Next.js routes
 */
export function authenticateRequest(req) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  return verifyJwt(token);
}
