import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ApplicationLauncher from './pages/ApplicationLauncher';
import FIAApplicationStep1 from './pages/FIAApplicationStep1';
import ProductSelection from './pages/ProductSelection';
import OwnerInfo from './pages/OwnerInfo';
import JointOwnerQuestion from './pages/JointOwnerQuestion';
import JointOwnerInfo from './pages/JointOwnerInfo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/launcher" element={<ApplicationLauncher />} />
        <Route path="/fia-application/:sessionId/step/1" element={<FIAApplicationStep1 />} />
        <Route path="/fia-application/:sessionId/step/2" element={<ProductSelection />} />
        <Route path="/fia-application/:sessionId/owner-info" element={<OwnerInfo />} />
        <Route path="/fia-application/:sessionId/joint-owner-question" element={<JointOwnerQuestion />} />
        <Route path="/fia-application/:sessionId/joint-owner-info" element={<JointOwnerInfo />} />
        <Route path="/fia-application/:sessionId/beneficiary-info" element={<div>Beneficiary Info - Coming Soon!</div>} />
        <Route path="/fia-application/:sessionId/step/3" element={<div>Step 3 - Coming Soon!</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App; 