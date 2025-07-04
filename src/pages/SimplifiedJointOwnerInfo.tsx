import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../components/DynamicForm';
import simplifiedJointOwnerFields from '../utils/simplified_joint_owner_fields.json';
import { logInfo, logError } from '../utils/logger';
import { ApplicationService } from '../utils/applicationService';

const SimplifiedJointOwnerInfo: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Record<string, any>>({});

  useEffect(() => {
    logInfo('navigation', 'Simplified Joint Owner Info page visited', { sessionId }, sessionId);
    
    // Load existing data from localStorage (for now)
    const existing = localStorage.getItem(`fia_app_${sessionId}_joint_owner_info`);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setInitialData(parsed);
        logInfo('form', 'Loaded existing joint owner info', { sessionId }, sessionId);
      } catch (error) {
        logError('form', 'Failed to load joint owner info', { error: (error as Error).message }, sessionId);
      }
    }
  }, [sessionId]);

  const handleSubmit = async (data: Record<string, any>) => {
    if (!sessionId) {
      alert('Session ID is missing');
      return;
    }
    
    // Save to localStorage (for backward compatibility)
    localStorage.setItem(`fia_app_${sessionId}_joint_owner_info`, JSON.stringify(data));
    
    // Save to Supabase
    const agentName = localStorage.getItem('agentName') || 'Demo Agent';
    const agentEmail = localStorage.getItem('agentEmail') || 'demo@cereslife.com';
    
    const applicationData = {
      session_id: sessionId,
      agent_name: agentName,
      agent_email: agentEmail,
      joint_owner_info: data,
      status: 'draft'
    };
    
    const result = await ApplicationService.saveApplication(applicationData);
    if (!result.success) {
      alert(`Failed to save application: ${result.error}`);
      return;
    }
    
    logInfo('form', 'Joint owner info submitted', { ...data, supabaseId: result.id }, sessionId);
    navigate(`/fia-application/${sessionId}/beneficiary-info`); // or next logical step
  };

  const handleBack = () => {
    logInfo('navigation', 'User navigated back from Joint Owner Info', { sessionId }, sessionId);
    navigate(`/fia-application/${sessionId}/joint-owner-question`);
  };

  return (
    <DynamicForm
      fields={simplifiedJointOwnerFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onBack={handleBack}
      title="Joint Owner Information"
      sessionId={sessionId}
      submitButtonText="Continue"
      backButtonText="Back"
    />
  );
};

export default SimplifiedJointOwnerInfo; 