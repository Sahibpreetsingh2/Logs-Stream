import axiosClient from './axiosClient';
import type { AlertRule, TriggeredAlert } from '../types/Alert';

/**
 * NOT yet confirmed on the backend. See /logstream-backend-additions/AlertController.java
 * for the Spring Boot implementation this frontend expects.
 */

/** GET /api/alerts/rules */
export async function getAlertRules(): Promise<AlertRule[]> {
  const { data } = await axiosClient.get<AlertRule[]>('/api/alerts/rules');
  return data;
}

/** POST /api/alerts/rules */
export async function createAlertRule(rule: AlertRule): Promise<AlertRule> {
  const { data } = await axiosClient.post<AlertRule>('/api/alerts/rules', rule);
  return data;
}

/** DELETE /api/alerts/rules/{ruleName} */
export async function deleteAlertRule(ruleName: string): Promise<void> {
  await axiosClient.delete(`/api/alerts/rules/${encodeURIComponent(ruleName)}`);
}

/** GET /api/alerts - triggered alerts */
export async function getTriggeredAlerts(): Promise<TriggeredAlert[]> {
  const { data } = await axiosClient.get<TriggeredAlert[]>('/api/alerts');
  return data;
}
