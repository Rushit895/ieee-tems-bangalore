const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// ── Storage engine ──────────────────────────────────────────────────────
// Cloudinary (persistent) when configured; otherwise local disk (dev only).
let storage;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      const isVideo = /video\//.test(file.mimetype);
      return {
        folder: 'ieee-tems',
        resource_type: isVideo ? 'video' : 'image',
        public_id: `${file.fieldname}-${Date.now()}`,
      };
    },
  });
  console.log('[UPLOAD] Using Cloudinary storage');
} else {
  storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/'),
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  console.log('[UPLOAD] Using local disk storage (set CLOUDINARY_* env vars for cloud storage)');
}

// ── File type validation — images AND videos ────────────────────────────
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetypes = /image\/(jpeg|jpg|png|gif|webp)|video\/(mp4|webm|quicktime)/;
  const mimetype = mimetypes.test(file.mimetype);

  console.log(`[UPLOAD] File received: ${file.originalname} | mimetype: ${file.mimetype} | extname: ${path.extname(file.originalname)}`);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: jpg, png, gif, webp, mp4, webm, mov`));
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // 50MB (videos need more space)
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// ── Helper: value to persist for an uploaded file ───────────────────────
// Cloudinary → absolute secure URL (host-independent, works everywhere).
// Disk       → bare filename (legacy convention; resolved client-side via UPLOADS_BASE).
function fileValue(file) {
  if (!file) return '';
  if (file.path && /^https?:\/\//.test(file.path)) return file.path; // Cloudinary secure_url
  return file.filename;
}

// Like fileValue, but disk paths are returned as "/uploads/<name>"
// (matches the home-content / gallery convention resolved via BACKEND_BASE).
function fileValueRooted(file) {
  if (!file) return '';
  if (file.path && /^https?:\/\//.test(file.path)) return file.path; // Cloudinary secure_url
  return `/uploads/${file.filename}`;
}

module.exports = upload;
module.exports.fileValue = fileValue;
module.exports.fileValueRooted = fileValueRooted;
