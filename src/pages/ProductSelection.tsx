import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productOptions from '../utils/productOptions.json';
import { logInfo, logError } from '../utils/logger';
import { ApplicationService } from '../utils/applicationService';

interface ProductOption {
  code: string;
  label: string;
}

const getOptions = (prefix: string) =>
  (productOptions as ProductOption[]).filter(opt => opt.code.startsWith(prefix));

const ProductSelection: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product: '',
    term: '',
    ownershipType: '',
    planType: '',
    accountDesignation: ''
  });

  // Load from localStorage on mount
  useEffect(() => {
    logInfo('navigation', 'Product Selection page visited', { sessionId }, sessionId);
    const existing = localStorage.getItem(`fia_app_${sessionId}_product_selection`);
    if (existing) {
      try {
        setFormData(JSON.parse(existing));
        logInfo('form', 'Loaded existing product selection data', { sessionId }, sessionId);
      } catch (error) {
        logError('form', 'Failed to load product selection data', { error: (error as Error).message }, sessionId);
      }
    }
  }, [sessionId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    logInfo('form', `Product selection field changed: ${name}`, { value }, sessionId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skipRequired = localStorage.getItem('dev_skip_required') === 'true';
    if (!skipRequired) {
      if (!formData.product || !formData.term || !formData.ownershipType || !formData.planType || !formData.accountDesignation) {
        alert('Please fill in all required fields.');
        return;
      }
    }
    
    if (!sessionId) {
      alert('Session ID is missing');
      return;
    }
    
    // Save to localStorage (for backward compatibility)
    localStorage.setItem(`fia_app_${sessionId}_product_selection`, JSON.stringify(formData));
    
    // Save to Supabase
    const agentName = localStorage.getItem('agentName') || 'Demo Agent';
    const agentEmail = localStorage.getItem('agentEmail') || 'demo@cereslife.com';
    
    const applicationData = {
      session_id: sessionId,
      agent_name: agentName,
      agent_email: agentEmail,
      product_id: formData.product,
      product_name: formData.product,
      ownership_type: formData.ownershipType,
      plan_type: formData.planType,
      account_designation: formData.accountDesignation,
      status: 'draft'
    };
    
    const result = await ApplicationService.saveApplication(applicationData);
    if (!result.success) {
      alert(`Failed to save application: ${result.error}`);
      return;
    }
    
    logInfo('form', 'Product selection submitted', { ...formData, supabaseId: result.id }, sessionId);
    navigate(`/fia-application/${sessionId}/owner-info`);
  };

  const handleBack = () => {
    logInfo('navigation', 'User navigated back from Product Selection', { sessionId }, sessionId);
    navigate(`/fia-application/${sessionId}/step/1`);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5'
    }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', marginTop: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '24px' }}>Step 2: Product Selection</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Session ID: {sessionId}</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <div>
            <label htmlFor="product" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Product *</label>
            <select name="product" id="product" value={formData.product} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}>
              <option value="">Select a product</option>
              {getOptions('PRODUCT:PRODUCT').map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="term" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Term *</label>
            <select name="term" id="term" value={formData.term} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}>
              <option value="">Select a term</option>
              {getOptions('PRODUCT:TERM_SELECTION').map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ownershipType" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Ownership Type *</label>
            <select name="ownershipType" id="ownershipType" value={formData.ownershipType} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}>
              <option value="">Select ownership type</option>
              {getOptions('PRODUCT:TYPE_OWNERSHIP').map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="planType" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Plan Type *</label>
            <select name="planType" id="planType" value={formData.planType} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}>
              <option value="">Select plan type</option>
              {getOptions('PRODUCT:PLAN_TYPE').map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="accountDesignation" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Account Designation *</label>
            <select name="accountDesignation" id="accountDesignation" value={formData.accountDesignation} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}>
              <option value="">Select account designation</option>
              {getOptions('PRODUCT:ACCOUNT_DESIGNATION').map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'space-between' }}>
            <button type="button" onClick={handleBack} style={{ backgroundColor: 'transparent', color: '#666', padding: '12px 24px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Back</button>
            <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductSelection; 