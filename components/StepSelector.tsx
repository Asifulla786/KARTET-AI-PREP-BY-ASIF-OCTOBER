import React from 'react';

interface Step {
  name: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface StepSelectorProps {
  steps: Step[];
}

const StepSelector: React.FC<StepSelectorProps> = ({ steps }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-24' : ''}`}>
            {step.status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gradient-to-r from-sky-500 to-blue-600" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                  </svg>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-600 bg-white dark:bg-slate-800"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-600 animate-pulse" aria-hidden="true" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent"
                    aria-hidden="true"
                  />
                </div>
              </>
            )}
             <div className="absolute top-10 w-max max-w-20 sm:max-w-none text-center -translate-x-1/2 left-1/2">
                <span className={`text-xs sm:text-sm font-medium ${step.status === 'current' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`}>{step.name}</span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};


export default StepSelector;