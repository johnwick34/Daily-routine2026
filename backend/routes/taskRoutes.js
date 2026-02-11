// backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Valid routes: /api/tasks/
router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

// Valid routes: /api/tasks/:id
router.route('/:id')
    .put(protect, updateTask)   // For marking complete
    .delete(protect, deleteTask); // For deleting

module.exports = router;