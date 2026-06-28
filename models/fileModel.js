const db = require('../config/db');

class File {
    // Create a new file record
    static async create(fileData) {
        const { user_id, filename, original_name, file_type, file_size, cloudinary_url, cloudinary_public_id } = fileData;
        const query = `
            INSERT INTO files (user_id, filename, original_name, file_type, file_size, cloudinary_url, cloudinary_public_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [user_id, filename, original_name, file_type, file_size, cloudinary_url, cloudinary_public_id]);
        return result.insertId;
    }

    // Find all files by user ID
    static async findByUserId(user_id) {
        const query = `
            SELECT id, filename, original_name, file_type, file_size, cloudinary_url, cloudinary_public_id, created_at
            FROM files
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;
        const [rows] = await db.execute(query, [user_id]);
        return rows;
    }

    // Find file by ID
    static async findById(id) {
        const query = `
            SELECT id, user_id, filename, original_name, file_type, file_size, cloudinary_url, cloudinary_public_id, created_at
            FROM files
            WHERE id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    // Delete file by ID
    static async delete(id) {
        const query = `
            DELETE FROM files
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = File;
