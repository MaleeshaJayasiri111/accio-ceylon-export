const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'upload-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Also sync copy to client-public and client-admin if exists
    try {
      const publicDest = path.join(__dirname, '../../../client-public/public/reviews', req.file.filename);
      const adminDest = path.join(__dirname, '../../../client-admin/public/reviews', req.file.filename);
      fs.copyFileSync(req.file.path, publicDest);
      fs.copyFileSync(req.file.path, adminDest);
    } catch (copyErr) {
      // Non-critical fallback
    }

    res.json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

module.exports = router;
