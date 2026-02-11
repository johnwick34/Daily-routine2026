// backend/controllers/taskController.js
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        // Find tasks where user matches the logged in ID
        const tasks = await Task.find({ user: req.user.id }).sort({ dateTime: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new task (Handles Recurring Logic)
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    // 1. Add 'priority' to destructuring
    const { title, details, dateTime, duration, location, priority, isRecurring, emailReminder } = req.body;

    if (!title || !dateTime || !duration) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const initialDate = new Date(dateTime);
        const tasksToCreate = [];

        // 2. Prepare the main task (Include Priority)
        tasksToCreate.push({
            user: req.user.id,
            title,
            details,
            dateTime: initialDate,
            duration,
            location,
            priority: priority || 'Medium', // Default to Medium if missing
            isRecurring,
            emailReminder
        });

        // 3. Handle Recurring Logic
        if (isRecurring) {
            const currentMonth = initialDate.getMonth();
            const currentYear = initialDate.getFullYear();
            
            let nextDate = new Date(initialDate);
            nextDate.setDate(nextDate.getDate() + 7);

            while (nextDate.getMonth() === currentMonth && nextDate.getFullYear() === currentYear) {
                tasksToCreate.push({
                    user: req.user.id,
                    title,
                    details,
                    dateTime: new Date(nextDate),
                    duration,
                    location,
                    priority: priority || 'Medium', // Ensure recurring tasks get the priority too
                    isRecurring: true,
                    emailReminder
                });
                
                nextDate.setDate(nextDate.getDate() + 7);
            }
        }

        // 4. Save all tasks
        const createdTasks = await Task.insertMany(tasksToCreate);
        res.status(201).json(createdTasks);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task (Mark complete & Increase XP)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // UPDATE XP LOGIC
        if (req.body.isCompleted && !task.isCompleted) {
            const user = await User.findById(req.user.id);
            
            // BONUS: Higher Priority = More XP?
            let xpGain = 10; // Default
            if (task.priority === 'High') xpGain = 20;
            if (task.priority === 'Very Important') xpGain = 50;

            user.experiencePoints += xpGain;

            if (user.experiencePoints >= 500) user.experienceLevel = 'Senior';
            else if (user.experiencePoints >= 200) user.experienceLevel = 'Mid-Level';
            else if (user.experiencePoints >= 0) user.experienceLevel = 'Junior';

            await user.save();
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await task.deleteOne();
        res.status(200).json({ id: req.params.id });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};