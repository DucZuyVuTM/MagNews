import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
  retryText = "Retry",
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`text-center py-10 ${className}`}>
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 font-medium mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          {retryText}
        </button>
      )}
    </div>
  );
}
