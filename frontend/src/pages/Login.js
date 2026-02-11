import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Glassmorphism.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // <--- New Loading State
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');       // Clear old errors
    setLoading(true);   // Start loading

    console.log("Attempting to log in...", { email }); // Debug Log

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      
      // This uses the BaseURL we set in App.js
      const { data } = await axios.post('/api/users/login', { email, password }, config);

      console.log("Login Success!", data); // Debug Log
      
      // Save info
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect
      navigate('/profile');
      window.location.reload(); // Force refresh to update Navbar
    } catch (err) {
      console.error("Login Failed:", err); // Debug Log
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Server connection failed. Check console for details.'
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="glass-container">
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      
      {error && (
        <div style={{ color: '#ff6b6b', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '5px', textAlign: 'center', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          className="glass-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="glass-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Button changes text when loading */}
        <button 
            type="submit" 
            className="glass-button" 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
        >
          {loading ? 'Waking up Server...' : 'Sign In'}
        </button>
      </form>

      <Link to="/register" className="glass-link">New here? Create an account</Link>
    </div>
  );
};

export default Login;