import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'default' | 'verified' | 'pending' | 'rejected' | 'warning' | 'info' | 'trust'
  size = 'md', // 'sm' | 'md'
  icon: Icon,
  className = '',
}) {
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    pending: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
    rejected: 'bg-red-50 text-red-800 border-red-200 font-bold',
    warning: 'bg-orange-50 text-orange-800 border-orange-200 font-bold',
    info: 'bg-teal-50 text-teal-800 border-teal-200 font-bold',
    trust: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent font-black shadow-xs',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizes[size] || sizes.md} ${variants[variant] || variants.default} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
