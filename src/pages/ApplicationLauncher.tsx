import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logInfo, logWarn } from '../utils/logger';
import LogExporter from '../components/LogExporter';
import { ApplicationService } from '../utils/applicationService';

const ApplicationLauncher: React.FC = () => {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem('sessionId');
  const [showLogExporter, setShowLogExporter] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const agentEmail = localStorage.getItem('agentEmail') || 'demo@cereslife.com';

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

  // Load existing applications
  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      const result = await ApplicationService.getApplicationsByAgent(agentEmail);
      if (result.success && result.data) {
        setApplications(result.data);
        logInfo('navigation', 'Applications loaded', { count: result.data.length }, sessionId || undefined);
      } else {
        logWarn('navigation', 'Failed to load applications', { error: result.error }, sessionId || undefined);
      }
      setLoading(false);
    };

    loadApplications();
  }, [agentEmail, sessionId]);

  // Log page visit
  React.useEffect(() => {
    logInfo('navigation', 'Application launcher visited', { sessionId }, sessionId || undefined);
  }, [sessionId]);

  const handleResumeApplication = (sessionId: string) => {
    localStorage.setItem('sessionId', sessionId);
    logInfo('navigation', 'Resuming specific application', { sessionId }, sessionId);
    navigate(`/fia-application/${sessionId}/step/1`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        maxWidth: '800px',
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

        {/* Existing Applications Section */}
        <div style={{ marginBottom: '30px', textAlign: 'left' }}>
          <h2 style={{ color: '#333', fontSize: '18px', marginBottom: '15px', textAlign: 'center' }}>Existing Applications</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Loading applications...</div>
          ) : applications.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e3e8ee', borderRadius: '6px' }}>
              {applications.map((app, index) => (
                <div key={app.id} style={{ 
                  padding: '15px', 
                  borderBottom: index < applications.length - 1 ? '1px solid #e3e8ee' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: app.session_id === sessionId ? '#f0f8ff' : 'white'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#333', marginBottom: '5px' }}>
                      {app.applicant_first_name && app.applicant_last_name 
                        ? `${app.applicant_first_name} ${app.applicant_last_name}`
                        : `Application ${app.session_id.slice(-8)}`
                      }
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                      Status: <span style={{ 
                        color: app.status === 'draft' ? '#ffa500' : 
                               app.status === 'submitted' ? '#28a745' : '#666',
                        fontWeight: 500
                      }}>{app.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Created: {formatDate(app.created_at)}
                      {app.updated_at !== app.created_at && ` • Updated: ${formatDate(app.updated_at)}`}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleResumeApplication(app.session_id)}
                    style={{ 
                      backgroundColor: '#009fe3', 
                      color: 'white', 
                      padding: '8px 16px', 
                      border: 'none', 
                      borderRadius: '4px', 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      marginLeft: '15px'
                    }}
                  >
                    {app.session_id === sessionId ? 'Continue' : 'Resume'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666', backgroundColor: '#f7fafd', borderRadius: '6px' }}>
              No applications found. Start a new application to get started!
            </div>
          )}
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