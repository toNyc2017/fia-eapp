import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logInfo, logWarn } from '../utils/logger';
import LogExporter from '../components/LogExporter';

const ApplicationLauncher: React.FC = () => {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem('sessionId');
  const [showLogExporter, setShowLogExporter] = useState(false);

  const handleStartNew = () => {
    // Generate a new session ID for the new application
    const newSessionId = `session_${Date.now()}`;
    localStorage.setItem('sessionId', newSessionId);
    
    logInfo('navigation', 'Starting new FIA application', { newSessionId }, newSessionId);
    navigate(`/fia-application/${newSessionId}/step/1`);
  };

  const handleResume = () => {
    // Use existing session ID to resume
    if (sessionId) {
      logInfo('navigation', 'Resuming previous FIA application', { sessionId }, sessionId);
      navigate(`/fia-application/${sessionId}/step/1`);
    } else {
      logWarn('navigation', 'No previous application found, starting new one');
      alert('No previous application found. Starting new application.');
      handleStartNew();
    }
  };

  const handleLogout = () => {
    logInfo('auth', 'User logout', { sessionId }, sessionId || undefined);
    localStorage.removeItem('sessionId');
    navigate('/');
  };

  // Log page visit
  React.useEffect(() => {
    logInfo('navigation', 'Application launcher visited', { sessionId }, sessionId || undefined);
  }, [sessionId]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
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
        maxWidth: '500px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ 
          color: '#333',
          marginBottom: '10px',
          fontSize: '28px'
        }}>
          FIA eApp Dashboard
        </h1>
        
        <p style={{ 
          color: '#666',
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Welcome to the Fixed Indexed Annuity Electronic Application
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          <button
            onClick={handleStartNew}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Start New FIA Application
          </button>
          
          <button
            onClick={handleResume}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Resume Previous Application
          </button>
        </div>

        <div style={{ 
          borderTop: '1px solid #eee', 
          paddingTop: '20px',
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>

          <button
            onClick={() => setShowLogExporter(!showLogExporter)}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {showLogExporter ? 'Hide' : 'Show'} Logs
          </button>
        </div>

        {sessionId && (
          <p style={{ 
            marginTop: '20px', 
            color: '#999',
            fontSize: '12px'
          }}>
            Session ID: {sessionId}
          </p>
        )}
      </div>

      {showLogExporter && <LogExporter />}
    </div>
  );
};

export default ApplicationLauncher; 