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
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow requests from specified origin
    credentials: true // Enable credentials for CORS
}));

// Log incoming requests and their headers
app.use((req, res, next) => {
    console.log(`Incoming request from ${req.headers.origin}`);
    console.log("Request headers:", req.headers);
    next();
});

// Handle OPTIONS requests explicitly
app.options('*', cors()); // This will enable preflight checks

// Import the routes defined in index.js
const setupRoutes = require('./index');
setupRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
