import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ApplicationLauncher from './pages/ApplicationLauncher';
import FIAApplicationStep1 from './pages/FIAApplicationStep1';
import ProductSelection from './pages/ProductSelection';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/launcher" element={<ApplicationLauncher />} />
        <Route path="/fia-application/:sessionId/step/1" element={<FIAApplicationStep1 />} />
        <Route path="/fia-application/:sessionId/step/2" element={<ProductSelection />} />
        <Route path="/fia-application/:sessionId/step/3" element={<div>Step 3 - Coming Soon!</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App; 