import axiosClient from './axiosClient';
import type { HealthResponse } from '../types/Statistics';

/**
 * NOT yet confirmed on the backend. See /logstream-backend-additions/HealthController.java
 * for the Spring Boot implementation this frontend expects.
 */

/** GET /api/health */
export async function getHealth(): Promise<HealthResponse> {
  const { data } = await axiosClient.get<HealthResponse>('/api/health');
  return data;
}
