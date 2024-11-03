// Create a file at api/test-connection.js

const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/', (req, res) => {
    // Replace with your database configuration
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,  // Your database host
        user: process.env.DB_USER,  // Your database user
        password: process.env.DB_PASSWORD,  // Your database password
        database: process.env.DB_NAME   // Your database name
    });

    connection.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err);
            return res.status(500).json({ success: false, error: err.message });
        }

        res.json({ success: true, message: 'Database connection successful!' });
        connection.end(); // Close the connection
    });
});

module.exports = router;
