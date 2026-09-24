import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-surface-border px-4 py-3">
      <span className="text-xs text-ink-secondary">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex items-center justify-center rounded-md border border-surface-border p-1.5 text-ink-secondary hover:text-ink-primary hover:border-brand-dim disabled:opacity-40 disabled:hover:border-surface-border disabled:hover:text-ink-secondary transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex items-center justify-center rounded-md border border-surface-border p-1.5 text-ink-secondary hover:text-ink-primary hover:border-brand-dim disabled:opacity-40 disabled:hover:border-surface-border disabled:hover:text-ink-secondary transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
