import React from 'react';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export function EmptyState({
  title = "No Stays Found",
  description = "Try adjusting your filters or searching in another sacred sector.",
  icon: Icon = Sparkles,
  actionLabel,
  onAction,
}) {
  return (
    <div className="bg-white rounded-3xl p-10 sm:p-12 border border-gray-100 shadow-sm text-center max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something Went Wrong",
  description = "Unable to complete request. Please verify your connection or try again.",
  onRetry,
}) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-sm text-center max-w-md mx-auto space-y-4">
      <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="sm" icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
