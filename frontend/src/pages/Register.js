import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Glassmorphism.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [careerPosition, setCareerPosition] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users', { name, email, password, careerPosition }, config);

      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="glass-container">
      <h2 style={{ textAlign: 'center' }}>Create Account</h2>
      {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          className="glass-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          className="glass-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Career Position (e.g., Developer)"
          className="glass-input"
          value={careerPosition}
          onChange={(e) => setCareerPosition(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="glass-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="glass-button">Sign Up</button>
      </form>
      <Link to="/login" className="glass-link">Already have an account? Login</Link>
    </div>
  );
};

export default Register;