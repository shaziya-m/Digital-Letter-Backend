const express = require('express'); // Import express
const db = require('./db'); // Database connection (use your actual database connection)

// Function to set up routes
const setupRoutes = (app) => {
    // Login route
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
    
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
    
        const query = `SELECT * FROM login_user($1, $2);`;
    
        try {
            // Execute the query with parameters [username, password]
            const result = await db.query(query, [username, password]);
    
            // Check if results are as expected
            if (result.rows.length > 0) {
                const { message, user_id, userrights } = result.rows[0]; // Destructure the message, user_id, and userrights from the response
                if (message === 'Login successful') {
                    return res.json({ message: 'Login successful', user_id, userrights }); // Return user_id and userrights on successful login
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
    
    // Route to fetch other users
    app.get('/api/other-users', async (req, res) => {
        const { loggedInUserId } = req.query; // Get logged-in user ID from query parameters

        if (!loggedInUserId) {
            return res.status(400).json({ error: 'Logged-in user ID is required' });
        }

        const query = `SELECT user_id, username FROM get_other_users($1);`;  // Adjusted query to fetch only id and username

        try {
            // Execute the query with logged-in user's ID
            const result = await db.query(query, [loggedInUserId]);

            // Send only the id and username fields of other users as response
            res.json(result.rows);
        } catch (err) {
            console.error('Error fetching other users:', err.message);
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    });

    // Route to send a letter
   
    app.post('/api/send-letter', async (req, res) => {
        const { fromUserId, toUser, content, sendTime, senderName } = req.body;
    
        // Check if all required fields are present
        if (!fromUserId || !toUser || !content || !sendTime || !senderName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
    
        const query = `CALL saveletter($1, $2, $3, $4, $5);`;
    
        try {
            // Execute the procedure with parameters
            await db.query(query, [fromUserId, senderName, toUser, content, sendTime]);
    
            // If no error, assume letter was sent successfully
            return res.json({ message: 'Letter sent successfully!' });
        } catch (err) {
            console.error('Error sending letter:', err.message); // Log specific error message
            return res.status(500).json({ error: 'Database error', details: err.message }); // Send detailed error message
        }
    });

    // Route to check the read status of letters for a given receiverid
    app.get('/api/check-read-status', async (req, res) => {
        const { userId } = req.query; // User ID from the frontend's session storage
    
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
    
        const query = `SELECT * FROM check_letter($1);`;
    
        try {
            const result = await db.query(query, [userId]);
            
            // Check if there are any results and return them as an array
            if (result.rows.length > 0) {
                const unreadLetters = result.rows.map(row => ({
                    read_status: row.read_status,
                    sendername: row.sendername
                }));
                res.json(unreadLetters); // Return the data as an array of objects
            } else {
                res.json([]); // Return an empty array if no unread letters are found
            }
        } catch (err) {
            console.error('Error fetching read status:', err.message);
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    });
    
};

// Export the setupRoutes function
module.exports = setupRoutes;
