import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; // <--- Import Axios here

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Import Components
import Navbar from './components/Navbar';

// Import Styles
import './App.css';
import './styles/Glassmorphism.css'; 

// =======================================================
// 🚀 GLOBAL AXIOS SETTING (The "Link" Finder)
// =======================================================
// This tells React: "If we are online, use the Render URL. If on laptop, use localhost."
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://routine-app-backend-ba5l.onrender.com'// <--- ⚠️ STEP 3: PASTE YOUR RENDER BACKEND URL HERE LATER!
  : 'http://localhost:5000'; 

axios.defaults.baseURL = API_URL;
// =======================================================

function App() {
  // Check for a token to protect routes (Simple check)
  const userInfo = localStorage.getItem('userInfo');
  const isAuthenticated = userInfo ? true : false;

  return (
    <Router>
      <div className="app-container">
        {/* Navbar appears on all pages */}
        <Navbar />
        
        <Routes>
          {/* Default Route: Redirect to Login if not logged in, otherwise go to Profile */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <Navigate to="/login" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* The Profile Page (Protected) */}
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;