import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Glassmorphism.css'; // Ensure this path matches your file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);

      // Save user info and token to local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="glass-container">
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>}
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
        <button type="submit" className="glass-button">Sign In</button>
      </form>
      <Link to="/register" className="glass-link">New here? Create an account</Link>
    </div>
  );
};

export default Login;