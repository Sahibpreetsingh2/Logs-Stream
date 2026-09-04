import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import SearchBar from '../components/search/SearchBar.jsx';
import FilterPanel from '../components/search/FilterPanel.jsx';
import LogTable from '../components/logs/LogTable.jsx';
import { useLogFilters } from '../context/LogFilterContext.jsx';
import { useLogSearch } from '../hooks/useLogSearch.js';

export default function SearchPage() {
  const { filters, updateFilters, resetFilters } = useLogFilters();
  const { content, totalPages, loading, error } = useLogSearch(filters);

  return (
    <div>
      <Navbar title="Search Logs" subtitle="Full-text search with service, level, and time filters" />
      <div className="page-body">
        <SearchBar value={filters.keyword} onSearch={(keyword) => updateFilters({ keyword })} />

        <div className="search-layout">
          <FilterPanel filters={filters} onChange={updateFilters} onReset={resetFilters} />

          <LogTable
            logs={content}
            loading={loading}
            error={error}
            page={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => updateFilters({ page })}
          />
        </div>
      </div>
    </div>
  );
}
