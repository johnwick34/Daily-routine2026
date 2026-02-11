// backend/utils/scheduler.js
const cron = require('node-cron');
const Task = require('../models/Task');
const sendEmail = require('./sendEmail');

const startScheduler = () => {
    
    // ============================================================
    // JOB 1: The "10-Minute Warning" (Runs Every Minute)
    // ============================================================
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const tenMinutesLater = new Date(now.getTime() + 10 * 60000);
        
        // Exact minute matching
        const startWindow = new Date(tenMinutesLater);
        startWindow.setSeconds(0);
        startWindow.setMilliseconds(0);
        const endWindow = new Date(startWindow);
        endWindow.setSeconds(59);

        try {
            const tasks = await Task.find({
                dateTime: { $gte: startWindow, $lte: endWindow },
                emailReminder: true,
                isCompleted: false
            }).populate('user');

            tasks.forEach(async (task) => {
                // Using HTML breaks for formatting since our sendEmail uses HTML now
                const message = `
                    <strong>Time:</strong> ${new Date(task.dateTime).toLocaleTimeString()} <br>
                    <strong>Location:</strong> ${task.location || 'Home'} <br>
                    <strong>Priority:</strong> ${task.priority || 'Medium'}
                `;

                await sendEmail({
                    email: process.env.EMAIL_RECEIVER, 
                    subject: `⏰ 10 min Warning: ${task.title}`,
                    message: message 
                });
                console.log(`10-min reminder sent for: ${task.title}`);
            });

        } catch (error) {
            console.error('Scheduler Error (10min):', error);
        }
    });


    // ============================================================
    // JOB 2: The "Tomorrow's Briefing" (Runs Every Night at 8:00 PM)
    // ============================================================
    // '0 20 * * *' means 20:00 hours (8 PM)
    cron.schedule('0 20 * * *', async () => {
        console.log('Running Nightly High-Priority Check...');

        try {
            // 1. Calculate "Tomorrow" Range
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
            const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

            // 2. Find High or Very Important tasks for tomorrow
            const importantTasks = await Task.find({
                dateTime: { $gte: startOfTomorrow, $lte: endOfTomorrow },
                priority: { $in: ['High', 'Very Important'] }, // Only grab important ones
                isCompleted: false
            }).populate('user');

            if (importantTasks.length === 0) return; // No stress if nothing due

            // 3. Build a Summary List
            let taskListHTML = `<h3>You have ${importantTasks.length} important tasks tomorrow:</h3><ul>`;
            
            importantTasks.forEach(task => {
                const time = new Date(task.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                // Add a red alert icon for Very Important tasks
                const icon = task.priority === 'Very Important' ? '🚨' : '⚡';
                
                taskListHTML += `
                    <li style="margin-bottom: 10px;">
                        <strong>${icon} ${time} - ${task.title}</strong> <br>
                        <span style="font-size: 12px; color: #666;">(${task.priority})</span>
                    </li>
                `;
            });
            taskListHTML += `</ul>`;

            // 4. Send One Summary Email
            await sendEmail({
                email: process.env.EMAIL_RECEIVER,
                subject: `📢 Heads Up: ${importantTasks.length} Important Tasks Tomorrow!`,
                message: taskListHTML
            });

            console.log('Nightly Briefing Email Sent');

        } catch (error) {
            console.error('Scheduler Error (Nightly):', error);
        }
    });
};

module.exports = startScheduler;