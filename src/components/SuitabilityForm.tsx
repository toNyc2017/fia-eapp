import React, { useState, useEffect } from 'react';
import { logInfo, logError } from '../utils/logger';

interface SuitabilityField {
  label: string;
  type: string;
  options?: string[];
}

interface SuitabilityQuestion {
  id: string;
  question: string;
  type: 'dropdown' | 'compound';
  options?: string[];
  fields?: SuitabilityField[];
  conditionalSkip?: Record<string, string[]>;
  displayCondition?: {
    field: string;
    value: string;
  };
}

interface SuitabilityFormProps {
  questions: SuitabilityQuestion[];
  initialData?: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
  sessionId?: string;
}

const SuitabilityForm: React.FC<SuitabilityFormProps> = ({
  questions,
  initialData = {},
  onSave,
  sessionId
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [visibleQuestions, setVisibleQuestions] = useState<string[]>([]);
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);

  // Initialize visible questions and handle conditional logic
  useEffect(() => {
    const calculateVisibleQuestions = () => {
      const visible: string[] = [];
      const skipped: string[] = [];

      questions.forEach(question => {
        // Check display condition first
        if (question.displayCondition) {
          const { field, value } = question.displayCondition;
          if (formData[field] !== value) {
            skipped.push(question.id);
            return;
          }
        }

        // Check if this question should be skipped due to conditional skip logic
        let shouldSkip = false;
        questions.forEach(otherQuestion => {
          if (otherQuestion.conditionalSkip && formData[otherQuestion.id]) {
            const skipList = otherQuestion.conditionalSkip[formData[otherQuestion.id]];
            if (skipList && skipList.includes(question.id)) {
              shouldSkip = true;
            }
          }
        });

        if (shouldSkip) {
          skipped.push(question.id);
        } else {
          visible.push(question.id);
        }
      });

      setVisibleQuestions(visible);
      setSkippedQuestions(skipped);
    };

    calculateVisibleQuestions();
  }, [questions, formData]);

  const handleFieldChange = (questionId: string, fieldLabel: string | null, value: any) => {
    const newData = { ...formData };
    
    if (fieldLabel) {
      // Compound field
      if (!newData[questionId]) {
        newData[questionId] = {};
      }
      newData[questionId][fieldLabel] = value;
    } else {
      // Simple field
      newData[questionId] = value;
    }

    setFormData(newData);
    
    logInfo('form', 'Suitability question answered', {
      questionId,
      fieldLabel,
      value,
      sessionId
    }, sessionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out skipped questions from the final data
    const finalData = { ...formData };
    skippedQuestions.forEach(questionId => {
      delete finalData[questionId];
    });

    onSave(finalData);
    
    logInfo('form', 'Suitability form submitted', {
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(finalData).length,
      skippedQuestions: skippedQuestions.length,
      sessionId
    }, sessionId);
  };

  const renderField = (question: SuitabilityQuestion, field?: SuitabilityField) => {
    const fieldId = field ? `${question.id}_${field.label}` : question.id;
    const currentValue = field 
      ? formData[question.id]?.[field.label] 
      : formData[question.id];

    if (field?.type === 'dropdown' || question.type === 'dropdown') {
      const options = field?.options || question.options || [];
      return (
        <select
          value={currentValue || ''}
          onChange={(e) => handleFieldChange(question.id, field?.label || null, e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            backgroundColor: 'white'
          }}
        >
          <option value="">Select an option...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return null;
  };

  const renderQuestion = (question: SuitabilityQuestion) => {
    if (!visibleQuestions.includes(question.id)) {
      return null;
    }

    return (
      <div key={question.id} style={{
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #e3e8ee',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <h3 style={{
          marginBottom: '15px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Factor {question.id}: {question.question}
        </h3>

        {question.type === 'compound' && question.fields ? (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {question.fields.map((field) => (
              <div key={field.label} style={{ flex: '1', minWidth: '200px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#555'
                }}>
                  {field.label}
                </label>
                {renderField(question, field)}
              </div>
            ))}
          </div>
        ) : (
          <div>
            {renderField(question)}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Suitability Questionnaire</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Please answer the following questions to help determine the suitability of this annuity product.
          {skippedQuestions.length > 0 && (
            <span style={{ color: '#009fe3', fontWeight: '500' }}>
              {' '}Some questions have been automatically skipped based on your previous answers.
            </span>
          )}
        </p>
      </div>

      {questions.map(renderQuestion)}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e3e8ee'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <strong>Progress Summary:</strong>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          • Total Questions: {questions.length}<br/>
          • Visible Questions: {visibleQuestions.length}<br/>
          • Skipped Questions: {skippedQuestions.length}<br/>
          • Answered Questions: {Object.keys(formData).length}
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        display: 'flex',
        gap: '15px',
        justifyContent: 'flex-end'
      }}>
        <button
          type="submit"
          style={{
            backgroundColor: '#009fe3',
            color: 'white',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Save Suitability Answers
        </button>
      </div>
    </form>
  );
};

export default SuitabilityForm; 