import axiosClient from './axiosClient';

// All REST calls to the Spring Boot log backend.

// GET /api/logs/search?keyword=...&maxResults=...
export function searchLogs(filters) {
  return axiosClient
    .get('/logs/search', {
      params: {
        keyword: filters.keyword,
        maxResults: filters.size || 20,
      },
    })
    .then((res) => res.data);
}

// GET /api/logs/{id}
// ⚠️ No matching backend endpoint yet
export function getLogById(id) {
  return axiosClient.get(`/logs/${id}`).then((res) => res.data);
}

// GET /api/logs/services
// ⚠️ No matching backend endpoint yet
export function getServiceNames() {
  return axiosClient.get('/logs/services').then((res) => res.data);
}

// GET /api/logs/statistics
export function getStatistics() {
  return axiosClient
    .get('/logs/statistics')
    .then((res) => res.data);
}

// GET /api/logs/statistics/level/{level}
export function getLevelStatistics(level) {
  return axiosClient
    .get(`/logs/statistics/level/${encodeURIComponent(level)}`)
    .then((res) => res.data);
}

// POST /api/logs/statistics/reset
export function resetStatistics() {
  return axiosClient
    .post('/logs/statistics/reset')
    .then((res) => res.data);
}

// GET /api/logs/stats/volume
// ⚠️ No matching backend endpoint yet
export function getVolumeOverTime(params) {
  return axiosClient
    .get('/logs/stats/volume', { params })
    .then((res) => res.data);
}

// GET /api/logs/stats/by-service
// ⚠️ No matching backend endpoint yet
export function getCountsByService(range) {
  return axiosClient
    .get('/logs/stats/by-service', { params: range })
    .then((res) => res.data);
}

// GET /api/alerts/active
// ⚠️ No matching backend endpoint yet
export function getActiveAlerts() {
  return axiosClient
    .get('/alerts/active')
    .then((res) => res.data);
}

// GET /api/logs/test
export function testLogApi() {
  return axiosClient
    .get('/logs/test')
    .then((res) => res.data);
}

// POST /api/logs -> add a new log entry
// body: { timestamp, level, service, message }
export function addLog(entry) {
  return axiosClient
    .post('/logs', entry)
    .then((res) => res.data);
}