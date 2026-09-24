import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 14, md: 20, lg: 28 };

export default function LoadingSpinner({ label = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-ink-secondary py-6 justify-center" role="status">
      <Loader2 size={sizeMap[size]} className="animate-spin text-brand" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
