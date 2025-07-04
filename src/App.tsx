import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ApplicationLauncher from './pages/ApplicationLauncher';
import FIAApplicationStep1 from './pages/FIAApplicationStep1';
import ProductSelection from './pages/ProductSelection';
import OwnerInfo from './pages/OwnerInfo';
import JointOwnerQuestion from './pages/JointOwnerQuestion';
import JointOwnerInfo from './pages/JointOwnerInfo';
import SimplifiedOwnerInfo from './pages/SimplifiedOwnerInfo';
import SimplifiedJointOwnerInfo from './pages/SimplifiedJointOwnerInfo';
import SideNav from './components/SideNav';

const DevModeToggle: React.FC = () => {
  const [devMode, setDevMode] = useState(localStorage.getItem('dev_skip_required') === 'true');

  useEffect(() => {
    const handler = () => setDevMode(localStorage.getItem('dev_skip_required') === 'true');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const toggleDevMode = () => {
    const newValue = !devMode;
    localStorage.setItem('dev_skip_required', newValue ? 'true' : 'false');
    setDevMode(newValue);
  };

  return (
    <button
      onClick={toggleDevMode}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        background: devMode ? '#009fe3' : '#eee',
        color: devMode ? '#fff' : '#333',
        border: 'none',
        borderRadius: 6,
        padding: '8px 18px',
        fontWeight: 600,
        fontSize: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      title="Toggle Dev Mode (skip required fields)"
    >
      Dev Mode: {devMode ? 'ON' : 'OFF'}
    </button>
  );
};

function App() {
  const location = useLocation();
  const showSideNav = location.pathname !== '/' && location.pathname !== '/launcher';
  return (
    <div className="App" style={{ display: 'flex', minHeight: '100vh' }}>
      {showSideNav && <SideNav />}
      <div style={{ flex: 1, marginLeft: showSideNav ? 220 : 0, transition: 'margin-left 0.2s' }}>
        <DevModeToggle />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/launcher" element={<ApplicationLauncher />} />
          <Route path="/fia-application/:sessionId/step/1" element={<FIAApplicationStep1 />} />
          <Route path="/fia-application/:sessionId/step/2" element={<ProductSelection />} />
                      <Route path="/fia-application/:sessionId/owner-info" element={<SimplifiedOwnerInfo />} />
            <Route path="/fia-application/:sessionId/joint-owner-question" element={<JointOwnerQuestion />} />
            <Route path="/fia-application/:sessionId/joint-owner-info" element={<SimplifiedJointOwnerInfo />} />
          <Route path="/fia-application/:sessionId/beneficiary-info" element={<div>Beneficiary Info - Coming Soon!</div>} />
          <Route path="/fia-application/:sessionId/step/3" element={<div>Step 3 - Coming Soon!</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App; 