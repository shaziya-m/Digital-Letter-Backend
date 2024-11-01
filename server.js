const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS package

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS with specific configuration for credentials
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Use FRONTEND_URL from environment variables or default to localhost
    credentials: true // Enable credentials for CORS
    
}));

// Import the routes defined in index.js
require('./index')(app); // Pass the app instance to index.js

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
