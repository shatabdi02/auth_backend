const { validationResult } = require('express-validator');
const User = require('../models/userModel');

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email } = req.body;
        const userId = req.user.id;

        // Check if email is already taken by another user
        const emailExists = await User.emailExists(email, userId);
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use by another account'
            });
        }

        // Update user
        const updated = await User.update(userId, { name, email });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch updated user data
        const updatedUser = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};
