// Logger utility for FIA eApp
// This can be used to track user actions, form submissions, errors, and other events
// Logs are stored in localStorage and can be exported for analysis

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'auth' | 'form' | 'navigation' | 'api' | 'validation' | 'system';
  message: string;
  data?: any;
  sessionId?: string;
  userId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem('fia_eapp_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load logs from localStorage:', error);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem('fia_eapp_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.warn('Failed to save logs to localStorage:', error);
    }
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    this.saveLogs();
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${entry.level.toUpperCase()}] ${entry.category}: ${entry.message}`, entry.data || '');
    }
  }

  info(category: LogEntry['category'], message: string, data?: any, sessionId?: string) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      category,
      message,
      data,
      sessionId
    });
  }

  warn(category: LogEntry['category'], message: string, data?: any, sessionId?: string) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      category,
      message,
      data,
      sessionId
    });
  }

  error(category: LogEntry['category'], message: string, data?: any, sessionId?: string) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      category,
      message,
      data,
      sessionId
    });
  }

  debug(category: LogEntry['category'], message: string, data?: any, sessionId?: string) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'debug',
      category,
      message,
      data,
      sessionId
    });
  }

  // Export logs for analysis
  exportLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Export logs as JSON string
  exportLogsAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Export logs as CSV
  exportLogsAsCSV(): string {
    const headers = ['timestamp', 'level', 'category', 'message', 'sessionId', 'data'];
    const csvRows = [headers.join(',')];
    
    this.logs.forEach(log => {
      const row = [
        log.timestamp,
        log.level,
        log.category,
        `"${log.message.replace(/"/g, '""')}"`,
        log.sessionId || '',
        log.data ? `"${JSON.stringify(log.data).replace(/"/g, '""')}"` : ''
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  // Get logs by category
  getLogsByCategory(category: LogEntry['category']): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  // Get logs by level
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Get logs by session
  getLogsBySession(sessionId: string): LogEntry[] {
    return this.logs.filter(log => log.sessionId === sessionId);
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const logInfo = (category: LogEntry['category'], message: string, data?: any, sessionId?: string) => 
  logger.info(category, message, data, sessionId);

export const logWarn = (category: LogEntry['category'], message: string, data?: any, sessionId?: string) => 
  logger.warn(category, message, data, sessionId);

export const logError = (category: LogEntry['category'], message: string, data?: any, sessionId?: string) => 
  logger.error(category, message, data, sessionId);

export const logDebug = (category: LogEntry['category'], message: string, data?: any, sessionId?: string) => 
  logger.debug(category, message, data, sessionId); 