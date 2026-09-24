import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LogFilters from '../components/logs/LogFilters';
import LogTable from '../components/logs/LogTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useLogSearch } from '../hooks/useLogs';
import type { LogSearchParams } from '../types/Log';

export default function LogExplorer() {
  const [searchParams] = useSearchParams();
  const { result, loading, error, search } = useLogSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const initialKeyword = searchParams.get('keyword') ?? '';

  useEffect(() => {
    if (initialKeyword) {
      search({ keyword: initialKeyword, level: 'ALL' });
      setHasSearched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKeyword]);

  function handleSearch(params: LogSearchParams) {
    setHasSearched(true);
    search(params);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-ink-primary">Log Explorer</h1>
        <p className="text-sm text-ink-secondary">Search indexed logs across every service.</p>
      </div>

      <div className="rounded-lg border border-surface-border bg-surface-2 p-4">
        <LogFilters initialKeyword={initialKeyword} onSearch={handleSearch} loading={loading} />
      </div>

      {loading && <LoadingSpinner label="Searching logs..." />}
      {error && !loading && <ErrorMessage message={error} onRetry={() => {}} />}

      {!loading && !error && hasSearched && result && (
        <>
          <div className="flex items-center gap-4 text-xs text-ink-secondary">
            <span>
              <span className="mono-num text-ink-primary">{result.totalResults}</span> results
            </span>
            <span>
              in <span className="mono-num text-ink-primary">{result.durationMs.toFixed(0)}</span> ms
            </span>
          </div>
          <LogTable results={result.results} />
        </>
      )}

      {!hasSearched && !loading && (
        <p className="text-sm text-ink-secondary py-8 text-center">
          Enter a keyword above to search the log index.
        </p>
      )}
    </div>
  );
}
