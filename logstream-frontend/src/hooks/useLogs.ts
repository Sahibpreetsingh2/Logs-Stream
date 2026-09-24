import { useCallback, useEffect, useRef, useState } from 'react';
import { getRecentLogs, searchLogs } from '../api/logApi';
import { ApiError } from '../api/axiosClient';
import type { LogEntry, LogSearchParams, LogSearchResponse } from '../types/Log';

const RECENT_LOGS_POLL_MS = 10_000;

/**
 * Recent logs, polled every 10s. A single interval is created per mount and
 * always cleared on unmount / dependency change - never stacked.
 */
export function useRecentLogs(limit = 20) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await getRecentLogs(limit);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load logs.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();
    intervalRef.current = window.setInterval(fetchLogs, RECENT_LOGS_POLL_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}

/** On-demand log search (Log Explorer). No polling - user-triggered. */
export function useLogSearch() {
  const [result, setResult] = useState<LogSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: LogSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const start = performance.now();
      const data = await searchLogs(params);
      const clientDuration = performance.now() - start;
      setResult({ ...data, durationMs: data.durationMs || clientDuration });
    } catch (err) {
      setResult(null);
      setError(err instanceof ApiError ? err.message : 'Unable to search logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, search };
}
