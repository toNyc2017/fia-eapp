# FIA eApp Logging System Documentation

## Overview

The FIA eApp includes a comprehensive logging system designed to track user interactions, form submissions, navigation patterns, and system events. This data can be exported and analyzed by AI tools to understand user behavior, identify issues, and optimize the application.

## Log Structure

Each log entry contains the following fields:

```typescript
interface LogEntry {
  timestamp: string;        // ISO 8601 timestamp
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'auth' | 'form' | 'navigation' | 'api' | 'validation' | 'system';
  message: string;          // Human-readable description
  data?: any;              // Additional structured data
  sessionId?: string;      // User session identifier
  userId?: string;         // User identifier (future use)
}
```

## Log Categories

### 1. Authentication (`auth`)
- User login attempts (successful/failed)
- User logout events
- Session creation and management

### 2. Form Interactions (`form`)
- Field changes and updates
- Form submissions (successful/failed)
- Form data loading and saving
- Form validation events

### 3. Navigation (`navigation`)
- Page visits and transitions
- Application flow progression
- Back/forward navigation
- Session-based routing

### 4. API Calls (`api`)
- External service integrations (GIACT, NIPR, etc.)
- API request/response logging
- Error handling and retries

### 5. Validation (`validation`)
- Form validation failures
- Business rule violations
- Data integrity checks

### 6. System (`system`)
- Application startup/shutdown
- Error handling
- Performance metrics
- Configuration changes

## Usage Examples

### Basic Logging
```typescript
import { logInfo, logError, logWarn } from '../utils/logger';

// Info logging
logInfo('auth', 'User login successful', { email: 'user@example.com' }, sessionId);

// Error logging
logError('validation', 'SSN validation failed', { ssn: '123-45-6789' }, sessionId);

// Warning logging
logWarn('navigation', 'User attempted to access restricted page', { page: '/admin' }, sessionId);
```

### Advanced Logging with Data
```typescript
// Form submission with detailed data
logInfo('form', 'Step 1 completed', {
  fieldsCompleted: 10,
  hasRequiredData: true,
  formType: 'applicant_information'
}, sessionId);

// API call logging
logInfo('api', 'GIACT bank validation request', {
  endpoint: '/validate/bank',
  requestId: 'req_12345',
  bankRoutingNumber: '123456789'
}, sessionId);
```

## Exporting Logs

### Via UI Component
The application includes a `LogExporter` component that allows users to:
- View log statistics (total logs, by level, by category)
- Export logs in JSON or CSV format
- Download log files for analysis
- Clear logs when needed

### Programmatic Export
```typescript
import { logger } from '../utils/logger';

// Export as JSON
const jsonLogs = logger.exportLogsAsJSON();

// Export as CSV
const csvLogs = logger.exportLogsAsCSV();

// Get raw log array
const allLogs = logger.exportLogs();

// Filter by category
const authLogs = logger.getLogsByCategory('auth');

// Filter by level
const errorLogs = logger.getLogsByLevel('error');

// Filter by session
const sessionLogs = logger.getLogsBySession('session_12345');
```

## Log Analysis for AI Tools

### Common Analysis Patterns

1. **User Journey Analysis**
   ```javascript
   // Find all logs for a specific session
   const sessionLogs = logs.filter(log => log.sessionId === 'session_12345');
   
   // Analyze navigation flow
   const navigationFlow = sessionLogs
     .filter(log => log.category === 'navigation')
     .map(log => log.message);
   ```

2. **Form Completion Analysis**
   ```javascript
   // Find form submission patterns
   const formSubmissions = logs.filter(log => 
     log.category === 'form' && 
     log.message.includes('submitted successfully')
   );
   
   // Analyze completion rates
   const completionRate = formSubmissions.length / totalSessions;
   ```

3. **Error Pattern Analysis**
   ```javascript
   // Find common validation errors
   const validationErrors = logs.filter(log => 
     log.category === 'validation' && 
     log.level === 'error'
   );
   
   // Group by error type
   const errorTypes = validationErrors.reduce((acc, log) => {
     const type = log.message.split(':')[0];
     acc[type] = (acc[type] || 0) + 1;
     return acc;
   }, {});
   ```

4. **Performance Analysis**
   ```javascript
   // Analyze API response times
   const apiLogs = logs.filter(log => log.category === 'api');
   const responseTimes = apiLogs.map(log => log.data?.responseTime).filter(Boolean);
   const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
   ```

## Data Privacy and Security

- **Sensitive Data Masking**: Personal information (SSN, phone numbers) is partially masked in logs
- **Local Storage**: Logs are stored locally in the browser's localStorage
- **Export Control**: Users control when and how logs are exported
- **Session Isolation**: Logs are tied to specific sessions for privacy

## Integration with External AI Tools

### Export Format for Analysis
```json
{
  "timestamp": "2025-01-27T10:30:00.000Z",
  "level": "info",
  "category": "form",
  "message": "Step 1 form submitted successfully",
  "data": {
    "hasData": true,
    "fieldsCompleted": 10
  },
  "sessionId": "session_1706362200000"
}
```

### CSV Format for Spreadsheet Analysis
```csv
timestamp,level,category,message,sessionId,data
2025-01-27T10:30:00.000Z,info,form,Step 1 form submitted successfully,session_1706362200000,"{""hasData"":true,""fieldsCompleted"":10}"
```

## Best Practices for AI Analysis

1. **Filter by Time Range**: Focus on recent logs for current issues
2. **Group by Session**: Analyze complete user journeys
3. **Correlate Events**: Look for patterns between different log categories
4. **Identify Anomalies**: Flag unusual patterns or error spikes
5. **Track Metrics**: Monitor completion rates, error rates, and performance

## Future Enhancements

- Real-time log streaming to external analytics platforms
- Advanced filtering and search capabilities
- Automated anomaly detection
- Integration with business intelligence tools
- Custom log categories for specific business needs 