const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with specific configuration for credentials
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow the frontend URL or localhost for development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Logging middleware to track requests and methods
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Import the test connection route
const testConnection = require('./testconnection'); // Adjust the path if necessary
app.use('/testconnection', testConnection);

// Import the routes defined in index.js (if you have one)
const setupRoutes = require('./index');
setupRoutes(app);

// Handle OPTIONS preflight requests
app.options('*', cors());

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
