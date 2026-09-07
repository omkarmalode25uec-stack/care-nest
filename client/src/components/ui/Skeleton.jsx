import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-2xl" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-3/4 h-5 bg-gray-200 rounded" />
        <div className="w-1/2 h-4 bg-gray-200 rounded" />
      </div>
      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="w-20 h-6 bg-gray-200 rounded" />
        <div className="w-28 h-9 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default Skeleton;
