import React from 'react';
import axios from 'axios';
import '../styles/Glassmorphism.css'; // Ensure this is imported

const TaskList = ({ tasks, refreshTasks, refreshProfile }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const deleteTask = async (id) => {
    if(!window.confirm("Delete this task?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/tasks/${id}`, config);
      refreshTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const completeTask = async (task) => {
    if (task.isCompleted) return; 

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/tasks/${task._id}`, { isCompleted: true }, config);
      refreshTasks();   
      refreshProfile(); 
    } catch (error) {
      console.error('Error completing task', error);
    }
  };

  // Helper to get Color based on Priority
  const getPriorityColor = (p) => {
    switch(p) {
      case 'Very Important': return '#ff4757'; // Bright Red
      case 'High': return '#ffa502'; // Orange
      case 'Low': return '#2ed573'; // Green
      default: return '#fff'; // White (Medium)
    }
  };

  if (!tasks.length) return <p style={{textAlign:'center', opacity: 0.7}}>No tasks scheduled. Time to relax! 🏝️</p>;

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="glass-task-card" style={{ 
            borderLeft: `5px solid ${getPriorityColor(task.priority)}` // Dynamic Border Color
        }}>
          
          {/* Checkbox */}
          <div onClick={() => completeTask(task)} style={{ 
              cursor: 'pointer', 
              marginRight: '15px', 
              fontSize: '1.5rem',
              color: task.isCompleted ? '#2ed573' : 'rgba(255,255,255,0.5)',
              transition: '0.2s'
            }}>
            {task.isCompleted ? '☑' : '☐'}
          </div>

          {/* Task Info */}
          <div style={{ flexGrow: 1, opacity: task.isCompleted ? 0.5 : 1 }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                {task.priority === 'Very Important' && '🚨 '} 
                {task.priority === 'High' && '⚡ '}
                {task.title} 
                <span style={{fontSize: '0.8rem', fontWeight: '400', opacity: 0.8, marginLeft: '10px'}}>
                  ({task.duration} mins)
                </span>
            </h4>
            
            <p style={{ margin: '5px 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                📅 {new Date(task.dateTime).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})} 
                <span style={{ margin: '0 8px' }}>|</span> 
                📍 {task.location || 'Home'}
            </p>
            
            {/* Priority Badge */}
            <span style={{ 
              fontSize: '0.75rem', 
              padding: '2px 8px', 
              borderRadius: '4px', 
              background: getPriorityColor(task.priority),
              color: task.priority === 'Medium' ? '#333' : 'white',
              fontWeight: 'bold'
            }}>
              {task.priority || 'Medium'}
            </span>
          </div>

          {/* Delete Button */}
          <button onClick={() => deleteTask(task._id)} style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginLeft: '10px', opacity: 0.7
          }}>
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;