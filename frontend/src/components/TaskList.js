import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Glassmorphism.css';

const TaskList = ({ tasks, refreshTasks }) => {
  // 1. State for the currently selected date (Default: Today)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- 🗓 HELPER FUNCTIONS ---

  // Check if two dates are the same day (ignoring time)
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Format date for the header (e.g., "Thursday, Feb 12")
  const formatDateHeader = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Change day (e.g., +1 for tomorrow, -1 for yesterday)
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // --- 🗑 TASK ACTIONS ---

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    
    try {
      await axios.delete(`/api/tasks/${id}`, config);
      refreshTasks();
    } catch (error) {
      alert('Error deleting task');
    }
  };

  const toggleComplete = async (task) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    try {
      await axios.put(`/api/tasks/${task._id}`, { isCompleted: !task.isCompleted }, config);
      refreshTasks();
    } catch (error) {
      alert('Error updating task');
    }
  };

  // --- 🔍 FILTERING LOGIC ---
  
  // Filter tasks to show ONLY the ones for selectedDate
  const dailyTasks = tasks.filter((task) => {
    if (!task.dateTime) return false;
    const taskDate = new Date(task.dateTime); // Convert UTC string to Date object
    return isSameDay(taskDate, selectedDate);
  });

  return (
    <div className="task-list-container">
      
      {/* 📅 DATE NAVIGATION HEADER */}
      <div className="date-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
        <button onClick={() => changeDate(-1)} className="glass-button-small">
           ◀
        </button>
        
        <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>
          {isSameDay(selectedDate, new Date()) ? 'Today, ' : ''} 
          {formatDateHeader(selectedDate)}
        </h3>
        
        <button onClick={() => changeDate(1)} className="glass-button-small">
           ▶ 
        </button>
      </div>

      {/* 📋 THE LIST */}
      {dailyTasks.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#ccc', padding: '20px' }}>
          <h4>No tasks for this day! 🌴</h4>
          <p>Enjoy your free time or add a new task.</p>
        </div>
      ) : (
        dailyTasks.map((task) => (
          <div 
            key={task._id} 
            className={`glass-card ${task.isCompleted ? 'completed' : ''}`}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px',
              padding: '15px',
              borderLeft: `5px solid ${
                task.priority === 'Very Important' ? '#ff6b6b' : 
                task.priority === 'High' ? '#ffa502' : '#2ed573'
              }`
            }}
          >
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                {task.text}
              </h4>
              <small style={{ color: '#ddd' }}>
                ⏰ {new Date(task.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                {task.location && ` • 📍 ${task.location}`}
              </small>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => toggleComplete(task)}
                className="action-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                {task.isCompleted ? '↩️' : '✅'}
              </button>
              <button 
                onClick={() => deleteTask(task._id)}
                className="action-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;