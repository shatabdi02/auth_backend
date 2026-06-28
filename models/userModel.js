const db = require('../config/db');

class User {
    // Create a new user
    static async create(userData) {
        const { name, email, password } = userData;
        const query = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.execute(query, [name, email, password]);
        return result.insertId;
    }

    // Find user by email
    static async findByEmail(email) {
        const query = `
            SELECT id, name, email, password, created_at, updated_at
            FROM users
            WHERE email = ?
        `;
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const query = `
            SELECT id, name, email, created_at, updated_at
            FROM users
            WHERE id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    // Update user profile
    static async update(id, userData) {
        const { name, email } = userData;
        const query = `
            UPDATE users
            SET name = ?, email = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [name, email, id]);
        return result.affectedRows > 0;
    }

    // Check if email exists (excluding current user)
    static async emailExists(email, excludeId = null) {
        let query = `
            SELECT id FROM users
            WHERE email = ?
        `;
        const params = [email];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await db.execute(query, params);
        return rows.length > 0;
    }
}

module.exports = User;
