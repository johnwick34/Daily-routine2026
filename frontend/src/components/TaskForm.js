import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Glassmorphism.css';

const TaskForm = ({ refreshTasks }) => {
  // 1. Manage all form fields in one state object
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    dateTime: '',
    duration: '',
    location: '',
    priority: 'Medium',
    isRecurring: false,
    emailReminder: false
  });

  const [loading, setLoading] = useState(false); // Add Loading State

  // Destructure for easier use in the JSX below
  const { title, details, dateTime, duration, location, priority, isRecurring, emailReminder } = formData;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // 🔧 TIMEZONE FIX START 🔧
      // Convert the local time input to UTC before sending to server
      const localDate = new Date(formData.dateTime); 
      const utcDate = localDate.toISOString(); 
      // 🔧 TIMEZONE FIX END 🔧

      // Create a new object to send, replacing the raw dateTime with the UTC one
      const payload = {
        ...formData,
        dateTime: utcDate 
      };

      await axios.post('/api/tasks', payload, config);
      
      // Clear form on success
      setFormData({
        title: '', 
        details: '', 
        dateTime: '', 
        duration: '', 
        location: '', 
        priority: 'Medium', 
        isRecurring: false, 
        emailReminder: false
      });
      
      refreshTasks();
      
    } catch (error) {
      console.error("Error adding task:", error);
      alert('Error adding task: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <input 
          name="title" 
          value={title} 
          onChange={handleChange} 
          placeholder="Task Title" 
          className="glass-input" 
          required 
        />
        
        {/* Priority Dropdown */}
        <select 
          name="priority" 
          value={priority} 
          onChange={handleChange} 
          className="glass-input" 
          style={{ cursor: 'pointer' }}
        >
          <option value="Low" style={{color: 'black'}}>🟢 Low Priority</option>
          <option value="Medium" style={{color: 'black'}}>🔵 Medium Priority</option>
          <option value="High" style={{color: 'black'}}>🟠 High Priority</option>
          <option value="Very Important" style={{color: 'black'}}>🚨 Very Important</option>
        </select>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
        <input 
          type="datetime-local" 
          name="dateTime" 
          value={dateTime} 
          onChange={handleChange} 
          className="glass-input" 
          required 
        />
        <input 
          type="number" 
          name="duration" 
          value={duration} 
          onChange={handleChange} 
          placeholder="Duration (mins)" 
          className="glass-input" 
          required 
        />
      </div>

      <input 
        name="location" 
        value={location} 
        onChange={handleChange} 
        placeholder="Location (Optional)" 
        className="glass-input" 
        style={{ marginTop: '15px' }}
      />

      <textarea 
        name="details" 
        value={details} 
        onChange={handleChange} 
        placeholder="Details..." 
        className="glass-input" 
        style={{ height: '80px', resize: 'none', marginTop: '15px' }}
      ></textarea>

      <div style={{ display: 'flex', gap: '20px', margin: '15px 0', alignItems: 'center', fontSize: '0.9rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            name="isRecurring" 
            checked={isRecurring} 
            onChange={handleChange} 
            style={{ marginRight: '8px', transform: 'scale(1.2)' }} 
          />
          Repeat this month
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            name="emailReminder" 
            checked={emailReminder} 
            onChange={handleChange} 
            style={{ marginRight: '8px', transform: 'scale(1.2)' }} 
          />
          Email Reminder (10m prior)
        </label>
      </div>

      <button 
        type="submit" 
        className="glass-button" 
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? 'Adding Task...' : 'Add Task to Routine'}
      </button>
    </form>
  );
};

export default TaskForm;