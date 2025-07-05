import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logInfo, logError } from '../utils/logger';
import { ApplicationService } from '../utils/applicationService';
import SuitabilityForm from '../components/SuitabilityForm';
import suitabilityQuestions from '../utils/suitability_question_config_full.json';

const SuitabilityQuestionnaire: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingData, setExistingData] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadExistingData = async () => {
      if (!sessionId) return;

      setLoading(true);
      const result = await ApplicationService.loadApplication(sessionId);
      
      if (result.success && result.data?.suitability_data) {
        setExistingData(result.data.suitability_data);
        logInfo('navigation', 'Loaded existing suitability data', { 
          questionCount: Object.keys(result.data.suitability_data).length 
        }, sessionId);
      } else {
        logInfo('navigation', 'No existing suitability data found', {}, sessionId);
      }
      
      setLoading(false);
    };

    loadExistingData();
  }, [sessionId]);

  const handleSave = async (suitabilityData: Record<string, any>) => {
    if (!sessionId) return;

    setSaving(true);
    
    try {
      // Load current application data
      const currentResult = await ApplicationService.loadApplication(sessionId);
      if (!currentResult.success) {
        throw new Error('Failed to load current application data');
      }

      const currentData = currentResult.data || {};
      
      // Update with suitability data
      const updatedData = {
        ...currentData,
        suitability_data: suitabilityData,
        status: 'draft'
      } as any;

      const saveResult = await ApplicationService.saveApplication(updatedData);
      
      if (saveResult.success) {
        logInfo('form', 'Suitability data saved successfully', {
          questionCount: Object.keys(suitabilityData).length,
          sessionId
        }, sessionId);
        
        // Save to localStorage for backward compatibility
        const localStorageKey = `suitability_${sessionId}`;
        localStorage.setItem(localStorageKey, JSON.stringify(suitabilityData));
        
        alert('Suitability questionnaire saved successfully!');
        
        // Navigate to next step (you can adjust this as needed)
        navigate(`/fia-application/${sessionId}/beneficiary-info`);
      } else {
        throw new Error(saveResult.error || 'Failed to save suitability data');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError('form', 'Failed to save suitability data', { error: errorMessage }, sessionId);
      alert(`Error saving suitability data: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading suitability questionnaire...
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>
            Suitability Questionnaire
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            This questionnaire helps determine if the Fixed Indexed Annuity product is suitable for your financial situation and objectives.
          </p>
        </div>

        <SuitabilityForm
          questions={suitabilityQuestions as any}
          initialData={existingData}
          onSave={handleSave}
          sessionId={sessionId}
        />

        {saving && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '15px' }}>Saving suitability data...</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Please wait</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuitabilityQuestionnaire; 