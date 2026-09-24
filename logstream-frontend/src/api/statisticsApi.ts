import axiosClient from './axiosClient';
import type { LogStatistics, TimelineBucket } from '../types/Statistics';

/**
 * NOT yet confirmed on the backend. See /logstream-backend-additions/LogStatisticsController.java
 * for the Spring Boot implementation this frontend expects.
 */

/** GET /api/logs/statistics */
export async function getStatistics(): Promise<LogStatistics> {
  const { data } = await axiosClient.get<LogStatistics>('/api/logs/statistics');
  return data;
}

/**
 * GET /api/logs/statistics/timeline
 * Historical series for the "Logs over time" chart. If this endpoint isn't
 * implemented yet, the caller (useStatistics hook) catches the 404 and the
 * chart renders an empty state instead of fabricated points.
 */
export async function getStatisticsTimeline(): Promise<TimelineBucket[]> {
  const { data } = await axiosClient.get<TimelineBucket[]>('/api/logs/statistics/timeline');
  return data;
}
