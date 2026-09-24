import axiosClient from './axiosClient';
import type { LogEntry, LogSearchParams, LogSearchResponse } from '../types/Log';
import type { ServiceSummary } from '../types/Statistics';

/**
 * CONFIRMED backend endpoints (exist today in LogStream's Spring Boot service):
 *   POST /api/logs
 *   GET  /api/logs/search?keyword={keyword}
 *
 * The remaining functions below call endpoints that are NOT yet confirmed
 * (getRecentLogs, getServices). They are implemented against the API
 * contract this frontend expects; see README.md "Backend endpoints" and
 * /logstream-backend-additions for the Spring Boot controllers that make
 * them real. Until those exist, calls will fail with a 404 and the UI
 * will show that state rather than fabricating data.
 */

/** POST /api/logs - confirmed. Ingest a single log entry. */
export async function ingestLog(log: LogEntry): Promise<LogEntry> {
  const { data } = await axiosClient.post<LogEntry>('/api/logs', log);
  return data;
}

/**
 * GET /api/logs/search?keyword=... - confirmed endpoint, extended here with
 * optional filters (service, level, from, to) IF the backend supports them.
 * Only parameters with a value are sent, so calling this against a backend
 * that ignores the extra filters still works (it just won't filter).
 */
export async function searchLogs(params: LogSearchParams): Promise<LogSearchResponse> {
  const { keyword, service, level, from, to, maxResults } = params;
  const query: Record<string, string | number> = { keyword };
  if (service) query.service = service;
  if (level && level !== 'ALL') query.level = level;
  if (from) query.from = from;
  if (to) query.to = to;
  if (maxResults) query.maxResults = maxResults;

  const { data } = await axiosClient.get('/api/logs/search', { params: query });

  // The confirmed endpoint may return either a bare array of results or an
  // envelope with { results, totalResults, durationMs }. Normalize both
  // shapes so the UI has one consistent type to work with.
  if (Array.isArray(data)) {
    return { results: data, totalResults: data.length, durationMs: 0 };
  }
  return {
    results: data.results ?? [],
    totalResults: data.totalResults ?? data.results?.length ?? 0,
    durationMs: data.durationMs ?? 0,
  };
}

/** GET /api/logs/recent?limit=20 - NOT yet confirmed. See backend TODO. */
export async function getRecentLogs(limit = 20): Promise<LogEntry[]> {
  const { data } = await axiosClient.get<LogEntry[]>('/api/logs/recent', {
    params: { limit },
  });
  return data;
}

/** GET /api/logs/services - NOT yet confirmed. See backend TODO. */
export async function getServices(): Promise<ServiceSummary[]> {
  const { data } = await axiosClient.get<ServiceSummary[]>('/api/logs/services');
  return data;
}
