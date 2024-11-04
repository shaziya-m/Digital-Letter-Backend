const express = require('express'); // Import express
const db = require('./db');

// Function to set up routes
const setupRoutes = (app) => {
    app.use(express.json()); // Middleware to parse JSON requests

    // Login route
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const query = `SELECT login_user($1, $2) AS message;`;

        try {
            const result = await db.query(query, [username, password]);

            // Check if results are as expected
            if (result.rows.length > 0) {
                const response = result.rows[0].message; // Access the message field from the response
                if (response === 'Login successful') {
                    return res.json({ message: 'Login successful' });
                } else {
                    return res.json({ message: 'Invalid username or password' });
                }
            } else {
                console.warn('Unexpected result format from database:', result); // Warn if unexpected format
                return res.status(500).json({ error: 'Unexpected database response' });
            }
        } catch (err) {
            console.error('Error executing login procedure:', err.message); // Log specific error message
            return res.status(500).json({ error: 'Database error', details: err.message }); // Send detailed error message
        }
    });
};

// Export the setupRoutes function
module.exports = setupRoutes;
