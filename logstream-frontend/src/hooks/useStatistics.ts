import { useCallback, useEffect, useRef, useState } from 'react';
import { getStatistics, getStatisticsTimeline } from '../api/statisticsApi';
import { ApiError } from '../api/axiosClient';
import type { LogStatistics, TimelineBucket } from '../types/Statistics';

const DASHBOARD_POLL_MS = 10_000;

export function useStatistics() {
  const [stats, setStats] = useState<LogStatistics | null>(null);
  const [timeline, setTimeline] = useState<TimelineBucket[]>([]);
  const [timelineAvailable, setTimelineAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const data = await getStatistics();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load statistics.');
    } finally {
      setLoading(false);
    }

    // Timeline is fetched independently: if it 404s (not implemented yet),
    // the chart shows an empty state rather than breaking the whole dashboard.
    try {
      const points = await getStatisticsTimeline();
      setTimeline(points);
      setTimelineAvailable(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setTimelineAvailable(false);
      }
      setTimeline([]);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    intervalRef.current = window.setInterval(fetchAll, DASHBOARD_POLL_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  return { stats, timeline, timelineAvailable, loading, error, refetch: fetchAll };
}
