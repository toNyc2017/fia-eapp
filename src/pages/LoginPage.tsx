import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logInfo, logError } from '../utils/logger';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, accept any non-empty email/password
    if (email && password) {
      // Store a mock session ID
      const sessionId = `session_${Date.now()}`;
      localStorage.setItem('sessionId', sessionId);
      
      // Log successful login
      logInfo('auth', 'User login successful', { email, sessionId }, sessionId);
      
      navigate('/launcher');
    } else {
      // Log failed login attempt
      logError('auth', 'Login failed - missing credentials', { email: email || 'empty' });
      alert('Please enter both email and password');
    }
  };

  // Log page visit
  React.useEffect(() => {
    logInfo('navigation', 'Login page visited');
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333',
          marginBottom: '30px',
          fontSize: '24px'
        }}>
          FIA eApp Login
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Sign In
          </button>
        </form>
        
        <p style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          color: '#666',
          fontSize: '14px'
        }}>
          Demo: Enter any email and password to continue
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 