import React from 'react';

const LoadingSpinner = ({ text = 'Loading placement data...', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-blue-600 border-t-transparent animate-spin`}
      />
      {text && <p className="text-xs font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
