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
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

router.post('/', upload.any(), (req, res) => {
  try {
    const uploadedFile = (req.files && req.files.length > 0) ? req.files[0] : req.file;
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No image or file uploaded' });
    }

    const fileUrl = `/uploads/${uploadedFile.filename}`;

    res.json({
      url: fileUrl,
      filename: uploadedFile.filename,
      size: uploadedFile.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process upload: ' + err.message });
  }
});

module.exports = router;
