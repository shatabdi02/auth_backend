const cloudinary = require('../config/cloudinary');
const File = require('../models/fileModel');

// Upload file
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'auth-app-uploads',
            resource_type: 'auto'
        });

        // Save file metadata to database
        const fileData = {
            user_id: req.user.id,
            filename: result.public_id,
            original_name: req.file.originalname,
            file_type: req.file.mimetype,
            file_size: req.file.size,
            cloudinary_url: result.secure_url,
            cloudinary_public_id: result.public_id
        };

        const fileId = await File.create(fileData);

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                id: fileId,
                url: result.secure_url,
                original_name: req.file.originalname,
                file_type: req.file.mimetype,
                file_size: req.file.size
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file'
        });
    }
};

// Get all files for a user
const getUserFiles = async (req, res) => {
    try {
        const files = await File.findByUserId(req.user.id);

        res.status(200).json({
            success: true,
            files
        });
    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching files'
        });
    }
};

// Delete file
const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        // Get file info
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Check if file belongs to user
        if (file.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this file'
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.cloudinary_public_id);

        // Delete from database
        await File.delete(id);

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting file'
        });
    }
};

module.exports = {
    uploadFile,
    getUserFiles,
    deleteFile
};
