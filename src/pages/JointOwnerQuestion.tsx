import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { logInfo } from '../utils/logger';

const JointOwnerQuestion: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [hasJointOwner, setHasJointOwner] = useState<string>('');

  useEffect(() => {
    logInfo('navigation', 'Joint Owner Question page visited', { sessionId }, sessionId);
    const existing = localStorage.getItem(`fia_app_${sessionId}_joint_owner_question`);
    if (existing) {
      setHasJointOwner(existing);
    }
  }, [sessionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skipRequired = localStorage.getItem('dev_skip_required') === 'true';
    if (!skipRequired && hasJointOwner === '') {
      alert('Please select Yes or No.');
      return;
    }
    localStorage.setItem(`fia_app_${sessionId}_joint_owner_question`, hasJointOwner);
    logInfo('form', 'Joint owner question answered', { hasJointOwner }, sessionId);
    if (hasJointOwner === 'yes') {
      navigate(`/fia-application/${sessionId}/joint-owner-info`);
    } else {
      navigate(`/fia-application/${sessionId}/beneficiary-info`); // or next logical step
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', marginTop: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '24px' }}>Joint Owner</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <label style={{ color: '#333', fontSize: '18px' }}>Is there a joint owner?</label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label>
              <input
                type="radio"
                name="hasJointOwner"
                value="yes"
                checked={hasJointOwner === 'yes'}
                onChange={() => setHasJointOwner('yes')}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="hasJointOwner"
                value="no"
                checked={hasJointOwner === 'no'}
                onChange={() => setHasJointOwner('no')}
              />
              No
            </label>
          </div>
          <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Continue</button>
        </form>
      </div>
    </div>
  );
};

export default JointOwnerQuestion; 