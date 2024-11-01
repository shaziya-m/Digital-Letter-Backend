const express = require('express'); // Import express
const db = require('./db');

// Function to set up routes
const setupRoutes = (app) => {
    app.use(express.json()); // Middleware to parse JSON requests

    // Login route
    app.post('/login', (req, res) => {
        const { username, password } = req.body;

        const query = `CALL LoginUser(?, ?)`;
        db.query(query, [username, password], (err, results) => {
            if (err) {
                console.error('Error executing login procedure:', err);
                res.status(500).json({ error: 'Database error' });
                return;
            }

            if (results[0].length > 0 && results[0][0].message === 'Login successful') {
                res.json({ message: 'Login successful' });
            } else {
                res.json({ message: 'Invalid username or password' });
            }
        });
    });
};

// Export the setupRoutes function
module.exports = setupRoutes;
