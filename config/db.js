const mysql2 = require('mysql2');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'auth_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert to promise-based pool
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('MySQL database connected successfully');
        connection.release();
    } catch (error) {
        console.error('MySQL connection error:', error.message);
        process.exit(1);
    }
};

testConnection();

module.exports = promisePool;
