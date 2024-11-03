const express = require('express'); // Import express
const db = require('./db');

// Function to set up routes
const setupRoutes = (app) => {
    app.use(express.json()); // Middleware to parse JSON requests

    // Login route
    app.post('/login', (req, res) => {
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const query = `CALL LoginUser(?, ?);`;
        db.query(query, [username, password], (err, results) => {
            if (err) {
                console.error('Error executing login procedure:', err.message); // Log specific error message
                return res.status(500).json({ error: 'Database error', details: err.message }); // Send detailed error message
            }

            // Check if results are as expected
            if (results && results[0] && results[0].length > 0) {
                const response = results[0][0];
                if (response.message === 'Login successful') {
                    return res.json({ message: 'Login successful' });
                } else {
                    return res.json({ message: 'Invalid username or password' });
                }
            } else {
                console.warn('Unexpected result format from database:', results); // Warn if unexpected format
                return res.status(500).json({ error: 'Unexpected database response' });
            }
        });
    });
};

// Export the setupRoutes function
module.exports = setupRoutes;
