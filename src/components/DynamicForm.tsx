import React, { useState, useEffect } from 'react';
import { logInfo, logError } from '../utils/logger';

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  validation?: string[];
  options?: string[];
  placeholder?: string;
  defaultValue?: any;
}

interface DynamicFormProps {
  fields: FormField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onBack?: () => void;
  title: string;
  sessionId?: string;
  submitButtonText?: string;
  backButtonText?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  initialData = {},
  onSubmit,
  onBack,
  title,
  sessionId,
  submitButtonText = "Continue",
  backButtonText = "Back"
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Set default values
    const defaults: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined && !(field.id in formData)) {
        defaults[field.id] = field.defaultValue;
      }
    });
    if (Object.keys(defaults).length > 0) {
      setFormData(prev => ({ ...prev, ...defaults }));
    }
  }, [fields, formData]);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      for (const validation of field.validation) {
        switch (validation) {
          case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Please enter a valid email address';
            }
            break;
          case 'ssn':
            if (value) {
              const ssnDigits = value.replace(/[^0-9]/g, '');
              if (ssnDigits.length > 0 && ssnDigits.length !== 9) {
                return 'SSN must be nine digits';
              }
            }
            break;
        }
      }
    }

    return null;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }

    // Log field changes
    if (sessionId) {
      logInfo('form', `Field changed: ${fieldId}`, { 
        field: fieldId, 
        value: typeof value === 'string' ? value.substring(0, 3) + '***' : value 
      }, sessionId);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skipRequired = localStorage.getItem('dev_skip_required') === 'true';
    if (!skipRequired && !validateForm()) {
      return;
    }

    if (sessionId) {
      logInfo('form', `${title} form submitted`, { 
        hasData: true, 
        fieldsCompleted: Object.keys(formData).length 
      }, sessionId);
    }

    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    const commonProps = {
      id: field.id,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
        handleInputChange(field.id, e.target.value),
      className: `ceres-input ${error ? 'ceres-input-error' : ''}`,
      placeholder: field.placeholder
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="ceres-radio-group">
            {field.options?.map(option => (
              <label key={option} className="ceres-radio-label">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="ceres-checkbox-label">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
            />
            {field.label}
          </label>
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', marginTop: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '24px' }}>{title}</h1>
        {sessionId && <p style={{ color: '#666', fontSize: '14px' }}>Session ID: {sessionId}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {fields.map(field => (
            <div key={field.id}>
              <label htmlFor={field.id} className="ceres-label">
                {field.label} {field.required && '*'}
              </label>
              {renderField(field)}
              {errors[field.id] && (
                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                  {errors[field.id]}
                </div>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            {onBack && (
              <button type="button" className="ceres-btn-secondary" onClick={onBack}>
                {backButtonText}
              </button>
            )}
            
            <button type="submit" className="ceres-btn-primary">
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm; 