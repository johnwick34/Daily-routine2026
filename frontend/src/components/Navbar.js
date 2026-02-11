// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav style={navStyle}>
      <h2 style={{ margin: 0 }}>Routine App</h2>
      <div>
        {userInfo ? (
          <>
            <span style={{ marginRight: '15px' }}>Hello, {userInfo.name}</span>
            <button onClick={handleLogout} className="glass-button" style={{ width: 'auto', padding: '5px 15px', marginTop: 0 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Simple inline styles for the navbar
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 1000,
  boxSizing: 'border-box'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: '20px',
  fontWeight: 'bold',
};

export default Navbar;