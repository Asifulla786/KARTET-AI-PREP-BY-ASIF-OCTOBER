import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-700 dark:text-slate-200 font-semibold text-lg">Crafting Your Custom Quiz...</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Our AI is searching past papers and translating questions just for you. This can take a moment.
      </p>
    </div>
  );
};

export default LoadingSpinner;