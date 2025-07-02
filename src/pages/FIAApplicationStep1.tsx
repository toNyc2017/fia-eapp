import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { logInfo, logError } from '../utils/logger';

const FIAApplicationStep1: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ssn: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Log field changes for analytics
    logInfo('form', `Field changed: ${name}`, { field: name, value: value.substring(0, 3) + '***' }, sessionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skipRequired = localStorage.getItem('dev_skip_required') === 'true';
    // SSN validation (always enforced, even in dev mode)
    const ssnDigits = formData.ssn.replace(/[^0-9]/g, '');
    if (ssnDigits.length > 0 && ssnDigits.length !== 9) {
      setError('SSN must be nine digits');
      return;
    }
    if (!skipRequired) {
      const requiredFields = ['firstName', 'lastName', 'ssn', 'dateOfBirth', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
    }
    setError(null);
    localStorage.setItem(`fia_app_${sessionId}_step1`, JSON.stringify(formData));
    logInfo('form', 'Step 1 form submitted successfully', { 
      hasData: true, 
      fieldsCompleted: Object.keys(formData).length 
    }, sessionId);
    navigate(`/fia-application/${sessionId}/step/2`);
  };

  const handleBack = () => {
    logInfo('navigation', 'User navigated back from Step 1', { sessionId }, sessionId);
    navigate('/launcher');
  };

  // Log page visit
  React.useEffect(() => {
    logInfo('navigation', 'Step 1 form page visited', { sessionId }, sessionId);
    
    // Try to load existing data
    const existingData = localStorage.getItem(`fia_app_${sessionId}_step1`);
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        setFormData(parsed);
        logInfo('form', 'Loaded existing form data for Step 1', { sessionId }, sessionId);
      } catch (error) {
        logError('form', 'Failed to load existing form data', { error: (error as Error).message }, sessionId);
      }
    }
  }, [sessionId]);

  return (
    <div className="ceres-center-bg">
      <div className="ceres-card">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#003366', marginBottom: '10px', fontSize: '24px', fontWeight: 700 }}>
            Step 1: Applicant Information
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Session ID: {sessionId}
          </p>
        </div>
        {error && (
          <div style={{
            background: '#ffeaea',
            color: '#b10000',
            border: '1.5px solid #ffb3b3',
            borderRadius: '7px',
            padding: '12px 16px 12px 36px',
            marginBottom: '18px',
            position: 'relative',
            fontWeight: 500,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span
              onClick={() => setError(null)}
              style={{
                position: 'absolute',
                left: 10,
                top: 8,
                fontWeight: 700,
                fontSize: '1.1em',
                cursor: 'pointer',
                color: '#b10000',
                userSelect: 'none',
              }}
              title="Dismiss error"
            >
              ×
            </span>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="firstName" className="ceres-label">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="ceres-input"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="ceres-label">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="ceres-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="ssn" className="ceres-label">Social Security Number *</label>
              <input
                type="text"
                id="ssn"
                name="ssn"
                value={formData.ssn}
                onChange={handleInputChange}
                className="ceres-input"
                placeholder="XXX-XX-XXXX"
              />
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="ceres-label">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="ceres-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="email" className="ceres-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="ceres-input"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="ceres-label">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="ceres-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="ceres-label">Street Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="ceres-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="city" className="ceres-label">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="ceres-input"
              />
            </div>
            
            <div>
              <label htmlFor="state" className="ceres-label">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="ceres-input"
              />
            </div>
            
            <div>
              <label htmlFor="zipCode" className="ceres-label">ZIP Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="ceres-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button type="button" className="ceres-btn-secondary" onClick={handleBack}>Back</button>
            
            <button type="submit" className="ceres-btn-primary">Continue to Step 2</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FIAApplicationStep1; 