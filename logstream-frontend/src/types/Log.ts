export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id?: string;
  timestamp: string;
  service: string;
  level: LogLevel | string;
  message: string;
  responseTime?: number;
}

export interface LogSearchResult {
  message: string;
  service?: string;
  level?: string;
  score: number;
  timestamp?: string;
  id?: string;
}

export interface LogSearchResponse {
  results: LogSearchResult[];
  totalResults: number;
  durationMs: number;
}

export interface LogSearchParams {
  keyword: string;
  service?: string;
  level?: string;
  from?: string;
  to?: string;
  maxResults?: number;
}
