import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createAlertRule,
  deleteAlertRule,
  getAlertRules,
  getTriggeredAlerts,
} from '../api/alertApi';
import { ApiError } from '../api/axiosClient';
import type { AlertRule, TriggeredAlert } from '../types/Alert';

const ALERTS_POLL_MS = 10_000;

/** Triggered alerts, polled every 10s (single interval, cleaned up on unmount). */
export function useTriggeredAlerts() {
  const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await getTriggeredAlerts();
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load alerts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    intervalRef.current = window.setInterval(fetchAlerts, ALERTS_POLL_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts };
}

/** Alert rules: list + create + delete, no polling (user-driven CRUD). */
export function useAlertRules() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAlertRules();
      setRules(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load alert rules.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const addRule = useCallback(
    async (rule: AlertRule) => {
      setMutating(true);
      try {
        await createAlertRule(rule);
        await fetchRules();
        return { success: true as const };
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Unable to create alert rule.';
        return {
          success: false as const,
          message,
          validationErrors: err instanceof ApiError ? err.validationErrors : undefined,
        };
      } finally {
        setMutating(false);
      }
    },
    [fetchRules]
  );

  const removeRule = useCallback(
    async (ruleName: string) => {
      setMutating(true);
      try {
        await deleteAlertRule(ruleName);
        await fetchRules();
        return { success: true as const };
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Unable to delete alert rule.';
        return { success: false as const, message };
      } finally {
        setMutating(false);
      }
    },
    [fetchRules]
  );

  return { rules, loading, error, mutating, addRule, removeRule, refetch: fetchRules };
}
