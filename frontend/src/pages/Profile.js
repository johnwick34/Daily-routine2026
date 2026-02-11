import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import '../styles/Glassmorphism.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  // 1. Load User Data & Tasks on mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      navigate('/login');
    } else {
      fetchUserData(userInfo.token);
      fetchTasks(userInfo.token);
    }
  }, [navigate]);

  // 2. Define fetchUserData (This was missing!)
  const fetchUserData = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/users/profile', config);
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // 3. Define fetchTasks (With Smart Sorting)
  const fetchTasks = async (token) => {
    if (!token) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        token = userInfo?.token;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/tasks', config);
      
      // --- Sorting Logic ---
      const priorityWeight = {
        'Very Important': 4,
        'High': 3,
        'Medium': 2,
        'Low': 1
      };

      const sortedTasks = data.sort((a, b) => {
        const weightA = priorityWeight[a.priority] || 2;
        const weightB = priorityWeight[b.priority] || 2;
        const priorityDiff = weightB - weightA; 
        
        if (priorityDiff !== 0) return priorityDiff; // Priority first
        return new Date(a.dateTime) - new Date(b.dateTime); // Then time
      });

      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div style={{ padding: '100px 20px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      
      {/* Header Stats */}
      {user && (
        <div className="glass-container" style={{ maxWidth: '100%', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>{user.name}</h1>
            <p style={{ margin: '5px 0', opacity: 0.8, fontSize: '1.1rem' }}>{user.careerPosition}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: 0, color: '#fdbb2d', fontSize: '1.5rem' }}>{user.experienceLevel}</h3>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>XP: {user.experiencePoints}</p>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="glass-container" style={{ maxWidth: '100%', marginBottom: '25px', padding: '2rem' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '15px', marginTop: 0 }}>
            Weekly Routine
        </h3>
        <TaskList 
            tasks={tasks} 
            refreshTasks={() => fetchTasks()} 
            refreshProfile={() => {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                if(token) fetchUserData(token);
            }} 
        />
      </div>

      {/* Add Task Form */}
      <div className="glass-container" style={{ maxWidth: '100%', padding: '2rem' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '15px', marginTop: 0 }}>
            Add New Task
        </h3>
        <TaskForm refreshTasks={() => fetchTasks()} />
      </div>

    </div>
  );
};

export default Profile;