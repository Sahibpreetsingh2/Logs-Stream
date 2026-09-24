export interface LogStatistics {
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount?: number;
}

export interface TimelineBucket {
  timestamp: string;
  info: number;
  warn: number;
  error: number;
}

export interface ServiceSummary {
  name: string;
  logCount?: number;
  errorCount?: number;
  status?: 'UP' | 'DOWN' | string;
}

export type ComponentStatus = 'UP' | 'DOWN' | string;

export interface HealthResponse {
  status: ComponentStatus;
  components?: Record<string, { status: ComponentStatus; details?: Record<string, unknown> }>;
}
