const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const authenticateToken = require('../middleware/auth');

// Apply authenticateToken middleware to all routes
router.use(authenticateToken);

// Set up the uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer to store files in the uploads directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });
const fileStore = new Map();

router.post('/pdf', upload.single('pdf'), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const fileId = crypto.randomBytes(16).toString('hex');
  const fileInfo = {
    path: req.file.path,
    originalName: req.file.originalname,
    expiry: null
  };

  fileStore.set(fileId, fileInfo);

  const fileUrl = `http://localhost:${process.env.PORT || 3000}/api/uploads/${req.file.filename}`;
  res.json({ fileUrl, fileId });
});

module.exports = router;