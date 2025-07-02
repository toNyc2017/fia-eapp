import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logInfo, logError } from '../utils/logger';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agentName, setAgentName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, accept any non-empty email/password
    if (email && password) {
      // Store a mock session ID
      const sessionId = `session_${Date.now()}`;
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('agentName', agentName);
      
      // Log successful login
      logInfo('auth', 'User login successful', { agentName, email, sessionId }, sessionId);
      
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
    <div className="ceres-center-bg">
      <div className="ceres-login-card">
        <div className="ceres-logo-placeholder">ceres<span style={{color:'#009fe3'}}>life</span></div>
        <h1 className="ceres-login-title">Sign in to your account</h1>
        <form onSubmit={handleSubmit} className="ceres-login-form">
          <div className="ceres-form-group">
            <label htmlFor="agentName" className="ceres-label">Agent Name</label>
            <input
              type="text"
              id="agentName"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="ceres-input"
              placeholder="Enter your name (optional)"
            />
          </div>
          <div className="ceres-form-group">
            <label htmlFor="email" className="ceres-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ceres-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="ceres-form-group">
            <label htmlFor="password" className="ceres-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ceres-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="ceres-login-btn">Sign In</button>
        </form>
        <p className="ceres-login-demo">Demo: Enter any email and password to continue</p>
      </div>
    </div>
  );
};

export default LoginPage; 