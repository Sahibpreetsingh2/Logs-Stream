import React, { createContext, useContext, useState, useCallback } from 'react';

const LogFilterContext = createContext(null);

const DEFAULT_FILTERS = {
  keyword: '',
  serviceName: '',
  level: '', // '' = all, otherwise INFO | WARN | ERROR
  startTime: null,
  endTime: null,
  page: 0,
  size: 25,
};

export function LogFilterProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const updateFilters = useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial, page: partial.page ?? 0 }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <LogFilterContext.Provider value={{ filters, updateFilters, resetFilters }}>
      {children}
    </LogFilterContext.Provider>
  );
}

export function useLogFilters() {
  const ctx = useContext(LogFilterContext);
  if (!ctx) throw new Error('useLogFilters must be used within LogFilterProvider');
  return ctx;
}
