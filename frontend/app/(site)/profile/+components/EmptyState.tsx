import { AlertTriangle } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-start rounded-lg border border-orange-100 bg-orange-50 p-4 text-sm font-medium text-orange-800">
      <AlertTriangle className="me-2 size-5 text-orange-600" />
      <span>{message}</span>
    </div>
  );
};
