import React from 'react';

interface ExamModeToggleProps {
  isExamMode: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const ExamModeToggle: React.FC<ExamModeToggleProps> = ({ isExamMode, onToggle, disabled }) => {
  return (
    <div className={`flex items-center justify-between mt-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg transition-opacity ${disabled ? 'opacity-50' : ''}`}>
        <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Exam Mode</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                {isExamMode ? 'Timer will be on. Results after quiz.' : 'Practice mode. Get instant feedback.'}
            </p>
        </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="sr-only">Toggle Exam Mode</span>
        <span
          className={`${
            isExamMode ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
          } absolute w-full h-full rounded-full`}
        ></span>
        <span
          className={`${
            isExamMode ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
        />
      </button>
    </div>
  );
};

export default ExamModeToggle;