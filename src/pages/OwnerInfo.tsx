import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ownerFields from '../utils/owner_fields.json';
import { logInfo, logError } from '../utils/logger';

interface Field {
  code: string;
  label: string;
}

// Example dropdown fields (expand as needed)
const DROPDOWN_FIELDS = [
  'PRODUCT:TYPE_OWNERSHIP_NATURAL_PERSON',
  'PRODUCT:TYPE_OWNERSHIP_TRUST',
  'PRODUCT:TYPE_OWNERSHIP_JOINT',
  'PRODUCT:TYPE_OWNERSHIP_OTHER_ENTITY',
  'OWNER:GENDER_MALE',
  'OWNER:GENDER_FEMALE',
  'OWNER:MARITAL_STATUS_MARRIED',
  'OWNER:MARITAL_STATUS_SINGLE',
  'OWNER:MARITAL_STATUS_DIVORCED',
  'OWNER:MARITAL_STATUS_SEPARATED',
  'OWNER:MARITAL_STATUS_WIDOWED',
  'OWNER:GOVERMENT_ID_SSN_TYPE',
  'OWNER:GOVERMENT_ID_EIN_TIN_TYPE',
];

const OwnerInfo: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    logInfo('navigation', 'Owner Info page visited', { sessionId }, sessionId);
    const existing = localStorage.getItem(`fia_app_${sessionId}_owner_info`);
    if (existing) {
      try {
        setFormData(JSON.parse(existing));
        logInfo('form', 'Loaded existing owner info', { sessionId }, sessionId);
      } catch (error) {
        logError('form', 'Failed to load owner info', { error: (error as Error).message }, sessionId);
      }
    }
  }, [sessionId]);

  const handleChange = (code: string, value: string) => {
    setFormData(prev => ({ ...prev, [code]: value }));
    logInfo('form', `Owner field changed: ${code}`, { value }, sessionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`fia_app_${sessionId}_owner_info`, JSON.stringify(formData));
    logInfo('form', 'Owner info submitted', { ...formData }, sessionId);
    navigate(`/fia-application/${sessionId}/joint-owner-question`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', marginTop: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '24px' }}>Owner Information</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {ownerFields.map((field: Field) => (
            <div key={field.code}>
              <label htmlFor={field.code} style={{ display: 'block', marginBottom: '5px', color: '#333' }}>{field.label}</label>
              {DROPDOWN_FIELDS.includes(field.code) ? (
                <select
                  id={field.code}
                  value={formData[field.code] || ''}
                  onChange={e => handleChange(field.code, e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
                >
                  <option value="">Select {field.label}</option>
                  <option value={field.code}>{field.label}</option>
                </select>
              ) : (
                <input
                  type="text"
                  id={field.code}
                  value={formData[field.code] || ''}
                  onChange={e => handleChange(field.code, e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
                />
              )}
            </div>
          ))}
          <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Continue</button>
        </form>
      </div>
    </div>
  );
};

export default OwnerInfo; 