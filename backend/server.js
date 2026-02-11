// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- This fixes the "Blocked by CORS" error
const connectDB = require('./config/db');
const startScheduler = require('./utils/scheduler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); 

// --- 🚀 CORS FIX FOR RENDER ---
// This allows ANY website to talk to your backend. 
// (Easiest for deployment. Later you can restrict this to just your frontend URL)
app.use(cors({
    origin: '*', 
    credentials: true 
}));

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes 
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Start the Email Scheduler
startScheduler();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));