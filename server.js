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

// Add CORS debugging headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    console.log("CORS allowed origin:", process.env.FRONTEND_URL || 'http://localhost:3000');
    console.log("Request headers set for CORS:");
    console.log(res.getHeaders());
    next();
});

// Handle OPTIONS requests explicitly if needed
app.options('*', cors());

// Import the routes defined in index.js

const setupRoutes = require('./index');
setupRoutes(app);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
