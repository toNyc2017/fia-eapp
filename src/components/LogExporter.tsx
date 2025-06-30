import React, { useState } from 'react';
import { logger } from '../utils/logger';

const LogExporter: React.FC = () => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [logs, setLogs] = useState<string>('');

  const handleExport = () => {
    let exportedData: string;
    
    if (exportFormat === 'json') {
      exportedData = logger.exportLogsAsJSON();
    } else {
      exportedData = logger.exportLogsAsCSV();
    }
    
    setLogs(exportedData);
  };

  const handleDownload = () => {
    if (!logs) return;
    
    const blob = new Blob([logs], { 
      type: exportFormat === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fia-eapp-logs-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs('');
  };

  const logStats = () => {
    const allLogs = logger.exportLogs();
    const total = allLogs.length;
    const byLevel = {
      info: allLogs.filter(log => log.level === 'info').length,
      warn: allLogs.filter(log => log.level === 'warn').length,
      error: allLogs.filter(log => log.level === 'error').length,
      debug: allLogs.filter(log => log.level === 'debug').length
    };
    const byCategory = {
      auth: allLogs.filter(log => log.category === 'auth').length,
      form: allLogs.filter(log => log.category === 'form').length,
      navigation: allLogs.filter(log => log.category === 'navigation').length,
      api: allLogs.filter(log => log.category === 'api').length,
      validation: allLogs.filter(log => log.category === 'validation').length,
      system: allLogs.filter(log => log.category === 'system').length
    };
    
    return { total, byLevel, byCategory };
  };

  const stats = logStats();

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      margin: '20px',
      maxWidth: '800px'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Log Exporter</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#666', marginBottom: '10px' }}>Log Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Total Logs:</strong> {stats.total}
          </div>
          <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Info:</strong> {stats.byLevel.info}
          </div>
          <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Warnings:</strong> {stats.byLevel.warn}
          </div>
          <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Errors:</strong> {stats.byLevel.error}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Export Format:
        </label>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
        
        <button
          onClick={handleExport}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Export Logs
        </button>
        
        <button
          onClick={handleClearLogs}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Logs
        </button>
      </div>

      {logs && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={handleDownload}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            Download {exportFormat.toUpperCase()} File
          </button>
          
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
              {logs}
            </pre>
          </div>
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#666' }}>
        <p><strong>Usage:</strong> Export logs to share with AI tools for analysis. Logs include:</p>
        <ul>
          <li>User authentication events</li>
          <li>Form submissions and validation</li>
          <li>Navigation between pages</li>
          <li>API calls and responses</li>
          <li>System errors and warnings</li>
        </ul>
      </div>
    </div>
  );
};

export default LogExporter; 