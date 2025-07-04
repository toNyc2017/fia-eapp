import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const steps = [
  { label: 'Applicant Information', path: (sessionId: string) => `/fia-application/${sessionId}/step/1` },
  { label: 'Product Selection', path: (sessionId: string) => `/fia-application/${sessionId}/step/2` },
  { label: 'Owner Information', path: (sessionId: string) => `/fia-application/${sessionId}/owner-info` },
  { label: 'Joint Owner Question', path: (sessionId: string) => `/fia-application/${sessionId}/joint-owner-question` },
  { label: 'Joint Owner Info', path: (sessionId: string) => `/fia-application/${sessionId}/joint-owner-info` },
  { label: 'Beneficiaries', path: (sessionId: string) => `/fia-application/${sessionId}/beneficiary-info` },
  { label: 'Funding', path: (sessionId: string) => '#' },
  { label: 'Additional Information', path: (sessionId: string) => '#' },
  { label: 'Suitability', path: (sessionId: string) => '#' },
  { label: 'Agent Disclosures', path: (sessionId: string) => '#' },
  { label: 'Remarks', path: (sessionId: string) => '#' },
  { label: 'Documents', path: (sessionId: string) => '#' },
  { label: 'Signature', path: (sessionId: string) => '#' },
];

const getStepIndex = (pathname: string) => {
  if (pathname.includes('/step/1')) return 0;
  if (pathname.includes('/step/2')) return 1;
  if (pathname.includes('/owner-info')) return 2;
  if (pathname.includes('/joint-owner-question')) return 3;
  if (pathname.includes('/joint-owner-info')) return 4;
  if (pathname.includes('/beneficiary-info')) return 5;
  // ...add more as you implement more steps
  return -1;
};

const SideNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const activeIndex = getStepIndex(location.pathname);

  // Hide on login page
  if (location.pathname === '/' || location.pathname === '/launcher') return null;

  const canNavigate = typeof sessionId === 'string' && sessionId.length > 0;
  
  // Debug logging
  console.log('SideNav Debug:', {
    sessionId,
    canNavigate,
    pathname: location.pathname,
    activeIndex
  });

  return (
    <nav style={{
      width: 220,
      minHeight: '100vh',
      background: '#fffbe6',
      borderRight: '1.5px solid #e3e8ee',
      padding: '32px 0 0 0',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#009fe3', margin: '0 0 32px 32px', letterSpacing: 1 }}>eApp Steps</div>
      {steps.map((step, idx) => {
        const isActive = idx === activeIndex;
        const isClickable = canNavigate && step.path(sessionId!) !== '#';
        return (
          <div
            key={step.label}
            onClick={() => {
              console.log('Step clicked:', step.label, 'isClickable:', isClickable);
              if (isClickable) {
                console.log('Navigating to:', step.path(sessionId!));
                navigate(step.path(sessionId!));
              } else {
                console.log('Step not clickable:', step.label);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 24px',
              cursor: isClickable ? 'pointer' : 'default',
              background: isActive ? '#e6f2fa' : 'transparent',
              color: isActive ? '#009fe3' : '#333',
              fontWeight: isActive ? 700 : 500,
              borderLeft: isActive ? '4px solid #009fe3' : '4px solid transparent',
              transition: 'background 0.2s, color 0.2s',
              opacity: isClickable ? 1 : 0.6,
              userSelect: 'none',
            }}
          >
            <span style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: isActive ? '#009fe3' : (idx < activeIndex ? '#6fcf97' : '#e3e8ee'),
              marginRight: 14,
              border: isActive ? '2px solid #009fe3' : '2px solid #e3e8ee',
              boxSizing: 'border-box',
            }} />
            {step.label}
          </div>
        );
      })}
    </nav>
  );
};

export default SideNav; 