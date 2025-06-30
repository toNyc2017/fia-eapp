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
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'ssn', 'dateOfBirth', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      logError('validation', 'Form submission failed - missing required fields', { missingFields }, sessionId);
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Save to localStorage for demo purposes
    localStorage.setItem(`fia_app_${sessionId}_step1`, JSON.stringify(formData));
    
    // Log successful form submission
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
        maxWidth: '600px',
        marginTop: '20px'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#333',
            marginBottom: '10px',
            fontSize: '24px'
          }}>
            Step 1: Applicant Information
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Session ID: {sessionId}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="ssn" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                Social Security Number *
              </label>
              <input
                type="text"
                id="ssn"
                name="ssn"
                value={formData.ssn}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="XXX-XX-XXXX"
                required
              />
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Street Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="city" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="state" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="CA"
                required
              />
            </div>
            
            <div>
              <label htmlFor="zipCode" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                ZIP Code *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginTop: '20px',
            justifyContent: 'space-between'
          }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                backgroundColor: 'transparent',
                color: '#666',
                padding: '12px 24px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            
            <button
              type="submit"
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Continue to Step 2
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FIAApplicationStep1; 