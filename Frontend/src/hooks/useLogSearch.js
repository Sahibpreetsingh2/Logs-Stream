import { useCallback, useEffect, useState } from 'react';
import { searchLogs } from '../api/logService';

export function useLogSearch(filters) {
  const [data, setData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSearch = useCallback(async () => {
    // Backend requires keyword
    if (!filters.keyword?.trim()) {
      setData({
        content: [],
        totalElements: 0,
        totalPages: 0,
      });
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await searchLogs(filters);

      const logs = Array.isArray(result) ? result : [];

      setData({
        content: logs,
        totalElements: logs.length,
        totalPages: logs.length > 0 ? 1 : 0,
      });
    } catch (err) {
      console.error('Search API error:', err);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to search logs. Check the backend connection.'
      );

      setData({
        content: [],
        totalElements: 0,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  return {
    ...data,
    loading,
    error,
    refetch: runSearch,
  };
}