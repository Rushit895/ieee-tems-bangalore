// Backend base URL
// In production (Hostinger): same domain, so empty string = same origin
// In development: set VITE_BACKEND_URL=http://localhost:5000 in .env.development
export const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL ?? '';

// Helper: resolve any upload path to a full URL
export const resolveUpload = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/')) return `${BACKEND_BASE}${path}`;
  return `${BACKEND_BASE}/uploads/${path}`;
};
