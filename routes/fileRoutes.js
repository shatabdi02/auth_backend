const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed'));
        }
    }
});

// Upload file
router.post('/upload', 
    authMiddleware,
    upload.single('file'),
    [
        body('file').custom((value, { req }) => {
            if (!req.file) {
                throw new Error('File is required');
            }
            return true;
        })
    ],
    fileController.uploadFile
);

// Get all files for user
router.get('/', authMiddleware, fileController.getUserFiles);

// Delete file
router.delete('/:id', authMiddleware, fileController.deleteFile);

module.exports = router;
